"""
Blackshot Discord Daily/Weekly Report Generator
- Discord REST API로 채널 메시지 수집
- OpenAI로 일간/주간 분석
- 수동 재실행 시 중복 메시지/중복 발송 방지
- HTML 리포트 저장 및 이메일 발송

기본 동작
- 매 실행 시 최근 lookback_hours 범위 메시지를 가져옴
- 이미 처리된 message_id 는 제외
- 같은 report_date 의 일간 메일은 기본적으로 1회만 발송
- 금요일 실행 시 지난 금~목 주간 합산 리포트도 추가 발송

수동 실행 예시
- 일반 실행: python discord_report.py
- 같은 날 강제 재발송: python discord_report.py --force-send-daily
- 금요일 주간 리포트 강제 재발송: python discord_report.py --force-send-weekly
"""

from __future__ import annotations

import argparse
import html
import json
import logging
import re
import smtplib
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
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
    "feedback": "💬 유저 피드백",
    "bug_report": "🐛 버그 제보",
    "event": "🎉 이벤트 반응",
    "announcement": "📢 공지 반응",
    "general": "💭 자유 채팅",
}

STOPWORDS = {
    "the", "and", "for", "with", "this", "that", "have", "from", "you", "your",
    "are", "was", "were", "been", "will", "there", "they", "them", "then", "than",
    "http", "https", "www", "com", "img", "gif", "png", "jpg", "jpeg",
    "그리고", "하지만", "그냥", "이거", "저거", "이번", "관련", "문의", "제보", "버그",
    "공지", "이벤트", "자유", "채팅", "에서", "으로", "하는", "있는", "없음", "있음",
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
        raise SystemExit(f"config.json 파일이 없습니다: {exc}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"config.json 형식 오류: {exc}") from exc

    required_top = ["discord", "openai", "email", "report"]
    missing = [k for k in required_top if k not in config]
    if missing:
        raise SystemExit(f"config.json 필수 항목 누락: {', '.join(missing)}")

    config["report"].setdefault("lookback_hours", 24)
    config["report"].setdefault("game_title", "Blackshot")
    config["report"].setdefault("language", "ko")
    config["report"].setdefault("timezone", DEFAULT_TIMEZONE)
    config["report"].setdefault("weekly_enabled", True)
    config["report"].setdefault("weekly_send_weekday", 4)  # Friday, Monday=0
    config["report"].setdefault("daily_send_enabled", True)
    config["report"].setdefault("save_html", True)

    config["openai"].setdefault("model", "gpt-5")
    config["openai"].setdefault("max_input_messages", MAX_PROMPT_MESSAGES)
    config["openai"].setdefault("max_output_tokens", 2400)
    config["openai"].setdefault("reasoning_effort", "low")
    config["openai"].setdefault("text_verbosity", "low")

    return config


def get_tz(config: dict[str, Any]):
    tz_name = config["report"].get("timezone", DEFAULT_TIMEZONE)
    try:
        from zoneinfo import ZoneInfo
        return ZoneInfo(tz_name)
    except Exception:
        log.warning("timezone 로드 실패: %s. UTC 사용", tz_name)
        return timezone.utc


def utc_to_local(dt: datetime, tzinfo) -> datetime:
    return dt.astimezone(tzinfo)


def local_now(tzinfo) -> datetime:
    return datetime.now(timezone.utc).astimezone(tzinfo)


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
        log.warning("state.json 로드 실패. 새 상태로 시작합니다.")
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
    removed = len(seen) - len(pruned)
    if removed:
        log.info("오래된 seen message %s개 정리", removed)
    state["seen_messages"] = pruned


def fetch_messages(channel_id: str, token: str, after_dt: datetime) -> list[dict[str, Any]]:
    headers = {"Authorization": f"Bot {token}"}
    after_snowflake = snowflake_from_datetime(after_dt)
    last_id = after_snowflake
    collected: list[dict[str, Any]] = []

    while True:
        url = f"{DISCORD_API}/channels/{channel_id}/messages"
        params = {"limit": 100, "after": last_id}
        resp = requests.get(url, headers=headers, params=params, timeout=20)

        if resp.status_code == 403:
            log.warning("채널 %s 접근 권한 없음 (403)", channel_id)
            break
        if resp.status_code == 404:
            log.warning("채널 %s 없음 (404)", channel_id)
            break
        resp.raise_for_status()

        batch = resp.json()
        if not batch:
            break

        filtered = [
            m for m in batch
            if not m.get("author", {}).get("bot", False)
            and m.get("type", 0) == 0
            and m.get("content", "").strip()
        ]
        collected.extend(filtered)
        last_id = batch[-1]["id"]

        if len(batch) < 100:
            break

    collected.sort(key=lambda m: int(m["id"]))
    return collected


def collect_messages(config: dict[str, Any], after_dt: datetime) -> list[dict[str, Any]]:
    token = config["discord"]["bot_token"]
    all_messages: list[dict[str, Any]] = []

    for category, channels in config["discord"]["channels"].items():
        for channel in channels:
            msgs = fetch_messages(channel["id"], token, after_dt)
            for m in msgs:
                m["_category"] = category
                m["_channel_id"] = channel["id"]
                m["_channel_name"] = channel["name"]
            all_messages.extend(msgs)
            log.info("채널 %-24s | %4d개", channel["name"], len(msgs))

    all_messages.sort(key=lambda m: int(m["id"]))
    return all_messages


def dedupe_new_messages(messages: list[dict[str, Any]], state: dict[str, Any]) -> list[dict[str, Any]]:
    seen = state.get("seen_messages", {})
    fresh = [m for m in messages if m["id"] not in seen]
    skipped = len(messages) - len(fresh)
    if skipped:
        log.info("이미 처리된 메시지 %d개 제외", skipped)
    return fresh


def mark_seen_messages(messages: list[dict[str, Any]], state: dict[str, Any]) -> None:
    seen = state.setdefault("seen_messages", {})
    for m in messages:
        msg_dt = discord_message_datetime(m["id"]).isoformat()
        seen[m["id"]] = msg_dt


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def tokenize(text: str) -> list[str]:
    cleaned = re.sub(r"[^a-zA-Z0-9가-힣_ ]", " ", text.lower())
    tokens = []
    for word in cleaned.split():
        if len(word) <= 1:
            continue
        if word in STOPWORDS:
            continue
        tokens.append(word)
    return tokens


def basic_stats(messages: list[dict[str, Any]]) -> dict[str, Any]:
    users = Counter()
    keywords = Counter()
    categories = Counter()
    channels = Counter()

    for m in messages:
        username = m.get("author", {}).get("username", "unknown")
        users[username] += 1
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


def format_message_samples(messages: list[dict[str, Any]], limit: int) -> str:
    lines = []
    for m in messages[:limit]:
        user = m.get("author", {}).get("username", "unknown")
        channel = m.get("_channel_name", "unknown")
        text = normalize_text(m.get("content", ""))[:MAX_MESSAGE_PREVIEW_LEN]
        lines.append(f"[{channel}] {user}: {text}")
    return "\n".join(lines)


def format_category_counts(stats: dict[str, Any]) -> str:
    pairs = []
    for key, label in CATEGORY_LABELS.items():
        pairs.append(f"- {label}: {stats['category_counts'].get(key, 0)}")
    return "\n".join(pairs)


def build_daily_prompt(
    config: dict[str, Any],
    stats: dict[str, Any],
    messages: list[dict[str, Any]],
    previous_stats: dict[str, Any] | None,
) -> str:
    game_title = config["report"]["game_title"]
    keywords = ", ".join(stats["keywords"]) if stats["keywords"] else "없음"
    top_users = ", ".join(f"{u}({c})" for u, c in stats["top_users"]) if stats["top_users"] else "없음"
    prev_total = previous_stats.get("total") if previous_stats else None
    delta_text = "없음" if prev_total is None else f"전일 총 메시지 {prev_total}개 대비 {stats['total'] - prev_total:+}"
    message_samples = format_message_samples(messages, config["openai"]["max_input_messages"])

    return f"""
다음은 {game_title} Discord 커뮤니티의 최근 일간 데이터입니다.

[기본 지표]
- 총 메시지 수: {stats['total']}
- 전일 비교: {delta_text}
- 상위 키워드: {keywords}
- 핵심 유저 Top 5: {top_users}

[카테고리별 메시지 수]
{format_category_counts(stats)}

[메시지 샘플]
{message_samples}

아래 형식으로 한국어로 작성하세요. 불필요한 수식어는 빼고, 운영팀이 바로 읽고 판단할 수 있게 간결하고 명확하게 쓰세요.

## 📊 일간 요약
- 전반 분위기:
- 활동량 해석:

## 🔑 핵심 이슈 Top 5
1.
2.
3.
4.
5.

## 😊 긍정 반응
- 

## 😟 부정 반응
- 

## 👤 핵심 유저 관찰
- 

## ⚡ 운영 액션 제안
- 즉시 확인 필요:
- 후속 모니터링:

## 📈 한줄 트렌드
- 
""".strip()


def build_weekly_prompt(
    config: dict[str, Any],
    week_label: str,
    daily_entries: list[dict[str, Any]],
) -> str:
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
        date_key = entry["date"]
        total = entry["stats"].get("total", 0)
        kws = ", ".join(entry["stats"].get("keywords", [])[:8]) or "없음"
        analysis = entry.get("analysis_text", "")
        daily_blocks.append(
            f"[일자] {date_key}\n"
            f"- 총 메시지: {total}\n"
            f"- 키워드: {kws}\n"
            f"- 일간 분석:\n{analysis}\n"
        )

    daily_summary = "\n".join(daily_blocks)
    return f"""
다음은 {game_title} Discord 커뮤니티의 주간 합산 데이터입니다.
주간 범위: {week_label}

[주간 지표]
- 총 메시지 수: {total_messages}
- 주간 핵심 키워드: {keyword_text}
- 주간 핵심 유저: {top_users}

[일간 요약 묶음]
{daily_summary}

아래 형식으로 한국어로 작성하세요.

## 📊 주간 종합 요약
- 전체 분위기:
- 활동량 해석:

## 🔥 주간 핵심 이슈 Top 5
1.
2.
3.
4.
5.

## 📈 일간 흐름 변화
- 초반:
- 중반:
- 후반:

## 😊 긍정 포인트
- 

## 😟 리스크 포인트
- 

## ⚡ 운영팀 주간 액션 제안
- 즉시 조치:
- 다음 주 모니터링:

## 🧭 한줄 결론
- 
""".strip()


def _deprecated_extract_chat_message_text(message: Any) -> str:
    content = getattr(message, "content", None)
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts: list[str] = []
        for part in content:
            text = None
            if isinstance(part, dict):
                text = part.get("text")
                if isinstance(text, dict):
                    text = text.get("value")
            else:
                text = getattr(part, "text", None)
                if hasattr(text, "value"):
                    text = text.value
            if isinstance(text, str) and text.strip():
                parts.append(text.strip())
        return "\n".join(parts).strip()
    return ""


def _deprecated_analyze_text_chat_1(config: dict[str, Any], prompt: str) -> str:
    client = OpenAI(api_key=config["openai"]["api_key"])
    response = client.chat.completions.create(
        model=config["openai"]["model"],
        messages=[
            {
                "role": "system",
                "content": (
                    "당신은 게임 라이브옵스 커뮤니티 리포트 분석가입니다. "
                    "운영팀이 바로 실행 가능한 수준으로 요약하고, 과장 없이 핵심만 전달하세요."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        max_completion_tokens=config["openai"].get("max_output_tokens", 1200),
    )
    return response.choices[0].message.content or "분석 결과 없음"
def safe_analyze_text(config: dict[str, Any], prompt: str) -> str:
    fallback_text = (
        "## AI 분석 사용 불가\n"
        "- OpenAI API 호출에 실패해 자동 요약을 생성하지 못했습니다.\n"
        "- 원본 통계와 수집 메시지 기준으로 HTML 리포트는 계속 생성되었습니다.\n\n"
        "## 확인 필요\n"
        "- API quota, billing, model 설정을 확인하세요.\n"
        "- 현재 실행에서는 분석 문구만 폴백 텍스트로 대체되었습니다."
    )
    try:
        return analyze_text(config, prompt)
    except RateLimitError as exc:
        log.error("OpenAI rate limit/quota error: %s", exc)
        return fallback_text
    except (APIConnectionError, APITimeoutError, APIError) as exc:
        log.error("OpenAI API error: %s", exc)
        return fallback_text


def _deprecated_analyze_text_chat_2(config: dict[str, Any], prompt: str) -> str:
    client = OpenAI(api_key=config["openai"]["api_key"])
    response = client.chat.completions.create(
        model=config["openai"]["model"],
        messages=[
            {
                "role": "system",
                "content": (
                    "?뱀떊? 寃뚯엫 ?쇱씠釉뚯샃??而ㅻ??덊떚 由ы룷??遺꾩꽍媛?낅땲?? "
                    "?댁쁺???諛붾줈 ?ㅽ뻾 媛?ν븳 ?섏??쇰줈 ?붿빟?섍퀬, 怨쇱옣 ?놁씠 ?듭떖留??꾨떖?섏꽭??"
                ),
            },
            {"role": "user", "content": prompt},
        ],
        max_completion_tokens=config["openai"].get("max_output_tokens", 1200),
    )
    analysis_text = extract_chat_message_text(response.choices[0].message)
    if analysis_text:
        if incomplete_reason:
            log.warning("OpenAI 분석 텍스트는 추출됐지만 응답 상태가 incomplete 입니다. reason=%s", incomplete_reason)
        return analysis_text
    log.warning("OpenAI 응답은 성공했지만 추출 가능한 분석 텍스트가 없습니다.")
    return "분석 결과 없음"


def extract_responses_output_text(response: Any) -> str:
    output_text = getattr(response, "output_text", None)
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip()

    def normalize_text(value: Any) -> str:
        if isinstance(value, str):
            return value.strip()
        if isinstance(value, dict):
            nested = value.get("value")
            if isinstance(nested, str):
                return nested.strip()
        if hasattr(value, "value") and isinstance(value.value, str):
            return value.value.strip()
        return ""

    output = getattr(response, "output", None)
    if isinstance(output, list):
        parts: list[str] = []
        for item in output:
            content = getattr(item, "content", None)
            if not isinstance(content, list):
                continue
            for part in content:
                text = None
                if isinstance(part, dict):
                    text = part.get("text")
                else:
                    text = getattr(part, "text", None)
                normalized = normalize_text(text)
                if normalized:
                    parts.append(normalized)
        return "\n".join(parts).strip()
    return ""


def analyze_text(config: dict[str, Any], prompt: str) -> str:
    client = OpenAI(api_key=config["openai"]["api_key"])
    base_max_output_tokens = int(config["openai"].get("max_output_tokens", 1200))
    request_kwargs = {
        "model": config["openai"]["model"],
        "input": [
            {
                "role": "system",
                "content": [
                    {
                        "type": "input_text",
                        "text": "게임 라이브 서비스 Discord 커뮤니티 리포트 분석가입니다. 운영자가 바로 실행 가능한 수준으로 요약하고, 과장 없이 핵심만 전달하세요.",
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": prompt,
                    }
                ],
            },
        ],
        "max_output_tokens": base_max_output_tokens,
        "reasoning": {"effort": config["openai"].get("reasoning_effort", "low")},
        "text": {"verbosity": config["openai"].get("text_verbosity", "low")},
    }
    response = client.responses.create(**request_kwargs)
    analysis_text = extract_responses_output_text(response)
    incomplete_reason = getattr(getattr(response, "incomplete_details", None), "reason", None)
    if incomplete_reason is None and isinstance(getattr(response, "incomplete_details", None), dict):
        incomplete_reason = response.incomplete_details.get("reason")
    if incomplete_reason == "max_output_tokens":
        retry_max_output_tokens = max(base_max_output_tokens * 2, 4000)
        log.warning("OpenAI 출력이 max_output_tokens에 걸렸습니다. %s -> %s로 한 번 재시도합니다.", base_max_output_tokens, retry_max_output_tokens)
        request_kwargs["max_output_tokens"] = retry_max_output_tokens
        response = client.responses.create(**request_kwargs)
        analysis_text = extract_responses_output_text(response)
        incomplete_reason = getattr(getattr(response, "incomplete_details", None), "reason", None)
        if incomplete_reason is None and isinstance(getattr(response, "incomplete_details", None), dict):
            incomplete_reason = response.incomplete_details.get("reason")
    if analysis_text:
        return analysis_text
    response_summary = ""
    if hasattr(response, "model_dump_json"):
        try:
            response_summary = response.model_dump_json(indent=2)
        except Exception:
            response_summary = ""
    elif hasattr(response, "model_dump"):
        try:
            response_summary = json.dumps(response.model_dump(), ensure_ascii=False, indent=2)
        except Exception:
            response_summary = ""
    log.warning("OpenAI 응답은 성공했지만 Responses API에서도 추출 가능한 분석 텍스트가 없습니다.")
    if response_summary:
        log.warning("Responses raw summary: %s", response_summary[:4000])
    return "분석 결과 없음"


def markdown_to_html(text: str) -> str:
    lines = text.splitlines()
    html_lines: list[str] = []
    in_list = False

    def close_list():
        nonlocal in_list
        if in_list:
            html_lines.append("</ul>")
            in_list = False

    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            close_list()
            html_lines.append("<div style='height:8px'></div>")
            continue

        esc = html.escape(line)
        if esc.startswith("## "):
            close_list()
            html_lines.append(f"<h3 style='margin:18px 0 8px;color:#1f3f66'>{esc[3:]}</h3>")
        elif re.match(r"^(\- |\d+\. )", line):
            if not in_list:
                html_lines.append("<ul style='margin:6px 0 10px 20px;padding:0'>")
                in_list = True
            item = re.sub(r"^(\- |\d+\. )", "", esc)
            html_lines.append(f"<li style='margin:4px 0'>{item}</li>")
        else:
            close_list()
            html_lines.append(f"<p style='margin:6px 0;line-height:1.6'>{esc}</p>")

    close_list()
    return "\n".join(html_lines)


def build_summary_banner(title: str, subtitle: str, stat_items: list[tuple[str, str]]) -> str:
    stats_html = "".join(
        f"""
        <div style="background:#ffffff14;border:1px solid #ffffff22;border-radius:12px;padding:14px 18px;min-width:120px;text-align:center">
            <div style="font-size:26px;font-weight:700">{html.escape(value)}</div>
            <div style="font-size:12px;opacity:.9">{html.escape(label)}</div>
        </div>
        """
        for label, value in stat_items
    )
    return f"""
    <div style="background:linear-gradient(135deg,#153454,#2d5f93);color:#fff;border-radius:16px 16px 0 0;padding:26px 28px">
        <div style="font-size:13px;opacity:.85;margin-bottom:6px">{html.escape(subtitle)}</div>
        <h1 style="margin:0;font-size:26px">{html.escape(title)}</h1>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:20px">{stats_html}</div>
    </div>
    """


def build_daily_html(
    config: dict[str, Any],
    report_date: str,
    stats: dict[str, Any],
    analysis_text: str,
    previous_stats: dict[str, Any] | None,
) -> str:
    delta = "N/A"
    if previous_stats:
        delta = f"{stats['total'] - previous_stats.get('total', 0):+}"

    top_users_html = "".join(
        f"<li style='margin:4px 0'>{html.escape(user)} ({count})</li>"
        for user, count in stats.get("top_users", [])
    ) or "<li>없음</li>"

    keyword_html = ", ".join(html.escape(k) for k in stats.get("keywords", [])) or "없음"
    categories_html = "".join(
        f"<tr><td style='padding:8px 10px;border-bottom:1px solid #eef2f7'>{html.escape(CATEGORY_LABELS.get(cat, cat))}</td>"
        f"<td style='padding:8px 10px;border-bottom:1px solid #eef2f7;text-align:right'>{count}</td></tr>"
        for cat, count in stats.get("category_counts", {}).items()
    )

    banner = build_summary_banner(
        f"{config['report']['game_title']} Discord 일간 리포트",
        f"기준일: {report_date}",
        [
            ("총 메시지", str(stats["total"])),
            ("전일 대비", delta),
            ("키워드 수", str(len(stats.get("keywords", [])))),
        ],
    )

    return f"""
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Discord Daily Report</title>
</head>
<body style="margin:0;padding:24px;background:#eef3f8;font-family:Malgun Gothic,Arial,sans-serif;color:#243648">
  <div style="max-width:860px;margin:0 auto;background:#fff;border:1px solid #d8e3ef;border-radius:16px;overflow:hidden">
    {banner}
    <div style="padding:22px 26px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start">
        <div style="background:#f8fbff;border:1px solid #e1ecf8;border-radius:12px;padding:16px">
          <h2 style="margin:0 0 10px;font-size:18px;color:#1f3f66">📈 핵심 지표</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            {categories_html}
          </table>
        </div>
        <div style="background:#f8fbff;border:1px solid #e1ecf8;border-radius:12px;padding:16px">
          <h2 style="margin:0 0 10px;font-size:18px;color:#1f3f66">👤 핵심 유저</h2>
          <ul style="margin:0 0 12px 18px;padding:0">{top_users_html}</ul>
          <div style="font-size:14px;line-height:1.6"><strong>주요 키워드:</strong> {keyword_html}</div>
        </div>
      </div>

      <div style="margin-top:18px;background:#fff;border:1px solid #e6edf5;border-radius:12px;padding:18px">
        <h2 style="margin:0 0 10px;font-size:18px;color:#1f3f66">🧠 AI 분석</h2>
        <div style="font-size:14px;color:#2d3b4d">{markdown_to_html(analysis_text)}</div>
      </div>
    </div>
  </div>
</body>
</html>
""".strip()


def build_weekly_html(
    config: dict[str, Any],
    week_label: str,
    total_messages: int,
    included_dates: list[str],
    analysis_text: str,
) -> str:
    banner = build_summary_banner(
        f"{config['report']['game_title']} Discord 주간 리포트",
        f"범위: {week_label}",
        [
            ("포함 일자", str(len(included_dates))),
            ("총 메시지", str(total_messages)),
            ("마감 기준", included_dates[-1] if included_dates else "N/A"),
        ],
    )

    dates_html = "".join(
        f"<li style='margin:4px 0'>{html.escape(date)}</li>" for date in included_dates
    ) or "<li>없음</li>"

    return f"""
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Discord Weekly Report</title>
</head>
<body style="margin:0;padding:24px;background:#eef3f8;font-family:Malgun Gothic,Arial,sans-serif;color:#243648">
  <div style="max-width:860px;margin:0 auto;background:#fff;border:1px solid #d8e3ef;border-radius:16px;overflow:hidden">
    {banner}
    <div style="padding:22px 26px">
      <div style="display:grid;grid-template-columns:260px 1fr;gap:18px;align-items:start">
        <div style="background:#f8fbff;border:1px solid #e1ecf8;border-radius:12px;padding:16px">
          <h2 style="margin:0 0 10px;font-size:18px;color:#1f3f66">🗓 포함 일자</h2>
          <ul style="margin:0 0 0 18px;padding:0">{dates_html}</ul>
        </div>
        <div style="background:#fff;border:1px solid #e6edf5;border-radius:12px;padding:18px">
          <h2 style="margin:0 0 10px;font-size:18px;color:#1f3f66">🧠 AI 종합 분석</h2>
          <div style="font-size:14px;color:#2d3b4d">{markdown_to_html(analysis_text)}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
""".strip()


def write_report_html(path: Path, html_text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html_text, encoding="utf-8")
    log.info("리포트 저장: %s", path)


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


def compute_week_window(current_local_date) -> tuple[str, list[str]]:
    # Friday run => summarize previous Friday ~ Thursday.
    week_end = current_local_date - timedelta(days=1)
    week_start = week_end - timedelta(days=6)
    label = f"{week_start.isoformat()} ~ {week_end.isoformat()}"
    dates = [(week_start + timedelta(days=i)).isoformat() for i in range(7)]
    return label, dates


def should_send_weekly(config: dict[str, Any], run_local_dt: datetime) -> bool:
    if not config["report"].get("weekly_enabled", True):
        return False
    return run_local_dt.weekday() == int(config["report"].get("weekly_send_weekday", 4))


def build_daily_subject(config: dict[str, Any], report_date: str) -> str:
    prefix = config["email"].get("subject_prefix", "[Blackshot] Discord 리포트")
    return f"{prefix} [일간] {report_date}"


def build_weekly_subject(config: dict[str, Any], week_label: str) -> str:
    prefix = config["email"].get("subject_prefix", "[Blackshot] Discord 리포트")
    return f"{prefix} [주간] {week_label}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force-send-daily", action="store_true", help="같은 날짜 일간 메일을 강제로 다시 보냅니다.")
    parser.add_argument("--force-send-weekly", action="store_true", help="같은 주간 메일을 강제로 다시 보냅니다.")
    parser.add_argument("--rebuild-daily", action="store_true", help="오늘 수집 범위를 중복 제거 없이 다시 분석하고 일간 리포트를 새로 생성합니다.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    config = load_config()
    tzinfo = get_tz(config)
    now_utc = datetime.now(timezone.utc)
    now_local = now_utc.astimezone(tzinfo)
    report_date = now_local.date().isoformat()
    after_dt = now_utc - timedelta(hours=int(config["report"]["lookback_hours"]))

    log.info("=" * 64)
    log.info("Discord Report 시작 | local=%s | UTC=%s", now_local.isoformat(), now_utc.isoformat())
    log.info("수집 범위: %s UTC 이후", after_dt.isoformat())

    state = load_state()
    prune_seen_messages(state, now_utc)

    raw_messages = collect_messages(config, after_dt)
    fresh_messages = raw_messages if args.rebuild_daily else dedupe_new_messages(raw_messages, state)
    previous_stats = get_previous_daily_stats(state, report_date)
    daily_entry = state.get("daily_reports", {}).get(report_date)
    daily_already_sent = False if args.rebuild_daily else bool(daily_entry and daily_entry.get("sent"))

    if args.rebuild_daily:
        log.info("일간 리포트 재빌드 모드 활성화: 최근 %s시간 데이터를 다시 분석합니다.", int(config["report"]["lookback_hours"]))

    if not fresh_messages and daily_already_sent and not args.force_send_daily:
        log.info("신규 메시지 없음 + 오늘 일간 메일 이미 발송됨. 일간 작업 종료")
    else:
        reuse_existing_daily = not fresh_messages and daily_entry and args.force_send_daily
        if reuse_existing_daily:
            stats = daily_entry.get("stats", {})
            analysis_text = daily_entry.get("analysis_text", "")
            log.info("신규 메시지 없음. 기존 일간 리포트를 재사용해 강제 재발송합니다: %s", report_date)
        else:
            stats = basic_stats(fresh_messages)
        if fresh_messages:
            analysis_text = safe_analyze_text(config, build_daily_prompt(config, stats, fresh_messages, previous_stats))
        elif not reuse_existing_daily:
            stats = {
                "total": 0,
                "top_users": [],
                "keywords": [],
                "category_counts": {},
                "channel_counts": {},
            }
            analysis_text = (
                "## 📊 일간 요약\n"
                "- 전반 분위기: 신규 메시지 없음\n"
                "- 활동량 해석: 이번 재실행 구간에서 신규 수집 메시지가 없습니다.\n\n"
                "## ⚡ 운영 액션 제안\n"
                "- 즉시 확인 필요: 없음\n"
                "- 후속 모니터링: 다음 자동 실행까지 대기\n"
            )

        daily_html = build_daily_html(config, report_date, stats, analysis_text, previous_stats)
        daily_report_path = DAILY_DIR / f"report_{report_date.replace('-', '')}.html"
        if config["report"].get("save_html", True):
            write_report_html(daily_report_path, daily_html)

        send_daily = bool(config["report"].get("daily_send_enabled", True)) and (args.force_send_daily or not daily_already_sent)
        if send_daily:
            log.info("일간 메일 발송 시도: subject=%s recipients=%s", build_daily_subject(config, report_date), ", ".join(config["email"]["recipients"]))
            send_email(config, build_daily_subject(config, report_date), daily_html)
        else:
            log.info("일간 메일 발송 스킵: 이미 발송됨")

        state.setdefault("daily_reports", {})[report_date] = {
            "date": report_date,
            "stats": stats,
            "analysis_text": analysis_text,
            "html_path": str(daily_report_path),
            "sent": daily_already_sent or send_daily,
            "last_run_at": now_local.isoformat(),
            "new_message_count": len(fresh_messages),
        }
        mark_seen_messages(fresh_messages, state)
        save_state(state)

    if should_send_weekly(config, now_local):
        week_label, included_dates = compute_week_window(now_local.date())
        week_key = week_label.replace(" ~ ", "_")
        weekly_entry = state.get("weekly_reports", {}).get(week_key)
        weekly_already_sent = bool(weekly_entry and weekly_entry.get("sent"))

        daily_entries = []
        for date_key in included_dates:
            entry = state.get("daily_reports", {}).get(date_key)
            if entry:
                daily_entries.append(entry)

        if not daily_entries:
            log.info("주간 리포트 생성 스킵: 포함할 일간 데이터 없음")
        elif weekly_already_sent and not args.force_send_weekly:
            log.info("주간 메일 발송 스킵: 이미 발송됨 (%s)", week_label)
        else:
            weekly_analysis = safe_analyze_text(config, build_weekly_prompt(config, week_label, daily_entries))
            weekly_total_messages = sum(entry["stats"].get("total", 0) for entry in daily_entries)
            weekly_html = build_weekly_html(config, week_label, weekly_total_messages, included_dates, weekly_analysis)
            weekly_path = WEEKLY_DIR / f"report_{week_key.replace('-', '')}.html"
            if config["report"].get("save_html", True):
                write_report_html(weekly_path, weekly_html)
            send_email(config, build_weekly_subject(config, week_label), weekly_html)
            state.setdefault("weekly_reports", {})[week_key] = {
                "week_label": week_label,
                "included_dates": included_dates,
                "html_path": str(weekly_path),
                "analysis_text": weekly_analysis,
                "sent": True,
                "last_run_at": now_local.isoformat(),
            }
            save_state(state)
    else:
        log.info("오늘은 주간 리포트 발송 요일이 아님")

    save_state(state)
    log.info("완료")


if __name__ == "__main__":
    main()
