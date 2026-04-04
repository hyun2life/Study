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
import os
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
ENV_PATH = BASE_DIR / ".env"
STATE_PATH = BASE_DIR / "state.json"
REPORTS_DIR = BASE_DIR / "reports"
DAILY_DIR = REPORTS_DIR / "daily"
WEEKLY_DIR = REPORTS_DIR / "weekly"
FACEBOOK_DAILY_DIR = REPORTS_DIR / "facebook_daily"
LOGS_DIR = BASE_DIR / "logs"

DISCORD_API = "https://discord.com/api/v10"
FACEBOOK_GRAPH_API = "https://graph.facebook.com"
DISCORD_EPOCH_MS = 1420070400000
DEFAULT_TIMEZONE = "Asia/Seoul"
SEEN_ID_RETENTION_DAYS = 21
MAX_PROMPT_MESSAGES = 200
MAX_MESSAGE_PREVIEW_LEN = 280
CATEGORY_CHANNEL_TYPE = 4
MESSAGE_CHANNEL_TYPES = {0, 5}

DEFAULT_CATEGORY_LABELS = {
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
FACEBOOK_DAILY_DIR.mkdir(exist_ok=True)
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

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="backslashreplace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="backslashreplace")


def load_dotenv() -> dict[str, str]:
    if not ENV_PATH.exists():
        return {}

    env: dict[str, str] = {}
    for line_no, raw_line in enumerate(ENV_PATH.read_text(encoding="utf-8").splitlines(), start=1):
        line = raw_line.strip().lstrip("\ufeff")
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            log.warning(".env %s번째 줄 형식이 올바르지 않아 건너뜁니다.", line_no)
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not key:
            log.warning(".env %s번째 줄에 키가 없어 건너뜁니다.", line_no)
            continue
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        env[key] = value
    return env


def get_env_value(dotenv: dict[str, str], key: str) -> str | None:
    if key in os.environ:
        return os.environ[key]
    return dotenv.get(key)


def split_csv_env(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def normalize_channel_sources(channels_cfg: Any) -> dict[str, list[dict[str, str]]]:
    if not isinstance(channels_cfg, dict):
        raise SystemExit("discord.channels 형식이 올바르지 않습니다. 카테고리별 객체여야 합니다.")

    normalized: dict[str, list[dict[str, str]]] = {}
    for report_category, sources in channels_cfg.items():
        if sources is None:
            normalized[report_category] = []
            continue
        if not isinstance(sources, list):
            raise SystemExit(f"discord.channels.{report_category} 형식이 올바르지 않습니다. 배열이어야 합니다.")

        normalized_sources: list[dict[str, str]] = []
        for index, source in enumerate(sources, start=1):
            if not isinstance(source, dict):
                raise SystemExit(
                    f"discord.channels.{report_category}[{index}] 형식이 올바르지 않습니다. 객체여야 합니다."
                )

            channel_id = str(source.get("id", "")).strip()
            category_id = str(source.get("category_id", "")).strip()
            name = str(source.get("name", "")).strip()

            if channel_id:
                normalized_sources.append({
                    "type": "channel",
                    "id": channel_id,
                    "name": name or channel_id,
                })
                continue
            if category_id:
                normalized_sources.append({
                    "type": "category",
                    "category_id": category_id,
                    "name": name or f"category:{category_id}",
                })
                continue

            raise SystemExit(
                f"discord.channels.{report_category}[{index}] 에는 id 또는 category_id 중 하나가 필요합니다."
            )

        normalized[report_category] = normalized_sources

    return normalized


def normalize_facebook_pages(pages_cfg: Any) -> list[dict[str, str]]:
    if pages_cfg is None:
        return []
    if not isinstance(pages_cfg, list):
        raise SystemExit("facebook.pages 형식이 올바르지 않습니다. 배열이어야 합니다.")

    normalized: list[dict[str, str]] = []
    for index, page in enumerate(pages_cfg, start=1):
        if not isinstance(page, dict):
            raise SystemExit(f"facebook.pages[{index}] 형식이 올바르지 않습니다. 객체여야 합니다.")
        page_id = str(page.get("page_id", "")).strip()
        name = str(page.get("name", "")).strip()
        if not page_id:
            raise SystemExit(f"facebook.pages[{index}] 에는 page_id가 필요합니다.")
        normalized.append({
            "page_id": page_id,
            "name": name or page_id,
        })
    return normalized


def get_report_categories(config: dict[str, Any]) -> list[str]:
    channels_cfg = config.get("discord", {}).get("channels", {})
    if not isinstance(channels_cfg, dict):
        return []
    return list(channels_cfg.keys())


def get_category_label(config: dict[str, Any], category: str) -> str:
    custom_labels = config.get("discord", {}).get("category_labels", {})
    if isinstance(custom_labels, dict):
        label = str(custom_labels.get(category, "")).strip()
        if label:
            return label
    return DEFAULT_CATEGORY_LABELS.get(category, category)


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

    dotenv = load_dotenv()
    discord_cfg = config["discord"]
    facebook_cfg = config.setdefault("facebook", {})
    openai_cfg = config["openai"]
    email_cfg = config["email"]
    report_cfg = config["report"]
    discord_cfg["channels"] = normalize_channel_sources(discord_cfg.get("channels", {}))
    facebook_cfg["pages"] = normalize_facebook_pages(facebook_cfg.get("pages", []))

    discord_cfg["bot_token"] = get_env_value(dotenv, "DISCORD_BOT_TOKEN") or discord_cfg.get("bot_token", "")
    facebook_cfg["page_access_token"] = get_env_value(dotenv, "FACEBOOK_PAGE_ACCESS_TOKEN") or facebook_cfg.get("page_access_token", "")
    openai_cfg["api_key"] = get_env_value(dotenv, "OPENAI_API_KEY") or openai_cfg.get("api_key", "")
    email_cfg["smtp_host"] = get_env_value(dotenv, "SMTP_HOST") or email_cfg.get("smtp_host", "")
    smtp_port = get_env_value(dotenv, "SMTP_PORT")
    if smtp_port:
        try:
            email_cfg["smtp_port"] = int(smtp_port)
        except ValueError as exc:
            raise SystemExit(f"SMTP_PORT 값이 올바르지 않습니다: {smtp_port}") from exc
    email_cfg["sender_address"] = get_env_value(dotenv, "SMTP_SENDER_ADDRESS") or email_cfg.get("sender_address", "")
    email_cfg["sender_password"] = get_env_value(dotenv, "SMTP_SENDER_PASSWORD") or email_cfg.get("sender_password", "")
    recipients = get_env_value(dotenv, "SMTP_RECIPIENTS")
    if recipients is not None:
        email_cfg["recipients"] = split_csv_env(recipients)
    email_cfg["subject_prefix"] = get_env_value(dotenv, "EMAIL_SUBJECT_PREFIX") or email_cfg.get("subject_prefix", "")

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

    facebook_cfg.setdefault("enabled", False)
    facebook_cfg.setdefault("send_daily_email", True)
    facebook_cfg.setdefault("graph_api_version", "v23.0")

    openai_cfg.setdefault("model", "gpt-5")
    openai_cfg.setdefault("max_input_messages", MAX_PROMPT_MESSAGES)
    openai_cfg.setdefault("max_output_tokens", 2400)
    openai_cfg.setdefault("reasoning_effort", "low")
    openai_cfg.setdefault("text_verbosity", "low")
    openai_cfg.setdefault("timeout_seconds", 90)

    missing_values = []
    if not discord_cfg.get("bot_token"):
        missing_values.append("DISCORD_BOT_TOKEN 또는 discord.bot_token")
    if facebook_cfg.get("enabled"):
        if not facebook_cfg.get("page_access_token"):
            missing_values.append("FACEBOOK_PAGE_ACCESS_TOKEN 또는 facebook.page_access_token")
        if not facebook_cfg.get("pages"):
            missing_values.append("facebook.pages")
    if not openai_cfg.get("api_key"):
        missing_values.append("OPENAI_API_KEY 또는 openai.api_key")
    if not email_cfg.get("smtp_host"):
        missing_values.append("SMTP_HOST 또는 email.smtp_host")
    if not email_cfg.get("smtp_port"):
        missing_values.append("SMTP_PORT 또는 email.smtp_port")
    if not email_cfg.get("sender_address"):
        missing_values.append("SMTP_SENDER_ADDRESS 또는 email.sender_address")
    if not email_cfg.get("sender_password"):
        missing_values.append("SMTP_SENDER_PASSWORD 또는 email.sender_password")
    if not email_cfg.get("recipients"):
        missing_values.append("SMTP_RECIPIENTS 또는 email.recipients")
    if missing_values:
        raise SystemExit("필수 설정값이 비어 있습니다: " + ", ".join(missing_values))

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
            "facebook_daily_reports": {},
        }

    try:
        state = json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except Exception:
        log.warning("state.json 로드에 실패했습니다. 빈 상태로 시작합니다.")
        return {
            "seen_messages": {},
            "daily_reports": {},
            "weekly_reports": {},
            "facebook_daily_reports": {},
        }

    state.setdefault("seen_messages", {})
    state.setdefault("daily_reports", {})
    state.setdefault("weekly_reports", {})
    state.setdefault("facebook_daily_reports", {})
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


def discord_api_get(path: str, token: str, params: dict[str, Any] | None = None) -> requests.Response:
    headers = {"Authorization": f"Bot {token}"}
    return requests.get(f"{DISCORD_API}{path}", headers=headers, params=params, timeout=20)


def fetch_channel_info(channel_id: str, token: str) -> dict[str, Any] | None:
    resp = discord_api_get(f"/channels/{channel_id}", token)
    if resp.status_code == 403:
        log.warning("채널 %s 정보에 접근할 수 없습니다 (403).", channel_id)
        return None
    if resp.status_code == 404:
        log.warning("채널 %s 정보를 찾을 수 없습니다 (404).", channel_id)
        return None
    resp.raise_for_status()
    return resp.json()


def fetch_guild_channels(guild_id: str, token: str) -> list[dict[str, Any]]:
    resp = discord_api_get(f"/guilds/{guild_id}/channels", token)
    if resp.status_code == 403:
        log.warning("길드 %s 채널 목록에 접근할 수 없습니다 (403).", guild_id)
        return []
    if resp.status_code == 404:
        log.warning("길드 %s 를 찾을 수 없습니다 (404).", guild_id)
        return []
    resp.raise_for_status()
    data = resp.json()
    return data if isinstance(data, list) else []


def expand_category_channels(
    category_id: str,
    token: str,
    guild_channel_cache: dict[str, list[dict[str, Any]]],
) -> list[dict[str, str]]:
    category_info = fetch_channel_info(category_id, token)
    if not category_info:
        return []

    category_type = category_info.get("type")
    if category_type != CATEGORY_CHANNEL_TYPE:
        log.warning("ID %s 는 Discord 카테고리가 아닙니다 (type=%s).", category_id, category_type)
        return []

    guild_id = str(category_info.get("guild_id", "")).strip()
    if not guild_id:
        log.warning("카테고리 %s 에 guild_id가 없어 하위 채널을 찾을 수 없습니다.", category_id)
        return []

    if guild_id not in guild_channel_cache:
        guild_channel_cache[guild_id] = fetch_guild_channels(guild_id, token)

    children = [
        ch for ch in guild_channel_cache[guild_id]
        if str(ch.get("parent_id", "")) == category_id and ch.get("type") in MESSAGE_CHANNEL_TYPES
    ]
    children.sort(key=lambda ch: (int(ch.get("position", 0)), str(ch.get("name", "")).lower()))

    resolved = [
        {
            "id": str(ch["id"]),
            "name": str(ch.get("name", ch["id"])),
        }
        for ch in children
        if ch.get("id")
    ]
    log.info(
        "Category %-24s | %4d channels",
        category_info.get("name", category_id),
        len(resolved),
    )
    return resolved


def resolve_configured_channels(config: dict[str, Any]) -> dict[str, list[dict[str, str]]]:
    token = config["discord"]["bot_token"]
    guild_channel_cache: dict[str, list[dict[str, Any]]] = {}
    resolved: dict[str, list[dict[str, str]]] = {}

    for report_category, sources in config["discord"]["channels"].items():
        report_channels: list[dict[str, str]] = []
        seen_channel_ids: set[str] = set()

        for source in sources:
            source_type = source.get("type")
            if source_type == "channel":
                candidates = [{"id": source["id"], "name": source["name"]}]
            elif source_type == "category":
                candidates = expand_category_channels(source["category_id"], token, guild_channel_cache)
            else:
                log.warning("알 수 없는 채널 소스 형식입니다: %s", source)
                continue

            for channel in candidates:
                channel_id = channel["id"]
                if channel_id in seen_channel_ids:
                    continue
                seen_channel_ids.add(channel_id)
                report_channels.append(channel)

        resolved[report_category] = report_channels

    return resolved


def fetch_messages(channel_id: str, token: str, after_dt: datetime, before_dt: datetime | None = None) -> list[dict[str, Any]]:
    after_snowflake = int(snowflake_from_datetime(after_dt))
    before_snowflake = snowflake_from_datetime(before_dt) if before_dt is not None else None
    cursor_before = before_snowflake
    collected: list[dict[str, Any]] = []

    while True:
        params = {"limit": 100}
        if cursor_before is not None:
            params["before"] = cursor_before
        resp = discord_api_get(f"/channels/{channel_id}/messages", token, params=params)

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
        reached_after_boundary = False
        for m in batch:
            if int(m["id"]) <= after_snowflake:
                reached_after_boundary = True
                continue
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
        cursor_before = batch[-1]["id"]

        if len(batch) < 100 or reached_after_boundary:
            break

    collected.sort(key=lambda m: int(m["id"]))
    return collected


def collect_messages(config: dict[str, Any], after_dt: datetime, before_dt: datetime | None = None) -> list[dict[str, Any]]:
    token = config["discord"]["bot_token"]
    all_messages: list[dict[str, Any]] = []
    resolved_channels = resolve_configured_channels(config)

    for category, channels in resolved_channels.items():
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


def facebook_api_get(
    path: str,
    token: str,
    api_version: str,
    params: dict[str, Any] | None = None,
    next_url: str | None = None,
) -> requests.Response:
    if next_url:
        return requests.get(next_url, timeout=30)
    merged = dict(params or {})
    merged["access_token"] = token
    url = f"{FACEBOOK_GRAPH_API}/{api_version}{path}"
    return requests.get(url, params=merged, timeout=30)


def facebook_datetime(value: str) -> datetime | None:
    if not value:
        return None
    normalized = value.strip()
    if normalized.endswith("Z"):
        normalized = f"{normalized[:-1]}+00:00"
    for parser in (
        lambda text: datetime.fromisoformat(text),
        lambda text: datetime.strptime(text, "%Y-%m-%dT%H:%M:%S%z"),
    ):
        try:
            return parser(normalized).astimezone(timezone.utc)
        except ValueError:
            continue
    return None


def facebook_text(value: Any) -> str:
    return normalize_text(str(value or "").strip())


def facebook_post_title(post: dict[str, Any]) -> str:
    text = facebook_text(post.get("content", ""))
    if text:
        return text[:90]
    status_type = facebook_text(post.get("_status_type", ""))
    return status_type or "텍스트 없는 게시글"


def fetch_facebook_edge(
    path: str,
    token: str,
    api_version: str,
    params: dict[str, Any],
) -> list[dict[str, Any]]:
    collected: list[dict[str, Any]] = []
    next_url: str | None = None
    while True:
        resp = facebook_api_get(path, token, api_version, params=params, next_url=next_url)
        resp.raise_for_status()
        payload = resp.json()
        if not isinstance(payload, dict):
            break
        batch = payload.get("data", [])
        if not isinstance(batch, list) or not batch:
            break
        collected.extend(item for item in batch if isinstance(item, dict))
        next_url = payload.get("paging", {}).get("next")
        if not next_url:
            break
    return collected


def fetch_facebook_comments(
    object_id: str,
    page_id: str,
    page_name: str,
    post_id: str,
    post_title: str,
    token: str,
    api_version: str,
    after_dt: datetime,
    before_dt: datetime | None = None,
    parent_comment_id: str | None = None,
) -> list[dict[str, Any]]:
    params = {
        "fields": "id,message,created_time,from,comment_count,parent{id}",
        "limit": 100,
        "filter": "stream",
    }
    if after_dt is not None:
        params["since"] = int(after_dt.timestamp())
    if before_dt is not None:
        params["until"] = int(before_dt.timestamp())

    comments: list[dict[str, Any]] = []
    for raw_comment in fetch_facebook_edge(f"/{object_id}/comments", token, api_version, params):
        created_time = facebook_datetime(str(raw_comment.get("created_time", "")))
        if created_time is None:
            continue
        if created_time < after_dt:
            continue
        if before_dt is not None and created_time >= before_dt:
            continue
        message = facebook_text(raw_comment.get("message", ""))
        if message:
            comments.append({
                "id": str(raw_comment.get("id", "")),
                "content": message,
                "author": {"username": facebook_text(raw_comment.get("from", {}).get("name", "unknown")) or "unknown"},
                "_platform": "facebook",
                "_content_type": "comment",
                "_page_id": page_id,
                "_page_name": page_name,
                "_post_id": post_id,
                "_post_title": post_title,
                "_parent_id": parent_comment_id or str(raw_comment.get("parent", {}).get("id", "")).strip(),
                "_created_time": created_time.isoformat(),
            })

        reply_count = int(raw_comment.get("comment_count", 0) or 0)
        comment_id = str(raw_comment.get("id", "")).strip()
        if reply_count > 0 and comment_id:
            comments.extend(
                fetch_facebook_comments(
                    comment_id,
                    page_id,
                    page_name,
                    post_id,
                    post_title,
                    token,
                    api_version,
                    after_dt,
                    before_dt,
                    parent_comment_id=comment_id,
                )
            )
    return comments


def fetch_facebook_page_data(
    page: dict[str, str],
    config: dict[str, Any],
    after_dt: datetime,
    before_dt: datetime | None = None,
) -> dict[str, Any]:
    token = config["facebook"]["page_access_token"]
    api_version = config["facebook"]["graph_api_version"]
    page_id = page["page_id"]
    page_name = page["name"]
    params: dict[str, Any] = {
        "fields": "id,message,story,created_time,permalink_url,status_type,from",
        "limit": 100,
    }
    if after_dt is not None:
        params["since"] = int(after_dt.timestamp())
    if before_dt is not None:
        params["until"] = int(before_dt.timestamp())

    posts: list[dict[str, Any]] = []
    comments: list[dict[str, Any]] = []
    for raw_post in fetch_facebook_edge(f"/{page_id}/posts", token, api_version, params):
        created_time = facebook_datetime(str(raw_post.get("created_time", "")))
        if created_time is None:
            continue
        if created_time < after_dt:
            continue
        if before_dt is not None and created_time >= before_dt:
            continue

        content = facebook_text(raw_post.get("message") or raw_post.get("story") or "")
        post_id = str(raw_post.get("id", "")).strip()
        post_item = {
            "id": post_id,
            "content": content,
            "author": {"username": facebook_text(raw_post.get("from", {}).get("name", page_name)) or page_name},
            "_platform": "facebook",
            "_content_type": "post",
            "_page_id": page_id,
            "_page_name": page_name,
            "_permalink_url": str(raw_post.get("permalink_url", "")).strip(),
            "_status_type": facebook_text(raw_post.get("status_type", "")),
            "_created_time": created_time.isoformat(),
        }
        posts.append(post_item)
        comments.extend(
            fetch_facebook_comments(
                post_id,
                page_id,
                page_name,
                post_id,
                facebook_post_title(post_item),
                token,
                api_version,
                after_dt,
                before_dt,
            )
        )

    posts.sort(key=lambda item: item.get("_created_time", ""))
    deduped_comments: dict[str, dict[str, Any]] = {}
    for comment in comments:
        comment_id = str(comment.get("id", "")).strip()
        if comment_id and comment_id not in deduped_comments:
            deduped_comments[comment_id] = comment
    comments = sorted(deduped_comments.values(), key=lambda item: item.get("_created_time", ""))
    return {
        "page_id": page_id,
        "page_name": page_name,
        "posts": posts,
        "comments": comments,
    }


def collect_facebook_data(
    config: dict[str, Any],
    after_dt: datetime,
    before_dt: datetime | None = None,
) -> tuple[list[dict[str, Any]], list[str]]:
    if not config.get("facebook", {}).get("enabled"):
        return [], []

    page_results = []
    errors: list[str] = []
    for page in config["facebook"]["pages"]:
        try:
            page_data = fetch_facebook_page_data(page, config, after_dt, before_dt)
        except requests.RequestException as exc:
            log.warning("Facebook 페이지 %s 수집 실패: %s", page["name"], exc)
            errors.append(f"{page['name']}: {exc}")
            continue
        page_results.append(page_data)
        log.info(
            "Facebook Page %-24s | %4d posts | %4d comments",
            page_data["page_name"],
            len(page_data["posts"]),
            len(page_data["comments"]),
        )
    return page_results, errors


def facebook_item_ids(page_results: list[dict[str, Any]]) -> list[str]:
    return sorted(
        {
            str(item["id"])
            for page_data in page_results
            for item in [*page_data.get("posts", []), *page_data.get("comments", [])]
            if item.get("id")
        }
    )


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


def build_category_stats(messages: list[dict[str, Any]], configured_categories: list[str]) -> dict[str, dict[str, Any]]:
    grouped: dict[str, list[dict[str, Any]]] = {key: [] for key in configured_categories}
    for m in messages:
        grouped.setdefault(m.get("_category", "unknown"), []).append(m)

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


def build_facebook_stats(page_results: list[dict[str, Any]]) -> dict[str, Any]:
    pages = Counter()
    commenters = Counter()
    keywords = Counter()
    post_counts: dict[str, int] = {}
    comment_counts: dict[str, int] = {}
    top_posts: list[dict[str, Any]] = []

    total_posts = 0
    total_comments = 0
    for page_data in page_results:
        page_name = page_data["page_name"]
        posts = page_data.get("posts", [])
        comments = page_data.get("comments", [])
        total_posts += len(posts)
        total_comments += len(comments)
        post_counts[page_name] = len(posts)
        comment_counts[page_name] = len(comments)
        pages[page_name] += len(posts) + len(comments)

        comments_by_post = Counter(comment.get("_post_id", "") for comment in comments if comment.get("_post_id"))
        for post in posts:
            keywords.update(tokenize(post.get("content", "")))
            top_posts.append({
                "post_id": post["id"],
                "page_name": page_name,
                "title": facebook_post_title(post),
                "comment_count": comments_by_post.get(post["id"], 0),
                "permalink_url": post.get("_permalink_url", ""),
            })
        for comment in comments:
            commenters[comment.get("author", {}).get("username", "unknown")] += 1
            keywords.update(tokenize(comment.get("content", "")))

    top_posts.sort(key=lambda item: (-item["comment_count"], item["title"]))
    return {
        "total_posts": total_posts,
        "total_comments": total_comments,
        "total_items": total_posts + total_comments,
        "page_post_counts": post_counts,
        "page_comment_counts": comment_counts,
        "top_pages": pages.most_common(5),
        "top_commenters": commenters.most_common(5),
        "keywords": [word for word, _ in keywords.most_common(12)],
        "top_posts": top_posts[:5],
    }


def build_facebook_page_stats(page_results: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    for page_data in page_results:
        posts = page_data.get("posts", [])
        comments = page_data.get("comments", [])
        commenters = Counter()
        keywords = Counter()
        comments_by_post = Counter(comment.get("_post_id", "") for comment in comments if comment.get("_post_id"))
        for post in posts:
            keywords.update(tokenize(post.get("content", "")))
        for comment in comments:
            commenters[comment.get("author", {}).get("username", "unknown")] += 1
            keywords.update(tokenize(comment.get("content", "")))
        top_posts = []
        for post in posts:
            top_posts.append({
                "post_id": post["id"],
                "title": facebook_post_title(post),
                "comment_count": comments_by_post.get(post["id"], 0),
                "permalink_url": post.get("_permalink_url", ""),
            })
        top_posts.sort(key=lambda item: (-item["comment_count"], item["title"]))
        result[page_data["page_name"]] = {
            "posts": len(posts),
            "comments": len(comments),
            "top_commenters": commenters.most_common(3),
            "keywords": [word for word, _ in keywords.most_common(8)],
            "top_posts": top_posts[:3],
        }
    return result


def format_message_samples(messages: list[dict[str, Any]], limit: int) -> str:
    lines = []
    for m in messages[:limit]:
        user = m.get("author", {}).get("username", "unknown")
        channel = m.get("_channel_name", "unknown")
        text = normalize_text(m.get("content", ""))[:MAX_MESSAGE_PREVIEW_LEN]
        lines.append(f"[{channel}] {user}: {text}")
    return "\n".join(lines)


def format_facebook_samples(posts: list[dict[str, Any]], comments: list[dict[str, Any]], limit: int) -> str:
    lines = []
    for post in posts[: max(1, limit // 2)]:
        page_name = post.get("_page_name", "unknown")
        text = facebook_post_title(post)
        lines.append(f"[{page_name}][게시글] {text}")
    for comment in comments[: max(1, limit // 2)]:
        page_name = comment.get("_page_name", "unknown")
        user = comment.get("author", {}).get("username", "unknown")
        text = normalize_text(comment.get("content", ""))[:MAX_MESSAGE_PREVIEW_LEN]
        post_title = normalize_text(comment.get("_post_title", ""))[:50] or "원문 없음"
        lines.append(f"[{page_name}][댓글][{post_title}] {user}: {text}")
    return "\n".join(lines[:limit])


def facebook_analysis_system_prompt() -> str:
    return (
        "당신은 Facebook 페이지 운영 리포트를 작성하는 커뮤니티 분석가입니다. "
        "게시글과 댓글을 명확히 구분하고, 댓글 반응의 온도와 운영상 필요한 후속 조치를 "
        "한국어로 간결하고 실무적으로 정리하세요."
    )


def build_facebook_daily_prompt(
    config: dict[str, Any],
    report_date: str,
    window_label: str,
    stats: dict[str, Any],
    page_stats: dict[str, dict[str, Any]],
    page_results: list[dict[str, Any]],
) -> str:
    game_title = config["report"]["game_title"]
    page_lines = []
    for page_name, page_stat in page_stats.items():
        top_posts = ", ".join(
            f"{post['title']}({post['comment_count']} comments)"
            for post in page_stat.get("top_posts", [])
        ) or "없음"
        page_lines.append(
            f"- {page_name}: 게시글 {page_stat.get('posts', 0)}건, 댓글 {page_stat.get('comments', 0)}건, "
            f"주요 키워드 {', '.join(page_stat.get('keywords', [])) or '없음'}, "
            f"댓글 많은 게시글 {top_posts}"
        )

    all_posts = [post for page_data in page_results for post in page_data.get("posts", [])]
    all_comments = [comment for page_data in page_results for comment in page_data.get("comments", [])]
    top_posts_text = "\n".join(
        f"- {item['page_name']}: {item['title']} ({item['comment_count']} comments)"
        for item in stats.get("top_posts", [])
    ) or "- 없음"
    top_commenters = ", ".join(f"{name}({count})" for name, count in stats.get("top_commenters", [])) or "없음"
    keywords = ", ".join(stats.get("keywords", [])) or "없음"
    samples = format_facebook_samples(all_posts, all_comments, min(60, config["openai"]["max_input_messages"]))
    return f"""
다음은 {game_title} Facebook 페이지의 일간 리포트 데이터입니다.

[기본 정보]
- 기준일: {report_date}
- 수집 구간: {window_label}

[핵심 지표]
- 총 게시글 수: {stats.get('total_posts', 0)}
- 총 댓글 수: {stats.get('total_comments', 0)}
- 주요 댓글 작성자: {top_commenters}
- 주요 키워드: {keywords}

[페이지별 현황]
{chr(10).join(page_lines) or '- 수집 페이지 없음'}

[댓글이 많이 달린 게시글 Top]
{top_posts_text}

[샘플]
{samples or '없음'}

운영팀이 바로 참고할 수 있도록 한국어로 간결하고 실무적으로 작성하세요.

## 일간 요약
- 전체 분위기:
- 핵심 해석:

## 페이지별 반응
- 

## 주요 게시글
- 

## 댓글 반응 분석
- 

## 운영 액션 제안
- 즉시 확인 필요:
- 다음 게시/댓글 대응:
""".strip()


def build_facebook_page_prompt(
    config: dict[str, Any],
    page_name: str,
    page_stat: dict[str, Any],
    posts: list[dict[str, Any]],
    comments: list[dict[str, Any]],
    report_date: str,
    window_label: str,
) -> str:
    top_posts = ", ".join(
        f"{post['title']}({post['comment_count']} comments)"
        for post in page_stat.get("top_posts", [])
    ) or "없음"
    top_commenters = ", ".join(f"{name}({count})" for name, count in page_stat.get("top_commenters", [])) or "없음"
    keywords = ", ".join(page_stat.get("keywords", [])) or "없음"
    samples = format_facebook_samples(posts, comments, 40)
    return f"""
다음은 Facebook 페이지 '{page_name}'의 일간 리포트 데이터입니다.

[기본 정보]
- 기준일: {report_date}
- 수집 구간: {window_label}

[페이지 지표]
- 게시글 수: {page_stat.get('posts', 0)}
- 댓글 수: {page_stat.get('comments', 0)}
- 주요 댓글 작성자: {top_commenters}
- 주요 키워드: {keywords}
- 댓글 많은 게시글: {top_posts}

[샘플]
{samples or '없음'}

운영팀이 참고할 수 있도록 한국어로 간결하게 작성하세요.

## 페이지 요약
- 분위기:
- 핵심 해석:

## 주요 포인트
- 
- 

## 운영 메모
- 즉시 확인:
- 다음 대응:
""".strip()


def format_category_counts(config: dict[str, Any], stats: dict[str, Any]) -> str:
    return "\n".join(
        f"- {get_category_label(config, key)}: {stats['category_counts'].get(key, 0)}"
        for key in get_report_categories(config)
    )


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
{format_category_counts(config, stats)}

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
    category_label = get_category_label(config, category)
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


def analyze_text(config: dict[str, Any], prompt: str, system_prompt: str | None = None) -> str:
    client = OpenAI(
        api_key=config["openai"]["api_key"],
        timeout=float(config["openai"].get("timeout_seconds", 90)),
    )
    system_text = system_prompt or (
        "당신은 Discord 커뮤니티 리포트를 작성하는 운영 분석가입니다. "
        "과장 없이 실행 가능한 인사이트, 명확한 추세, 실무적인 다음 액션을 한국어로 간결하게 정리하세요."
    )
    base_max_output_tokens = int(config["openai"].get("max_output_tokens", 1200))
    request_kwargs = {
        "model": config["openai"]["model"],
        "input": [
            {"role": "system", "content": [{"type": "input_text", "text": system_text}]},
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


def safe_analyze_text(config: dict[str, Any], prompt: str, system_prompt: str | None = None) -> str:
    fallback_text = (
        "## AI 분석 사용 불가\n"
        "- OpenAI API 요청이 실패하여 자동 요약을 생성하지 못했습니다.\n"
        "- 수집된 메시지 통계를 기반으로 HTML 리포트는 계속 생성되었습니다.\n\n"
        "## 확인 필요\n"
        "- API quota, billing, model 설정을 확인하세요.\n"
        "- 이번 실행에서는 AI 분석 대신 대체 문구가 사용되었습니다."
    )
    try:
        return analyze_text(config, prompt, system_prompt=system_prompt)
    except RateLimitError as exc:
        log.error("OpenAI rate limit/quota error: %s", exc)
        return fallback_text
    except (APIConnectionError, APITimeoutError, APIError) as exc:
        log.error("OpenAI API error: %s", exc)
        return fallback_text
    except Exception as exc:
        log.error("Unexpected OpenAI error: %s", exc)
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


def build_category_cards(config: dict[str, Any], category_stats: dict[str, dict[str, Any]], category_analyses: dict[str, str]) -> str:
    cards = []
    for category in get_report_categories(config):
        label = get_category_label(config, category)
        stats = category_stats.get(category, {})
        cards.append(f'''<div style="background:#fff;border:1px solid #dfe9f4;border-radius:14px;padding:16px"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><h3 style="margin:0;font-size:18px;color:#1f3f66">{html.escape(label)}</h3><span style="background:#edf4fb;color:#24486f;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:700">{stats.get("total",0)} msgs</span></div><div style="margin-top:10px;font-size:13px;line-height:1.6;color:#42576b"><div><strong>주요 채널:</strong> {html.escape(', '.join(f'{n}({c})' for n,c in stats.get('top_channels', [])) or '없음')}</div><div><strong>주요 작성자:</strong> {html.escape(', '.join(f'{n}({c})' for n,c in stats.get('top_users', [])) or '없음')}</div><div><strong>주요 키워드:</strong> {html.escape(', '.join(stats.get('keywords', [])) or '없음')}</div></div><div style="margin-top:12px;padding-top:12px;border-top:1px solid #eef3f8;font-size:14px;color:#2d3b4d">{markdown_to_html(category_analyses.get(category, '분석 결과가 없습니다.'))}</div></div>''')
    return "".join(cards)


def build_daily_html(config: dict[str, Any], report_date: str, window_label: str, stats: dict[str, Any], analysis_text: str, previous_stats: dict[str, Any] | None, category_stats: dict[str, dict[str, Any]], category_analyses: dict[str, str]) -> str:
    delta = "N/A" if not previous_stats else f"{stats['total'] - previous_stats.get('total', 0):+}"
    top_users_html = "".join(f"<li style='margin:4px 0'>{html.escape(user)} ({count})</li>" for user, count in stats.get("top_users", [])) or "<li>없음</li>"
    keyword_html = ", ".join(html.escape(k) for k in stats.get("keywords", [])) or "없음"
    report_categories = get_report_categories(config)
    categories_html = "".join(
        f"<tr><td style='padding:8px 10px;border-bottom:1px solid #eef2f7'>{html.escape(get_category_label(config, cat))}</td><td style='padding:8px 10px;border-bottom:1px solid #eef2f7;text-align:right'>{stats.get('category_counts', {}).get(cat, 0)}</td></tr>"
        for cat in report_categories
    )
    banner = build_summary_banner(
        f"{config['report']['game_title']} Discord 일간 리포트",
        f"기준일: {report_date} | 구간: {window_label}",
        [("메시지 수", str(stats["total"])), ("증감", delta), ("키워드 수", str(len(stats.get("keywords", []))))],
    )
    return f"<!DOCTYPE html><html lang='ko'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Discord 일간 리포트</title></head><body style='margin:0;padding:24px;background:#eef3f8;font-family:Malgun Gothic,Arial,sans-serif;color:#243648'><div style='max-width:980px;margin:0 auto;background:#fff;border:1px solid #d8e3ef;border-radius:16px;overflow:hidden'>{banner}<div style='padding:22px 26px'><div style='display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start'><div style='background:#f8fbff;border:1px solid #e1ecf8;border-radius:12px;padding:16px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>카테고리 통계</h2><table style='width:100%;border-collapse:collapse;font-size:14px'>{categories_html}</table></div><div style='background:#f8fbff;border:1px solid #e1ecf8;border-radius:12px;padding:16px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>주요 작성자</h2><ul style='margin:0 0 12px 18px;padding:0'>{top_users_html}</ul><div style='font-size:14px;line-height:1.6'><strong>주요 키워드</strong> {keyword_html}</div></div></div><div style='margin-top:18px;background:#fff;border:1px solid #e6edf5;border-radius:12px;padding:18px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>AI 요약</h2><div style='font-size:14px;color:#2d3b4d'>{markdown_to_html(analysis_text)}</div></div><div style='margin-top:18px'><h2 style='margin:0 0 12px;font-size:20px;color:#1f3f66'>카테고리별 분석</h2><div style='display:grid;grid-template-columns:1fr 1fr;gap:16px'>{build_category_cards(config, category_stats, category_analyses)}</div></div></div></div></body></html>"


def build_weekly_html(config: dict[str, Any], week_label: str, total_messages: int, included_dates: list[str], analysis_text: str) -> str:
    banner = build_summary_banner(
        f"{config['report']['game_title']} Discord 주간 리포트",
        f"범위: {week_label}",
        [("일수", str(len(included_dates))), ("메시지 수", str(total_messages)), ("마감일", included_dates[-1] if included_dates else "N/A")],
    )
    dates_html = "".join(f"<li style='margin:4px 0'>{html.escape(date)}</li>" for date in included_dates) or "<li>없음</li>"
    return f"<!DOCTYPE html><html lang='ko'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Discord 주간 리포트</title></head><body style='margin:0;padding:24px;background:#eef3f8;font-family:Malgun Gothic,Arial,sans-serif;color:#243648'><div style='max-width:860px;margin:0 auto;background:#fff;border:1px solid #d8e3ef;border-radius:16px;overflow:hidden'>{banner}<div style='padding:22px 26px'><div style='display:grid;grid-template-columns:260px 1fr;gap:18px;align-items:start'><div style='background:#f8fbff;border:1px solid #e1ecf8;border-radius:12px;padding:16px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>포함 일자</h2><ul style='margin:0 0 0 18px;padding:0'>{dates_html}</ul></div><div style='background:#fff;border:1px solid #e6edf5;border-radius:12px;padding:18px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>AI 요약</h2><div style='font-size:14px;color:#2d3b4d'>{markdown_to_html(analysis_text)}</div></div></div></div></div></body></html>"


def build_facebook_page_cards(page_stats: dict[str, dict[str, Any]], page_analyses: dict[str, str]) -> str:
    cards = []
    for page_name, stats in page_stats.items():
        top_posts_html = "".join(
            f"<li style='margin:4px 0'>{html.escape(post['title'])} ({post['comment_count']})</li>"
            for post in stats.get("top_posts", [])
        ) or "<li>없음</li>"
        cards.append(
            f"""<div style="background:#fff;border:1px solid #dfe9f4;border-radius:14px;padding:16px">
<div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
<h3 style="margin:0;font-size:18px;color:#1f3f66">{html.escape(page_name)}</h3>
<span style="background:#edf4fb;color:#24486f;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:700">posts {stats.get('posts', 0)} / comments {stats.get('comments', 0)}</span>
</div>
<div style="margin-top:10px;font-size:13px;line-height:1.6;color:#42576b">
<div><strong>주요 댓글 작성자:</strong> {html.escape(', '.join(f'{n}({c})' for n, c in stats.get('top_commenters', [])) or '없음')}</div>
<div><strong>주요 키워드:</strong> {html.escape(', '.join(stats.get('keywords', [])) or '없음')}</div>
<div style="margin-top:8px"><strong>댓글 많은 게시글</strong><ul style="margin:6px 0 0 18px;padding:0">{top_posts_html}</ul></div>
</div>
<div style="margin-top:12px;padding-top:12px;border-top:1px solid #eef3f8;font-size:14px;color:#2d3b4d">{markdown_to_html(page_analyses.get(page_name, '분석 결과가 없습니다.'))}</div>
</div>"""
        )
    return "".join(cards)


def build_facebook_daily_html(
    config: dict[str, Any],
    report_date: str,
    window_label: str,
    stats: dict[str, Any],
    analysis_text: str,
    page_stats: dict[str, dict[str, Any]],
    page_analyses: dict[str, str],
) -> str:
    top_commenters_html = "".join(
        f"<li style='margin:4px 0'>{html.escape(name)} ({count})</li>"
        for name, count in stats.get("top_commenters", [])
    ) or "<li>없음</li>"
    top_posts_rows = "".join(
        f"<tr><td style='padding:8px 10px;border-bottom:1px solid #eef2f7'>{html.escape(item['page_name'])}</td><td style='padding:8px 10px;border-bottom:1px solid #eef2f7'>{html.escape(item['title'])}</td><td style='padding:8px 10px;border-bottom:1px solid #eef2f7;text-align:right'>{item['comment_count']}</td></tr>"
        for item in stats.get("top_posts", [])
    ) or "<tr><td colspan='3' style='padding:8px 10px'>없음</td></tr>"
    page_rows = "".join(
        f"<tr><td style='padding:8px 10px;border-bottom:1px solid #eef2f7'>{html.escape(page_name)}</td><td style='padding:8px 10px;border-bottom:1px solid #eef2f7;text-align:right'>{stats.get('page_post_counts', {}).get(page_name, 0)}</td><td style='padding:8px 10px;border-bottom:1px solid #eef2f7;text-align:right'>{stats.get('page_comment_counts', {}).get(page_name, 0)}</td></tr>"
        for page_name in page_stats
    ) or "<tr><td colspan='3' style='padding:8px 10px'>없음</td></tr>"
    keywords = ", ".join(html.escape(word) for word in stats.get("keywords", [])) or "없음"
    banner = build_summary_banner(
        f"{config['report']['game_title']} Facebook 일간 리포트",
        f"기준일: {report_date} | 구간: {window_label}",
        [
            ("게시글", str(stats.get("total_posts", 0))),
            ("댓글", str(stats.get("total_comments", 0))),
            ("페이지", str(len(page_stats))),
        ],
    )
    return f"<!DOCTYPE html><html lang='ko'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Facebook 일간 리포트</title></head><body style='margin:0;padding:24px;background:#eef3f8;font-family:Malgun Gothic,Arial,sans-serif;color:#243648'><div style='max-width:980px;margin:0 auto;background:#fff;border:1px solid #d8e3ef;border-radius:16px;overflow:hidden'>{banner}<div style='padding:22px 26px'><div style='display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start'><div style='background:#f8fbff;border:1px solid #e1ecf8;border-radius:12px;padding:16px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>페이지별 통계</h2><table style='width:100%;border-collapse:collapse;font-size:14px'><tr><th style='padding:8px 10px;border-bottom:1px solid #d9e6f4;text-align:left'>페이지</th><th style='padding:8px 10px;border-bottom:1px solid #d9e6f4;text-align:right'>게시글</th><th style='padding:8px 10px;border-bottom:1px solid #d9e6f4;text-align:right'>댓글</th></tr>{page_rows}</table></div><div style='background:#f8fbff;border:1px solid #e1ecf8;border-radius:12px;padding:16px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>댓글 작성자 / 키워드</h2><ul style='margin:0 0 12px 18px;padding:0'>{top_commenters_html}</ul><div style='font-size:14px;line-height:1.6'><strong>주요 키워드</strong> {keywords}</div></div></div><div style='margin-top:18px;background:#fff;border:1px solid #e6edf5;border-radius:12px;padding:18px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>AI 요약</h2><div style='font-size:14px;color:#2d3b4d'>{markdown_to_html(analysis_text)}</div></div><div style='margin-top:18px;background:#fff;border:1px solid #e6edf5;border-radius:12px;padding:18px'><h2 style='margin:0 0 10px;font-size:18px;color:#1f3f66'>댓글 많은 게시글</h2><table style='width:100%;border-collapse:collapse;font-size:14px'><tr><th style='padding:8px 10px;border-bottom:1px solid #d9e6f4;text-align:left'>페이지</th><th style='padding:8px 10px;border-bottom:1px solid #d9e6f4;text-align:left'>게시글</th><th style='padding:8px 10px;border-bottom:1px solid #d9e6f4;text-align:right'>댓글 수</th></tr>{top_posts_rows}</table></div><div style='margin-top:18px'><h2 style='margin:0 0 12px;font-size:20px;color:#1f3f66'>페이지별 분석</h2><div style='display:grid;grid-template-columns:1fr 1fr;gap:16px'>{build_facebook_page_cards(page_stats, page_analyses)}</div></div></div></div></body></html>"


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


def get_previous_facebook_daily_stats(state: dict[str, Any], report_date: str) -> dict[str, Any] | None:
    prev_date = (datetime.fromisoformat(report_date) - timedelta(days=1)).date().isoformat()
    entry = state.get("facebook_daily_reports", {}).get(prev_date)
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


def build_facebook_daily_subject(config: dict[str, Any], report_date: str) -> str:
    prefix = config["email"].get("subject_prefix", "[Blackshot] Community Report")
    return f"{prefix} [Facebook 일간] {report_date}"


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
    report_categories = get_report_categories(config)

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
            category_stats = build_category_stats(window_messages, report_categories)
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
                category_stats = build_category_stats([], report_categories)
                category_analyses = {
                    k: "## 카테고리 요약\n- 분위기: 신규 메시지 없음\n- 핵심 해석: 선택한 구간에서 이 카테고리에 수집된 메시지가 없습니다."
                    for k in report_categories
                }
                analysis_text = "## 일간 요약\n- 전체 분위기: 신규 메시지 없음\n- 핵심 해석: 선택한 구간에서 수집된 메시지가 없습니다."
                existing_message_ids = set()

        daily_html = build_daily_html(config, report_date, window_label, stats, analysis_text, previous_stats, category_stats, category_analyses)
        daily_report_path = DAILY_DIR / f"report_{report_date.replace('-', '')}.html"
        if config["report"].get("save_html", True):
            write_report_html(daily_report_path, daily_html)
        send_daily = bool(config["report"].get("daily_send_enabled", True)) and (args.force_send_daily or not daily_already_sent)
        if send_daily:
            send_email(config, build_daily_subject(config, report_date), daily_html)
        elif not bool(config["report"].get("daily_send_enabled", True)):
            log.info("일간 메일 발송을 건너뜁니다. 설정에서 daily_send_enabled=false 입니다.")
        elif daily_already_sent and not args.force_send_daily:
            log.info("일간 메일 발송을 건너뜁니다. 기준일 %s 은 이미 sent=true 상태입니다.", report_date)
        else:
            log.info("일간 메일 발송을 건너뜁니다. 강제 발송 조건을 만족하지 않습니다.")
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

    if config.get("facebook", {}).get("enabled"):
        facebook_daily_entry = state.get("facebook_daily_reports", {}).get(report_date)
        facebook_daily_already_sent = False if args.rebuild_daily else bool(facebook_daily_entry and facebook_daily_entry.get("sent"))
        facebook_pages, facebook_errors = collect_facebook_data(config, after_dt, before_dt)
        if facebook_errors:
            failed_entry = dict(facebook_daily_entry or {})
            failed_entry.update({
                "date": report_date,
                "window_mode": window["window_mode"],
                "window_label": window_label,
                "last_run_at": now_local.isoformat(),
                "last_error": "; ".join(facebook_errors),
                "last_error_at": now_local.isoformat(),
            })
            failed_entry.setdefault("sent", False)
            state.setdefault("facebook_daily_reports", {})[report_date] = failed_entry
            save_state(state)
            log.warning("Facebook 일간 리포트를 건너뜁니다. 수집 실패: %s", failed_entry["last_error"])
        else:
            facebook_stats = build_facebook_stats(facebook_pages)
            facebook_page_stats = build_facebook_page_stats(facebook_pages)
            current_facebook_item_ids = facebook_item_ids(facebook_pages)
            previous_facebook_item_ids = [
                str(item_id)
                for item_id in (facebook_daily_entry or {}).get("item_ids", [])
            ]
            existing_page_analyses = (facebook_daily_entry or {}).get("page_analyses", {})
            reuse_existing_facebook_analysis = (
                not args.rebuild_daily
                and facebook_daily_entry is not None
                and current_facebook_item_ids == previous_facebook_item_ids
                and bool((facebook_daily_entry or {}).get("analysis_text"))
                and set(facebook_page_stats.keys()).issubset(set(existing_page_analyses.keys()))
            )

            if reuse_existing_facebook_analysis:
                facebook_analysis = facebook_daily_entry.get("analysis_text", "")
                facebook_page_analyses = existing_page_analyses
            elif facebook_stats.get("total_items", 0) > 0:
                facebook_analysis = safe_analyze_text(
                    config,
                    build_facebook_daily_prompt(
                        config,
                        report_date,
                        window_label,
                        facebook_stats,
                        facebook_page_stats,
                        facebook_pages,
                    ),
                    system_prompt=facebook_analysis_system_prompt(),
                )
                facebook_page_analyses = {}
                for page_data in facebook_pages:
                    page_name = page_data["page_name"]
                    page_posts = page_data.get("posts", [])
                    page_comments = page_data.get("comments", [])
                    if page_posts or page_comments:
                        facebook_page_analyses[page_name] = safe_analyze_text(
                            config,
                            build_facebook_page_prompt(
                                config,
                                page_name,
                                facebook_page_stats.get(page_name, {}),
                                page_posts,
                                page_comments,
                                report_date,
                                window_label,
                            ),
                            system_prompt=facebook_analysis_system_prompt(),
                        )
                    else:
                        facebook_page_analyses[page_name] = "## 페이지 요약\n- 분위기: 신규 활동 없음\n- 핵심 해석: 선택한 구간에서 수집된 게시글/댓글이 없습니다."
            else:
                facebook_analysis = "## 일간 요약\n- 전체 분위기: 신규 활동 없음\n- 핵심 해석: 선택한 구간에서 수집된 Facebook 게시글/댓글이 없습니다."
                facebook_page_analyses = {
                    page_data["page_name"]: "## 페이지 요약\n- 분위기: 신규 활동 없음\n- 핵심 해석: 선택한 구간에서 이 페이지에 수집된 게시글/댓글이 없습니다."
                    for page_data in facebook_pages
                }

            facebook_daily_html = build_facebook_daily_html(
                config,
                report_date,
                window_label,
                facebook_stats,
                facebook_analysis,
                facebook_page_stats,
                facebook_page_analyses,
            )
            facebook_daily_path = FACEBOOK_DAILY_DIR / f"report_{report_date.replace('-', '')}.html"
            if config["report"].get("save_html", True):
                write_report_html(facebook_daily_path, facebook_daily_html)
            send_facebook_daily = (
                bool(config["report"].get("daily_send_enabled", True))
                and bool(config["facebook"].get("send_daily_email", True))
                and (args.force_send_daily or not facebook_daily_already_sent)
            )
            if send_facebook_daily:
                send_email(config, build_facebook_daily_subject(config, report_date), facebook_daily_html)
            elif not bool(config["report"].get("daily_send_enabled", True)):
                log.info("Facebook 일간 메일 발송을 건너뜁니다. 설정에서 daily_send_enabled=false 입니다.")
            elif not bool(config["facebook"].get("send_daily_email", True)):
                log.info("Facebook 일간 메일 발송을 건너뜁니다. 설정에서 facebook.send_daily_email=false 입니다.")
            elif facebook_daily_already_sent and not args.force_send_daily:
                log.info("Facebook 일간 메일 발송을 건너뜁니다. 이미 sent=true 상태라 HTML/state만 최신화합니다.")
            else:
                log.info("Facebook 일간 메일 발송을 건너뜁니다. 강제 발송 조건을 만족하지 않습니다.")

            facebook_entry = {
                "date": report_date,
                "window_mode": window["window_mode"],
                "window_label": window_label,
                "stats": facebook_stats,
                "page_stats": facebook_page_stats,
                "page_analyses": facebook_page_analyses,
                "analysis_text": facebook_analysis,
                "html_path": str(facebook_daily_path),
                "sent": facebook_daily_already_sent or send_facebook_daily,
                "last_run_at": now_local.isoformat(),
                "item_ids": current_facebook_item_ids,
            }
            state.setdefault("facebook_daily_reports", {})[report_date] = facebook_entry
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
