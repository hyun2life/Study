"""
Blackshot Discord 일간/주간 리포트 생성기

기능 개요
- Discord REST API로 채널 메시지를 수집합니다.
- OpenAI를 사용해 일간/주간 요약을 생성합니다.
- 중복 처리와 중복 메일 발송을 방지합니다.
- HTML 리포트를 저장하고 이메일로 발송합니다.

리포트 구간 동작 방식
- `report.window_mode = "calendar_day"`이면 로컬 기준 하루 전체를 사용합니다.
- `report.daily_days_ago = 1`이면 기본 기준일은 어제입니다.
- `report.window_mode = "rolling_hours"`이면 `lookback_hours`를 사용합니다.
- 이미 처리한 메시지 ID는 제외합니다.
- 동일 기준일 리포트는 기본적으로 한 번만 발송합니다.
- 주간 리포트는 `report_date`를 끝점으로 하는 7일 구간을 요약합니다.
"""

from __future__ import annotations

import argparse
import html
import json
import logging
import re
import smtplib
import sys
from collections import Counter
from datetime import datetime, timedelta, timezone, time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any

import requests
from openai import APIConnectionError, APIError, APITimeoutError, OpenAI, RateLimitError

BASE_DIR = Path(__file__).parent
CONFIG_PATH = BASE_DIR / "config.json"
STATE_PATH = BASE_DIR / "state.json"
REPORTS_DIR = BASE_DIR / "reports"
DAILY_DIR = REPORTS_DIR / "daily"
WEEKLY_DIR = REPORTS_DIR / "weekly"
LOGS_DIR = BASE_DIR / "logs"

DISCORD_API = "https://discord.com/api/v10"
DISCORD_EPOCH_MS = 1420070400000
DEFAULT_TIMEZONE = "Asia/Seoul"
SEEN_ID_RETENTION_DAYS = 21
MAX_PROMPT_MESSAGES = 200
MAX_MESSAGE_PREVIEW_LEN = 280

CATEGORY_LABELS = {
    "feedback": "피드백",
    "bug_report": "버그 제보",
    "event": "이벤트",
    "announcement": "공지 반응",
    "general": "일반 채팅",
}

STOPWORDS = {
    "the", "and", "for", "with", "this", "that", "have", "from", "you", "your",
    "are", "was", "were", "been", "will", "there", "they", "them", "then", "than",
    "http", "https", "www", "com", "img", "gif", "png", "jpg", "jpeg",
    "but", "just", "more", "some", "very", "into", "about", "would", "could",
    "문의", "제보", "버그", "공지", "이벤트", "자유", "채팅", "에서", "으로", "하는",
    "있는", "없음", "있음",
}

REPORTS_DIR.mkdir(exist_ok=True)
DAILY_DIR.mkdir(exist_ok=True)
WEEKLY_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

LOG_PATH = LOGS_DIR / f"report_{datetime.now().strftime('%Y%m%d')}.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_PATH, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger(__name__)


def load_config() -> dict[str, Any]:
    try:
        config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"config.json 파일을 찾을 수 없습니다: {exc}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"config.json 형식이 올바르지 않습니다: {exc}") from exc

    required_top = ["discord", "openai", "email", "report"]
    missing = [k for k in required_top if k not in config]
    if missing:
        raise SystemExit(f"config.json에 필수 항목이 없습니다: {', '.join(missing)}")

    report_cfg = config["report"]
    report_cfg.setdefault("game_title", "Blackshot")
    report_cfg.setdefault("language", "ko")
    report_cfg.setdefault("timezone", DEFAULT_TIMEZONE)
    report_cfg.setdefault("window_mode", "calendar_day")
    report_cfg.setdefault("daily_days_ago", 1)
    report_cfg.setdefault("lookback_hours", 24)
    report_cfg.setdefault("daily_send_enabled", True)
    report_cfg.setdefault("weekly_enabled", True)
    report_cfg.setdefault("weekly_send_weekday", 4)
    report_cfg.setdefault("save_html", True)

    openai_cfg = config["openai"]
    openai_cfg.setdefault("model", "gpt-5")
    openai_cfg.setdefault("max_input_messages", MAX_PROMPT_MESSAGES)
    openai_cfg.setdefault("max_output_tokens", 2400)
    openai_cfg.setdefault("reasoning_effort", "low")
    openai_cfg.setdefault("text_verbosity", "low")

    return config


def get_tz(config: dict[str, Any]):
    tz_name = config["report"].get("timezone", DEFAULT_TIMEZONE)
    try:
        from zoneinfo import ZoneInfo
        return ZoneInfo(tz_name)
    except Exception:
        fallback_timezones = {
            "Asia/Seoul": timezone(timedelta(hours=9), name="Asia/Seoul"),
            "UTC": timezone.utc,
        }
        if tz_name in fallback_timezones:
            log.warning("timezone %s 로드에 실패했습니다. 고정 오프셋 타임존으로 대체합니다.", tz_name)
            return fallback_timezones[tz_name]
        log.warning("timezone %s 로드에 실패했습니다. UTC를 사용합니다.", tz_name)
        return timezone.utc


def snowflake_from_datetime(dt: datetime) -> str:
    unix_ms = int(dt.astimezone(timezone.utc).timestamp() * 1000)
    return str((unix_ms - DISCORD_EPOCH_MS) << 22)


def discord_message_datetime(message_id: str) -> datetime:
    unix_ms = (int(message_id) >> 22) + DISCORD_EPOCH_MS
    return datetime.fromtimestamp(unix_ms / 1000, tz=timezone.utc)


def load_state() -> dict[str, Any]:
    if not STATE_PATH.exists():
        return {
            "seen_messages": {},
            "daily_reports": {},
            "weekly_reports": {},
        }

    try:
        state = json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except Exception:
        log.warning("state.json 로드에 실패했습니다. 빈 상태로 시작합니다.")
        return {
            "seen_messages": {},
            "daily_reports": {},
            "weekly_reports": {},
        }

    state.setdefault("seen_messages", {})
    state.setdefault("daily_reports", {})
    state.setdefault("weekly_reports", {})
    return state


def save_state(state: dict[str, Any]) -> None:
    STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def prune_seen_messages(state: dict[str, Any], now_utc: datetime) -> None:
    cutoff = now_utc - timedelta(days=SEEN_ID_RETENTION_DAYS)
    seen = state.get("seen_messages", {})
    pruned = {}
    for msg_id, iso_ts in seen.items():
        try:
            ts = datetime.fromisoformat(iso_ts)
            if ts.tzinfo is None:
                ts = ts.replace(tzinfo=timezone.utc)
        except Exception:
            continue
        if ts >= cutoff:
            pruned[msg_id] = ts.isoformat()
    state["seen_messages"] = pruned


def get_report_window(config: dict[str, Any], now_local: datetime, tzinfo):
    report_cfg = config["report"]
    window_mode = str(report_cfg.get("window_mode", "calendar_day")).lower()

    if window_mode == "calendar_day":
        daily_days_ago = int(report_cfg.get("daily_days_ago", 1))
        report_date = now_local.date() - timedelta(days=daily_days_ago)
        start_local = datetime.combine(report_date, time.min, tzinfo=tzinfo)
        end_local_exclusive = start_local + timedelta(days=1)
        return {
            "window_mode": window_mode,
            "report_date": report_date.isoformat(),
            "after_dt_utc": start_local.astimezone(timezone.utc),
            "before_dt_utc": end_local_exclusive.astimezone(timezone.utc),
            "window_label": f"{report_date.isoformat()} 00:00:00 ~ 23:59:59 ({report_cfg.get('timezone', DEFAULT_TIMEZONE)})",
        }

    lookback_hours = int(report_cfg.get("lookback_hours", 24))
    after_dt_utc = now_local.astimezone(timezone.utc) - timedelta(hours=lookback_hours)
    return {
        "window_mode": "rolling_hours",
        "report_date": now_local.date().isoformat(),
        "after_dt_utc": after_dt_utc,
        "before_dt_utc": now_local.astimezone(timezone.utc),
        "window_label": f"최근 {lookback_hours}시간",
    }


def fetch_messages(channel_id: str, token: str, after_dt: datetime, before_dt: datetime | None = None) -> list[dict[str, Any]]:
    headers = {"Authorization": f"Bot {token}"}
    after_snowflake = snowflake_from_datetime(after_dt)
    last_id = after_snowflake
    collected: list[dict[str, Any]] = []

    while True:
        url = f"{DISCORD_API}/channels/{channel_id}/messages"
        params = {"limit": 100, "after": last_id}
        resp = requests.get(url, headers=headers, params=params, timeout=20)

        if resp.status_code == 403:
            log.warning("채널 %s 에 접근할 수 없습니다 (403).", channel_id)
            break
        if resp.status_code == 404:
            log.warning("채널 %s 을(를) 찾을 수 없습니다 (404).", channel_id)
            break
        resp.raise_for_status()

        batch = resp.json()
        if not batch:
            break

        filtered = []
        for m in batch:
            if m.get("author", {}).get("bot", False):
                continue
            if m.get("type", 0) != 0:
                continue
            if not m.get("content", "").strip():
                continue
            if before_dt is not None:
                msg_dt = discord_message_datetime(m["id"])
                if msg_dt >= before_dt:
                    continue
            filtered.append(m)

        collected.extend(filtered)
        last_id = batch[-1]["id"]

        if len(batch) < 100:
            break

    collected.sort(key=lambda m: int(m["id"]))
    return collected


def collect_messages(config: dict[str, Any], after_dt: datetime, before_dt: datetime | None = None) -> list[dict[str, Any]]:
    token = config["discord"]["bot_token"]
    all_messages: list[dict[str, Any]] = []

    for category, channels in config["discord"]["channels"].items():
        for channel in channels:
            msgs = fetch_messages(channel["id"], token, after_dt, before_dt)
            for m in msgs:
                m["_category"] = category
                m["_channel_id"] = channel["id"]
                m["_channel_name"] = channel["name"]
            all_messages.extend(msgs)
            log.info("Channel %-24s | %4d msgs", channel["name"], len(msgs))

    all_messages.sort(key=lambda m: int(m["id"]))
    return all_messages


def dedupe_new_messages(messages: list[dict[str, Any]], state: dict[str, Any], report_date: str) -> list[dict[str, Any]]:
    seen = state.get("seen_messages", {})
    daily_entry = state.get("daily_reports", {}).get(report_date, {})
    already_in_daily = set(daily_entry.get("message_ids", []))
    fresh = [m for m in messages if m["id"] not in seen and m["id"] not in already_in_daily]
    return fresh


def mark_seen_messages(messages: list[dict[str, Any]], state: dict[str, Any]) -> None:
    seen = state.setdefault("seen_messages", {})
    for m in messages:
        seen[m["id"]] = discord_message_datetime(m["id"]).isoformat()


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def tokenize(text: str) -> list[str]:
    cleaned = re.sub(r"[^a-zA-Z0-9\uac00-\ud7a3 ]", " ", text.lower())
    tokens = []
    for word in cleaned.split():
        if len(word) <= 1 or word in STOPWORDS:
            continue
        tokens.append(word)
    return tokens


def basic_stats(messages: list[dict[str, Any]]) -> dict[str, Any]:
    users = Counter()
    keywords = Counter()
    categories = Counter()
    channels = Counter()
    for m in messages:
        users[m.get("author", {}).get("username", "unknown")] += 1
        categories[m.get("_category", "unknown")] += 1
        channels[m.get("_channel_name", "unknown")] += 1
        keywords.update(tokenize(m.get("content", "")))
    return {
        "total": len(messages),
        "top_users": users.most_common(5),
        "keywords": [word for word, _ in keywords.most_common(12)],
        "category_counts": dict(categories),
        "channel_counts": dict(channels),
    }


def build_category_stats(messages: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    grouped: dict[str, list[dict[str, Any]]] = {key: [] for key in CATEGORY_LABELS}
    for m in messages:
        grouped.setdefault(m.get("_category", "general"), []).append(m)

    result: dict[str, dict[str, Any]] = {}
    for category, items in grouped.items():
        users = Counter()
        keywords = Counter()
        channels = Counter()
        for m in items:
            users[m.get("author", {}).get("username", "unknown")] += 1
            channels[m.get("_channel_name", "unknown")] += 1
            keywords.update(tokenize(m.get("content", "")))
        result[category] = {
            "total": len(items),
            "top_users": users.most_common(3),
            "keywords": [word for word, _ in keywords.most_common(8)],
            "top_channels": channels.most_common(3),
        }
    return result


def merge_category_stats(existing: dict[str, dict[str, Any]], fresh: dict[str, dict[str, Any]]) -> dict[str, dict[str, Any]]:
    merged: dict[str, dict[str, Any]] = {}
    all_keys = set(existing) | set(fresh)
    for key in all_keys:
        old = existing.get(key, {})
        new = fresh.get(key, {})
        users = Counter(dict(old.get("top_users", [])))
        users.update(dict(new.get("top_users", [])))
        channels = Counter(dict(old.get("top_channels", [])))
        channels.update(dict(new.get("top_channels", [])))
        keywords = []
        seen_kw = set()
        for kw in old.get("keywords", []) + new.get("keywords", []):
            if kw not in seen_kw:
                seen_kw.add(kw)
                keywords.append(kw)
        merged[key] = {
            "total": int(old.get("total", 0)) + int(new.get("total", 0)),
            "top_users": users.most_common(3),
            "keywords": keywords[:8],
            "top_channels": channels.most_common(3),
        }
    return merged


def merge_stats(existing: dict[str, Any], fresh: dict[str, Any]) -> dict[str, Any]:
    category_counts = Counter(existing.get("category_counts", {}))
    category_counts.update(fresh.get("category_counts", {}))
    channel_counts = Counter(existing.get("channel_counts", {}))
    channel_counts.update(fresh.get("channel_counts", {}))
    users = Counter(dict(existing.get("top_users", [])))
    users.update(dict(fresh.get("top_users", [])))
    keywords = []
    seen = set()
    for kw in existing.get("keywords", []) + fresh.get("keywords", []):
        if kw not in seen:
            seen.add(kw)
            keywords.append(kw)
    return {
        "total": int(existing.get("total", 0)) + int(fresh.get("total", 0)),
        "top_users": users.most_common(5),
        "keywords": keywords[:12],
        "category_counts": dict(category_counts),
        "channel_counts": dict(channel_counts),
    }


def format_message_samples(messages: list[dict[str, Any]], limit: int) -> str:
    lines = []
    for m in messages[:limit]:
        user = m.get("author", {}).get("username", "unknown")
        channel = m.get("_channel_name", "unknown")
        text = normalize_text(m.get("content", ""))[:MAX_MESSAGE_PREVIEW_LEN]
        lines.append(f"[{channel}] {user}: {text}")
    return "\n".join(lines)


def format_category_counts(stats: dict[str, Any]) -> str:
    return "\n".join(f"- {CATEGORY_LABELS.get(key, key)}: {stats['category_counts'].get(key, 0)}" for key in CATEGORY_LABELS)


def build_daily_prompt(config: dict[str, Any], stats: dict[str, Any], messages: list[dict[str, Any]], previous_stats: dict[str, Any] | None, report_date: str, window_label: str) -> str:
    game_title = config["report"]["game_title"]
    keywords = ", ".join(stats["keywords"]) if stats["keywords"] else "없음"
    top_users = ", ".join(f"{u}({c})" for u, c in stats["top_users"]) if stats["top_users"] else "없음"
    prev_total = previous_stats.get("total") if previous_stats else None
    delta_text = "없음" if prev_total is None else f"전일 총 메시지 {prev_total}건 대비 {stats['total'] - prev_total:+}"
    message_samples = format_message_samples(messages, config["openai"]["max_input_messages"])
    return f"""
다음은 {game_title} Discord 커뮤니티의 일간 리포트 데이터입니다.

[기본 정보]
- 기준일: {report_date}
- 수집 구간: {window_label}

[주요 지표]
- 총 메시지 수: {stats['total']}
- 전일 비교: {delta_text}
- 주요 키워드: {keywords}
- 주요 작성자: {top_users}

[카테고리별 메시지 수]
{format_category_counts(stats)}

[메시지 샘플]
{message_samples}

운영팀이 바로 참고할 수 있도록 한국어로 간결하고 실무적으로 작성하세요. 과장 없이 핵심만 정리하세요.

## 일간 요약
- 전체 분위기:
- 핵심 해석:

## 주요 이슈 Top 5
1.
2.
3.
4.
5.

## 긍정 반응
-

## 불만 및 리스크
-

## 유저 행동 관찰
-

## 운영 액션 제안
- 즉시 확인 필요:
- 지속 모니터링:

## 추가 확인 질문
-
""".strip()


def build_category_prompt(config: dict[str, Any], category: str, category_stats: dict[str, Any], category_messages: list[dict[str, Any]], report_date: str, window_label: str) -> str:
    game_title = config["report"]["game_title"]
    category_label = CATEGORY_LABELS.get(category, category)
    keywords = ", ".join(category_stats.get("keywords", [])) or "없음"
    top_users = ", ".join(f"{u}({c})" for u, c in category_stats.get("top_users", [])) or "없음"
    top_channels = ", ".join(f"{c}({n})" for c, n in category_stats.get("top_channels", [])) or "없음"
    samples = format_message_samples(category_messages, min(80, config["openai"]["max_input_messages"]))
    return f"""
다음은 {game_title} Discord 커뮤니티의 {category_label} 카테고리 일간 리포트 데이터입니다.

[기본 정보]
- 기준일: {report_date}
- 수집 구간: {window_label}

[카테고리 지표]
- 총 메시지 수: {category_stats.get('total', 0)}
- 주요 채널: {top_channels}
- 주요 키워드: {keywords}
- 주요 작성자: {top_users}

[메시지 샘플]
{samples or '없음'}

운영팀이 참고할 수 있도록 한국어로 간결하게 작성하세요.

## 카테고리 요약
- 분위기:
- 핵심 해석:

## 주요 포인트
-
-

## 운영 메모
- 즉시 확인:
- 모니터링:
""".strip()


def build_weekly_prompt(config: dict[str, Any], week_label: str, daily_entries: list[dict[str, Any]]) -> str:
    game_title = config["report"]["game_title"]
    total_messages = sum(entry["stats"].get("total", 0) for entry in daily_entries)
    combined_keywords = Counter()
    combined_users = Counter()
    for entry in daily_entries:
        for kw in entry["stats"].get("keywords", []):
            combined_keywords[kw] += 1
        for user, count in entry["stats"].get("top_users", []):
            combined_users[user] += count
    keyword_text = ", ".join(word for word, _ in combined_keywords.most_common(15)) or "없음"
    top_users = ", ".join(f"{u}({c})" for u, c in combined_users.most_common(8)) or "없음"
    daily_blocks = []
    for entry in daily_entries:
        daily_blocks.append(
            f"[일자] {entry['date']}\n"
            f"- 총 메시지 수: {entry['stats'].get('total', 0)}\n"
            f"- 주요 키워드: {', '.join(entry['stats'].get('keywords', [])[:8]) or '없음'}\n"
            f"- 일간 분석:\n{entry.get('analysis_text', '')}\n"
        )
    return f"""
다음은 {game_title} Discord 커뮤니티의 주간 종합 데이터입니다.
주간 범위: {week_label}

[주간 지표]
- 총 메시지 수: {total_messages}
- 주간 주요 키워드: {keyword_text}
- 주간 주요 작성자: {top_users}

[일간 요약 모음]
{chr(10).join(daily_blocks)}

운영팀이 바로 참고할 수 있도록 한국어로 간결하게 작성하세요.

## 주간 종합 요약
- 전체 분위기:
- 핵심 해석:

## 주간 주요 이슈 Top 5
1.
2.
3.
4.
5.

## 주간 흐름 변화
- 초반:
- 중반:
- 후반:

## 긍정 신호
-

## 리스크
-

## 운영 액션 제안
- 즉시 조치:
- 다음 모니터링 항목:

## 추가 확인 질문
-
""".strip()


def extract_responses_output_text(response: Any) -> str:
    output_text = getattr(response, "output_text", None)
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip()
    output = getattr(response, "output", None)
    if isinstance(output, list):
        parts = []
        for item in output:
            content = getattr(item, "content", None)
            if not isinstance(content, list):
                continue
            for part in content:
                text = part.get("text") if isinstance(part, dict) else getattr(part, "text", None)
                if isinstance(text, dict):
                    text = text.get("value")
                elif hasattr(text, "value"):
                    text = text.value
                if isinstance(text, str) and text.strip():
                    parts.append(text.strip())
        return "\n".join(parts).strip()
    return ""


def analyze_text(config: dict[str, Any], prompt: str) -> str:
    client = OpenAI(api_key=config["openai"]["api_key"])
    base_max_output_tokens = int(config["openai"].get("max_output_tokens", 1200))
    request_kwargs = {
        "model": config["openai"]["model"],
        "input": [
            {"role": "system", "content": [{"type": "input_text", "text": "당신은 Discord 커뮤니티 리포트를 작성하는 운영 분석가입니다. 과장 없이 실행 가능한 인사이트, 명확한 추세, 실무적인 다음 액션을 한국어로 간결하게 정리하세요."}]},
            {"role": "user", "content": [{"type": "input_text", "text": prompt}]},
        ],
        "max_output_tokens": base_max_output_tokens,
        "reasoning": {"effort": config["openai"].get("reasoning_effort", "low")},
        "text": {"verbosity": config["openai"].get("text_verbosity", "low")},
    }
    response = client.responses.create(**request_kwargs)
    analysis_text = extract_responses_output_text(response)
    incomplete_reason = getattr(getattr(response, "incomplete_details", None), "reason", None)
    if incomplete_reason == "max_output_tokens":
        request_kwargs["max_output_tokens"] = max(base_max_output_tokens * 2, 4000)
        response = client.responses.create(**request_kwargs)
        analysis_text = extract_responses_output_text(response)
    return analysis_text or "분석 결과가 없습니다."


def safe_analyze_text(config: dict[str, Any], prompt: str) -> str:
    fallback_text = (
        "## AI 분석 사용 불가\n"
        "- OpenAI API 요청이 실패하여 자동 요약을 생성하지 못했습니다.\n"
        "- 수집된 메시지 통계를 기반으로 HTML 리포트는 계속 생성되었습니다.\n\n"
        "## 확인 필요\n"
        "- API quota, billing, model 설정을 확인하세요.\n"
        "- 이번 실행에서는 AI 분석 대신 대체 문구가 사용되었습니다."
    )
    try:
        return analyze_text(config, prompt)
    except RateLimitError as exc:
        log.error("OpenAI rate limit/quota error: %s", exc)
        return fallback_text
    except (APIConnectionError, APITimeoutError, APIError) as exc:
        log.error("OpenAI API error: %s", exc)
        return fallback_text


def markdown_to_html(text: str) -> str:
    lines = text.splitlines()
    html_lines = []
    in_list = False
    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            if in_list:
                html_lines.append("</ul>")
                in_list = False
            html_lines.append("<div style='height:8px'></div>")
            continue
        esc = html.escape(line)
        if esc.startswith("## "):
            if in_list:
                html_lines.append("</ul>")
                in_list = False
            html_lines.append(f"<h3 style='margin:18px 0 8px;color:#1f3f66'>{esc[3:]}</h3>")
        elif re.match(r"^(\- |\d+\. )", line):
            if not in_list:
                html_lines.append("<ul style='margin:6px 0 10px 20px;padding:0'>")
                in_list = True
            item = re.sub(r"^(\- |\d+\. )", "", esc)
            html_lines.append(f"<li style='margin:4px 0'>{item}</li>")
        else:
            if in_list:
                html_lines.append("</ul>")
                in_list = False
            html_lines.append(f"<p style='margin:6px 0;line-height:1.6'>{esc}</p>")
    if in_list:
        html_lines.append("</ul>")
    return "\n".join(html_lines)


def build_summary_banner(title: str, subtitle: str, stat_items: list[tuple[str, str]]) -> str:
    stats_html = "".join(
        f'<div style="background:#ffffff14;border:1px solid #ffffff22;border-radius:12px;padding:14px 18px;min-width:120px;text-align:center"><div style="font-size:26px;font-weight:700">{html.escape(value)}</div><div style="font-size:12px;opacity:.9">{html.escape(label)}</div></div>'
        for label, value in stat_items
    )
    return f'<div style="background:linear-gradient(135deg,#153454,#2d5f93);color:#fff;border-radius:16px 16px 0 0;padding:26px 28px"><div style="font-size:13px;opacity:.85;margin-bottom:6px">{html.escape(subtitle)}</div><h1 style="margin:0;font-size:26px">{html.escape(title)}</h1><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:20px">{stats_html}</div></div>'


def build_category_cards(category_stats: dict[str, dict[str, Any]], category_analyses: dict[str, str]) -> str:
    cards = []
    for category, label in CATEGORY_LABELS.items():
        stats = category_stats.get(category, {})
        cards.append(f'''<div style="background:#fff;border:1px solid #dfe9f4;border-radius:14px;padding:16px"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><h3 style="margin:0;font-size:18px;color:#1f3f66">{html.escape(label)}</h3><span style="background:#edf4fb;color:#24486f;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:700">{stats.get("total",0)} msgs</span></div><div style="margin-top:10px;font-size:13px;line-height:1.6;color:#42576b"><div><strong>주요 채널:</strong> {html.escape(', '.join(f'{n}({c})' for n,c in stats.get('top_channels', [])) or '없음')}</div><div><strong>주요 작성자:</strong> {html.escape(', '.join(f'{n}({c})' for n,c in stats.get('top_users', [])) or '없음')}</div><div><strong>주요 키워드:</strong> {html.escape(', '.join(stats.get('keywords', [])) or '없음')}</div></div><div style="margin-top:12px;padding-top:12px;border-top:1px solid #eef3f8;font-size:14px;color:#2d3b4d">{markdown_to_html(category_analyses.get(category, '분석 결과가 없습니다.'))}</div></div>''')
    return "".join(cards)


def build_daily_html(config: dict[str, Any], report_date: str, window_label: str, stats: dict[str, Any], analysis_text: str, previous_stats: dict[str, Any] | None, category_stats: dict[str, dict[str, Any]], category_analyses: dict[str, str]) -> str:
    delta = "N/A" if not previous_stats else f"{stats['total'] - previous_stats.get('total', 0):+}"
    top_users_html = "".join(f"<li style='margin:4px 0'>{html.escape(user)} ({count})</li>" for user, count in stats.get("top_users", [])) or "<li>없음</li>"
    keyword_html = ", ".join(html.escape(k) for k in stats.get("keywords", [])) or "없음"
    categories_html = "".join(
        f"<tr><td style='padding:8px 10px;border-bottom:1px solid #eef2f7'>{html.escape(CATEGORY_LABELS.get(cat, cat))}</td><td style='padding:8px 10px;border-bottom:1px solid #eef2f7;text-align:right'>{count}</td></tr>"
        for cat, count in stats.get("category_counts", {}).items()
    )
    banner = build_summary_banner(
        f"{config['report']['game_title']} Discord 일간 리포트",
        f"기준일: {report_date} | 구간: {window_label}",
        [("메시지 수", str(stats["total"])), ("증감", delta), ("키워드 수", str(len(stats.get("keywords", []))))],
    )
    return f"<!DOCTYPE html><html lang='ko'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Discord 일간 리포트</title></head><body style='margin:0;padding:24px;background:#eef3f8;font-family:Malgun Gothic,Arial,sans-serif;color:#243648'><div style='max-width:980px;margin:0 auto;background:#fff;border:1px solid #d8e3ef;border-radius:16px;overflow:hidden'>{banner}<div style='padding:22px 26px'><div style='display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start'><div style='background:#f8fbff;border:1px solid #e1ecf8;border-radius:12px;padding:16px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>카테고리 통계</h2><table style='width:100%;border-collapse:collapse;font-size:14px'>{categories_html}</table></div><div style='background:#f8fbff;border:1px solid #e1ecf8;border-radius:12px;padding:16px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>주요 작성자</h2><ul style='margin:0 0 12px 18px;padding:0'>{top_users_html}</ul><div style='font-size:14px;line-height:1.6'><strong>주요 키워드</strong> {keyword_html}</div></div></div><div style='margin-top:18px;background:#fff;border:1px solid #e6edf5;border-radius:12px;padding:18px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>AI 요약</h2><div style='font-size:14px;color:#2d3b4d'>{markdown_to_html(analysis_text)}</div></div><div style='margin-top:18px'><h2 style='margin:0 0 12px;font-size:20px;color:#1f3f66'>카테고리별 분석</h2><div style='display:grid;grid-template-columns:1fr 1fr;gap:16px'>{build_category_cards(category_stats, category_analyses)}</div></div></div></div></body></html>"


def build_weekly_html(config: dict[str, Any], week_label: str, total_messages: int, included_dates: list[str], analysis_text: str) -> str:
    banner = build_summary_banner(
        f"{config['report']['game_title']} Discord 주간 리포트",
        f"범위: {week_label}",
        [("일수", str(len(included_dates))), ("메시지 수", str(total_messages)), ("마감일", included_dates[-1] if included_dates else "N/A")],
    )
    dates_html = "".join(f"<li style='margin:4px 0'>{html.escape(date)}</li>" for date in included_dates) or "<li>없음</li>"
    return f"<!DOCTYPE html><html lang='ko'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Discord 주간 리포트</title></head><body style='margin:0;padding:24px;background:#eef3f8;font-family:Malgun Gothic,Arial,sans-serif;color:#243648'><div style='max-width:860px;margin:0 auto;background:#fff;border:1px solid #d8e3ef;border-radius:16px;overflow:hidden'>{banner}<div style='padding:22px 26px'><div style='display:grid;grid-template-columns:260px 1fr;gap:18px;align-items:start'><div style='background:#f8fbff;border:1px solid #e1ecf8;border-radius:12px;padding:16px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>포함 일자</h2><ul style='margin:0 0 0 18px;padding:0'>{dates_html}</ul></div><div style='background:#fff;border:1px solid #e6edf5;border-radius:12px;padding:18px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>AI 요약</h2><div style='font-size:14px;color:#2d3b4d'>{markdown_to_html(analysis_text)}</div></div></div></div></div></body></html>"


def write_report_html(path: Path, html_text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html_text, encoding="utf-8")


def send_email(config: dict[str, Any], subject: str, html_body: str) -> None:
    email_cfg = config["email"]
    recipients = email_cfg["recipients"]
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = email_cfg["sender_address"]
    msg["To"] = ", ".join(recipients)
    msg.attach(MIMEText(html_body, "html", "utf-8"))
    with smtplib.SMTP(email_cfg["smtp_host"], email_cfg["smtp_port"]) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.login(email_cfg["sender_address"], email_cfg["sender_password"])
        smtp.sendmail(email_cfg["sender_address"], recipients, msg.as_bytes())
    log.info("이메일 발송 완료: %s", subject)


def get_previous_daily_stats(state: dict[str, Any], report_date: str) -> dict[str, Any] | None:
    prev_date = (datetime.fromisoformat(report_date) - timedelta(days=1)).date().isoformat()
    entry = state.get("daily_reports", {}).get(prev_date)
    return entry.get("stats") if entry else None


def compute_week_window(report_date_str: str) -> tuple[str, list[str]]:
    week_end = datetime.fromisoformat(report_date_str).date()
    week_start = week_end - timedelta(days=6)
    label = f"{week_start.isoformat()} ~ {week_end.isoformat()}"
    dates = [(week_start + timedelta(days=i)).isoformat() for i in range(7)]
    return label, dates


def should_send_weekly(config: dict[str, Any], run_local_dt: datetime, force_send_weekly: bool = False) -> bool:
    if not bool(config["report"].get("weekly_enabled", True)):
        return False
    if force_send_weekly:
        return True
    return run_local_dt.weekday() == int(config["report"].get("weekly_send_weekday", 4))


def build_daily_subject(config: dict[str, Any], report_date: str) -> str:
    prefix = config["email"].get("subject_prefix", "[Blackshot] Discord Report")
    return f"{prefix} [일간] {report_date}"


def build_weekly_subject(config: dict[str, Any], week_label: str) -> str:
    prefix = config["email"].get("subject_prefix", "[Blackshot] Discord Report")
    return f"{prefix} [주간] {week_label}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force-send-daily", action="store_true")
    parser.add_argument("--force-send-weekly", action="store_true")
    parser.add_argument("--rebuild-daily", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    config = load_config()
    tzinfo = get_tz(config)
    now_utc = datetime.now(timezone.utc)
    now_local = now_utc.astimezone(tzinfo)
    window = get_report_window(config, now_local, tzinfo)
    report_date = window["report_date"]
    after_dt = window["after_dt_utc"]
    before_dt = window["before_dt_utc"]
    window_label = window["window_label"]

    log.info("기준일 %s | 수집 구간: %s", report_date, window_label)

    state = load_state()
    prune_seen_messages(state, now_utc)

    raw_messages = collect_messages(config, after_dt, before_dt)
    fresh_messages = raw_messages if args.rebuild_daily else dedupe_new_messages(raw_messages, state, report_date)
    window_messages = raw_messages
    previous_stats = get_previous_daily_stats(state, report_date)
    daily_entry = state.get("daily_reports", {}).get(report_date)
    daily_already_sent = False if args.rebuild_daily else bool(daily_entry and daily_entry.get("sent"))

    if not fresh_messages and daily_already_sent and not args.force_send_daily:
        log.info("신규 메시지가 없고 해당 기준일의 일간 메일이 이미 발송되어 일간 작업을 건너뜁니다.")
    else:
        reuse_existing_daily = not fresh_messages and daily_entry and not args.rebuild_daily
        if reuse_existing_daily:
            stats = daily_entry.get("stats", {})
            category_stats = daily_entry.get("category_stats", {})
            category_analyses = daily_entry.get("category_analyses", {})
            analysis_text = daily_entry.get("analysis_text", "")
            existing_message_ids = set(daily_entry.get("message_ids", []))
        else:
            stats = basic_stats(window_messages) if window_messages else {"total": 0, "top_users": [], "keywords": [], "category_counts": {}, "channel_counts": {}}
            category_stats = build_category_stats(window_messages)
            existing_message_ids = set()

            if window_messages:
                analysis_text = safe_analyze_text(config, build_daily_prompt(config, stats, window_messages, previous_stats, report_date, window_label))
                category_analyses = {}
                for category, cat_stats in category_stats.items():
                    category_messages = [m for m in window_messages if m.get("_category") == category]
                    if category_messages:
                        category_analyses[category] = safe_analyze_text(config, build_category_prompt(config, category, cat_stats, category_messages, report_date, window_label))
                    else:
                        category_analyses[category] = "## 카테고리 요약\n- 분위기: 메시지 없음\n- 핵심 해석: 데이터가 없습니다."
            else:
                stats = {"total": 0, "top_users": [], "keywords": [], "category_counts": {}, "channel_counts": {}}
                category_stats = build_category_stats([])
                category_analyses = {k: "## 카테고리 요약\n- 분위기: 신규 메시지 없음\n- 핵심 해석: 선택한 구간에서 이 카테고리에 수집된 메시지가 없습니다." for k in CATEGORY_LABELS}
                analysis_text = "## 일간 요약\n- 전체 분위기: 신규 메시지 없음\n- 핵심 해석: 선택한 구간에서 수집된 메시지가 없습니다."
                existing_message_ids = set()

        daily_html = build_daily_html(config, report_date, window_label, stats, analysis_text, previous_stats, category_stats, category_analyses)
        daily_report_path = DAILY_DIR / f"report_{report_date.replace('-', '')}.html"
        if config["report"].get("save_html", True):
            write_report_html(daily_report_path, daily_html)
        send_daily = bool(config["report"].get("daily_send_enabled", True)) and (args.force_send_daily or not daily_already_sent)
        if send_daily:
            send_email(config, build_daily_subject(config, report_date), daily_html)
        final_message_ids = sorted(existing_message_ids | {m['id'] for m in window_messages}, key=int)
        state.setdefault("daily_reports", {})[report_date] = {
            "date": report_date,
            "window_mode": window["window_mode"],
            "window_label": window_label,
            "stats": stats,
            "category_stats": category_stats,
            "category_analyses": category_analyses,
            "analysis_text": analysis_text,
            "html_path": str(daily_report_path),
            "sent": daily_already_sent or send_daily,
            "last_run_at": now_local.isoformat(),
            "new_message_count": len(fresh_messages),
            "message_ids": final_message_ids,
        }
        mark_seen_messages(fresh_messages, state)
        save_state(state)

    if should_send_weekly(config, now_local, args.force_send_weekly):
        week_label, included_dates = compute_week_window(report_date)
        week_key = week_label.replace(" ~ ", "_")
        weekly_entry = state.get("weekly_reports", {}).get(week_key)
        weekly_already_sent = bool(weekly_entry and weekly_entry.get("sent"))
        daily_entries = [state.get("daily_reports", {}).get(date_key) for date_key in included_dates]
        daily_entries = [entry for entry in daily_entries if entry]
        missing_dates = [date_key for date_key in included_dates if date_key not in {entry["date"] for entry in daily_entries}]
        if missing_dates:
            log.info("주간 리포트를 건너뜁니다. 누락된 일간 데이터: %s", ", ".join(missing_dates))
        elif not weekly_already_sent or args.force_send_weekly:
            weekly_analysis = safe_analyze_text(config, build_weekly_prompt(config, week_label, daily_entries))
            weekly_total_messages = sum(entry["stats"].get("total", 0) for entry in daily_entries)
            weekly_html = build_weekly_html(config, week_label, weekly_total_messages, included_dates, weekly_analysis)
            weekly_path = WEEKLY_DIR / f"report_{week_key.replace('-', '')}.html"
            if config["report"].get("save_html", True):
                write_report_html(weekly_path, weekly_html)
            send_email(config, build_weekly_subject(config, week_label), weekly_html)
            state.setdefault("weekly_reports", {})[week_key] = {"week_label": week_label, "included_dates": included_dates, "html_path": str(weekly_path), "analysis_text": weekly_analysis, "sent": True, "last_run_at": now_local.isoformat()}
            save_state(state)

    save_state(state)
    log.info("완료")


if __name__ == "__main__":
    main()
