#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE_HOME="${IRBIS_NODE_HOME:-$HOME/.irbis-mart/runtime/node22}"

if [ -x "$NODE_HOME/bin/node" ]; then
  export PATH="$NODE_HOME/bin:$PATH"
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm не найден. Установите Node 22 LTS и pnpm 11 (см. README)." >&2
  exit 1
fi

if [ ! -f "$ROOT/.env.local" ]; then
  echo "Нет .env.local. Скопируйте .env.example в .env.local и задайте AUTH_SECRET." >&2
  exit 1
fi

cd "$ROOT"
exec pnpm dev --port "${PORT:-3000}"
