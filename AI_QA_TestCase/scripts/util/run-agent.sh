#!/usr/bin/env bash
set -euo pipefail

declare -a CLAUDE_CMD=()

resolve_claude() {
  if command -v claude >/dev/null 2>&1; then
    CLAUDE_CMD=(claude)
    return 0
  fi
  if [ -n "${CLI_JS:-}" ] && [ -f "${CLI_JS}" ]; then
    CLAUDE_CMD=(node "$CLI_JS")
    return 0
  fi
  if command -v npm >/dev/null 2>&1; then
    local npm_root
    npm_root="$(npm root -g 2>/dev/null || true)"
    if [ -n "$npm_root" ] && [ -f "$npm_root/@anthropic-ai/claude-code/cli.js" ]; then
      CLAUDE_CMD=(node "$npm_root/@anthropic-ai/claude-code/cli.js")
      return 0
    fi
  fi
  return 1
}

extract_agent_body() {
  local file="$1"
  awk '
    BEGIN { frontmatter = 0; body = 0 }
    NR == 1 && $0 == "---" { frontmatter = 1; next }
    frontmatter == 1 && $0 == "---" { frontmatter = 0; body = 1; next }
    body == 1 { print }
    frontmatter == 0 && body == 0 { print }
  ' "$file"
}

resolve_agent_file() {
  local agent_name="$1"
  local candidates=()
  if [ -f "$agent_name" ]; then
    printf '%s' "$agent_name"
    return 0
  fi
  candidates+=("${CLAUDE_HOME:-$HOME/.claude}/agents/${agent_name}.md")
  candidates+=("$HOME/.claude/agents/${agent_name}.md")
  candidates+=("$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/agents/${agent_name}.md")

  local candidate
  for candidate in "${candidates[@]}"; do
    if [ -f "$candidate" ]; then
      printf '%s' "$candidate"
      return 0
    fi
  done
  return 1
}

agent_name=""
declare -a passthrough=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    --agent)
      shift
      [ "$#" -gt 0 ] || { echo "--agent requires a value" >&2; exit 1; }
      agent_name="$1"
      ;;
    *)
      passthrough+=("$1")
      ;;
  esac
  shift || true
done

resolve_claude || {
  echo "claude CLI를 찾을 수 없습니다. PATH 또는 CLI_JS를 확인하세요." >&2
  exit 127
}

if [ -z "$agent_name" ]; then
  "${CLAUDE_CMD[@]}" "${passthrough[@]}"
  exit $?
fi

agent_file="$(resolve_agent_file "$agent_name")" || {
  echo "에이전트 파일을 찾을 수 없습니다: $agent_name" >&2
  exit 1
}

last_idx=$(( ${#passthrough[@]} - 1 ))
if [ "$last_idx" -lt 0 ]; then
  echo "프롬프트 인수가 필요합니다." >&2
  exit 1
fi

original_prompt="${passthrough[$last_idx]}"
agent_body="$(extract_agent_body "$agent_file")"
composed_prompt=$'[AGENT SYSTEM PROMPT]\n'"$agent_body"$'\n\n[HANDOFF PROMPT]\n'"$original_prompt"
passthrough[$last_idx]="$composed_prompt"

"${CLAUDE_CMD[@]}" "${passthrough[@]}"
