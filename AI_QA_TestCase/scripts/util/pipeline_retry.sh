#!/usr/bin/env bash
set -u

if [ "$#" -lt 3 ]; then
  echo "usage: pipeline_retry.sh <stderr_log> -- <command ...>" >&2
  exit 1
fi

BASE_LOG="$1"
shift

if [ "$1" != "--" ]; then
  echo "expected -- separator" >&2
  exit 1
fi
shift

CMD=( "$@" )

quota_re='429|503|RESOURCE_EXHAUSTED|Quota exceeded|rateLimitExceeded|userRateLimitExceeded'
auth_re='invalid_grant|token expired|UNAUTHENTICATED|invalid_token|401 Unauthorized|Please run /login|authentication_error'
network_re='ETIMEDOUT|ECONNRESET|502|500|network'
mcp_re='MCP error|getConfluencePage failed'

log_for_attempt() {
  local idx="$1"
  if [ "$idx" -eq 1 ]; then
    printf '%s' "$BASE_LOG"
  else
    local suffix="_retry"
    if [ "$idx" -gt 2 ]; then
      suffix="_retry$((idx-1))"
    fi
    if [[ "$BASE_LOG" == *.log ]]; then
      printf '%s%s.log' "${BASE_LOG%.log}" "$suffix"
    else
      printf '%s%s' "$BASE_LOG" "$suffix"
    fi
  fi
}

max_attempts=4
attempt=1

while [ "$attempt" -le "$max_attempts" ]; do
  current_log="$(log_for_attempt "$attempt")"
  "${CMD[@]}" 2>"$current_log"
  rc=$?
  if [ "$rc" -eq 0 ]; then
    exit 0
  fi

  cat "$current_log" >&2

  if grep -Eiq "$auth_re" "$current_log"; then
    exit 10
  fi

  if grep -Eiq "$quota_re" "$current_log"; then
    if [ "$attempt" -ge "$max_attempts" ]; then
      exit 11
    fi
    case "$attempt" in
      1) sleep 30 ;;
      2) sleep 60 ;;
      *) sleep 120 ;;
    esac
    attempt=$((attempt + 1))
    continue
  fi

  if grep -Eiq "$network_re" "$current_log"; then
    if [ "$attempt" -ge 3 ]; then
      exit "$rc"
    fi
    [ "$attempt" -eq 1 ] && sleep 10 || sleep 30
    attempt=$((attempt + 1))
    continue
  fi

  if grep -Eiq "$mcp_re" "$current_log"; then
    if [ "$attempt" -ge 2 ]; then
      exit "$rc"
    fi
    sleep 15
    attempt=$((attempt + 1))
    continue
  fi

  if [ "$attempt" -ge 2 ]; then
    exit "$rc"
  fi
  attempt=$((attempt + 1))
done

exit 1
