#!/usr/bin/env bash
set -euo pipefail
# Запускать из каталога проекта на сервере.
BACKUP_DIR="${BACKUP_DIR:-./backups}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$BACKUP_DIR"
docker compose -f docker-compose.prod.yml exec -T db pg_dump -U "${POSTGRES_USER:-irbis}" "${POSTGRES_DB:-irbis_mart}" | gzip > "$BACKUP_DIR/irbis-$STAMP.sql.gz"
find "$BACKUP_DIR" -type f -name 'irbis-*.sql.gz' -mtime +30 -delete
echo "backup: $BACKUP_DIR/irbis-$STAMP.sql.gz"
