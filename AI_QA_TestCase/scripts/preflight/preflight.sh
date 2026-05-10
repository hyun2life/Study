#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_PATH="$REPO_ROOT/.env"
CRED_PATH="$REPO_ROOT/credentials/client_secret.json"

echo "[preflight] repo: $REPO_ROOT"

command -v node >/dev/null 2>&1 || { echo "[ERROR] Node.js를 찾을 수 없습니다." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "[ERROR] npm을 찾을 수 없습니다." >&2; exit 1; }

if ! command -v claude >/dev/null 2>&1; then
  echo "[WARN] claude CLI를 찾지 못했습니다. 설치 후 다시 실행하세요." >&2
fi

if [ ! -f "$ENV_PATH" ]; then
  cp "$REPO_ROOT/.env.example" "$ENV_PATH"
  echo "[INFO] .env를 생성했습니다. 실제 값을 채운 뒤 preflight를 다시 실행하세요." >&2
  exit 0
fi

(
  cd "$REPO_ROOT"
  npm install
  if [ ! -f "$CRED_PATH" ]; then
    echo "[WARN] credentials/client_secret.json 이 없습니다. Google OAuth 인증 전까지 Sheets/Drive 기능은 실행되지 않습니다." >&2
  fi
  node install.mjs
)

echo "[preflight] 완료"
