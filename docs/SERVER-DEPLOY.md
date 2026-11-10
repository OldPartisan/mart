# Production на сервере ИТ

## Состав

- `docker-compose.prod.yml` — PostgreSQL, Next.js, Caddy;
- `Caddyfile` — TLS и reverse proxy;
- `.env.production.example` — шаблон секретов;
- `scripts/backup.sh` — ежедневный `pg_dump`.

## Запуск

```bash
cp .env.production.example .env.production
# заполнить секреты
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Проверка:

```bash
curl -f https://mart.example.ru/api/health
docker compose -f docker-compose.prod.yml logs -f app
```

## Что нужно от ИТ

- Linux VM: 4 vCPU / 8 ГБ RAM / 100 ГБ SSD;
- внешний IP, DNS, открытые 80/443;
- SSH/VPN;
- SMTP-relay;
- S3/MinIO или бакет для медиа;
- доступ к тестовой 1С по приватной сети;
- бэкапы и мониторинг.

## Бэкапы

Cron:

```cron
15 3 * * * cd /srv/irbis && ./scripts/backup.sh >> /var/log/irbis-backup.log 2>&1
```

Раз в месяц проверять восстановление на отдельной БД.

## Медиа

Сейчас изображения лежат в `public/images`. Для production с загрузками нужен S3/MinIO/R2: контейнер не должен хранить пользовательские файлы.
