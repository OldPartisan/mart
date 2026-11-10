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

## S3 и cron

Добавьте в `.env.production`:

```env
S3_REGION=ru-central1
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_URL=
CRON_SECRET=
```

Без S3 раздел `/admin/media` работает в режиме URL, загрузка отключена.

На сервере cron:

```cron
*/5 * * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://mart.example.ru/api/cron/publish
```
