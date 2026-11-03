#!/usr/bin/env bash
set -euo pipefail
PORT="${PORT:-3000}"
echo "Публичный URL появится в выводе ниже. Пока туннель запущен, компьютер должен быть включён."
echo "Остановить: Ctrl+C. Админка с демо-паролем доступна публично — не оставляйте туннель без присмотра."
exec ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:localhost:"$PORT" nokey@localhost.run
