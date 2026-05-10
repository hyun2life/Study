#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
PREFLIGHT="$REPO_ROOT/scripts/preflight/preflight.sh"

if [ ! -f "$PREFLIGHT" ]; then
  echo "[ERROR] preflight.sh를 찾을 수 없습니다: $PREFLIGHT" >&2
  exit 1
fi

echo ""
echo "========================================"
echo "  Game QA Testcase - Setup"
echo "========================================"
echo ""
echo "setup.sh는 이제 preflight를 호출합니다."
echo "Node/npm 확인, .env 생성, npm install, Claude asset 설치를 순서대로 수행합니다."
echo ""

bash "$PREFLIGHT"
