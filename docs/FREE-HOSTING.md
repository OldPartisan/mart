# Бесплатный внешний тестовый сервер

## Вариант 0 — быстрый публичный URL (уже работает)

Бесплатный SSH-туннель к локальному серверу, без регистрации:

```bash
./scripts/tunnel.sh          # localhost:3000 → https://<random>.lhr.life
```

Требования: локальный `pnpm dev` запущен, компьютер включён, есть интернет.
Ограничения:

- URL меняется после перезапуска;
- скорость и стабильность зависят от домашнего интернета;
- **админка с демо-паролем доступна публично** — не публикуйте ссылку надолго;
- HTTPS обеспечивает туннель, но это не production-хостинг.

Остановить: `Ctrl+C` или `pkill -f localhost.run`.

Если снаружи отдаёт **502**, а `http://localhost:3000` работает — SSH-сессия туннеля зависла, это не падение сайта. Перезапуск:

```bash
pkill -f localhost.run
./scripts/tunnel.sh
```

URL после перезапуска будет новый.

## Вариант 1 — Vercel Hobby + Neon (постоянный, бесплатно)

Это оптимальный бесплатный вариант для полноценного Next.js-приложения с БД.

### 1. База Neon

1. Зарегистрируйтесь на <https://neon.tech> через GitHub.
2. **Create project** → регион ближе к аудитории (Frankfurt/eu-central-1).
3. Скопируйте **pooled** connection string:
   `postgresql://user:pass@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`
4. Бесплатный план Neon: 0.5 GB storage, автосон compute — для теста достаточно.

### 2. Vercel

Быстрый старт: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOldPartisan%2Fmart&env=DATABASE_URL,AUTH_SECRET,NEXT_PUBLIC_SITE_URL,SEED_ADMIN_PASSWORD,SEED_MANAGER_PASSWORD,SEED_CLIENT_PASSWORD&envDescription=Postgres%20URL%20from%20Neon%20and%20strong%20seed%20passwords)

Кнопка создаст проект в вашем аккаунте Vercel и попросит переменные. Либо вручную:

1. <https://vercel.com> → **Add New Project** → импортируйте `OldPartisan/mart`.
2. Framework: **Next.js**; Build: `pnpm build`; Install: `pnpm install --frozen-lockfile`.
3. Environment Variables:

| Переменная | Значение |
|---|---|
| `DATABASE_URL` | pooled-строка Neon |
| `AUTH_SECRET` | `openssl rand -base64 48` |
| `NEXT_PUBLIC_SITE_URL` | `https://<project>.vercel.app` |
| `NEXT_PUBLIC_DELIVERY_ENABLED` | `true` |
| `DEMO_PAYMENTS` | `true` для теста; `false` для боевого |
| `SEED_ADMIN_PASSWORD` | сильный пароль администратора |
| `SEED_MANAGER_PASSWORD` | сильный пароль менеджера |
| `SEED_CLIENT_PASSWORD` | пароль демо-клиента |

4. Deploy. При первом запросе приложение применит миграции и загрузит каталог.
5. Откройте `https://<project>.vercel.app/admin`, войдите с `admin@irbis-mart.ru` и `SEED_ADMIN_PASSWORD`.

> Vercel Hobby бесплатен для некоммерческих проектов. Для коммерческого магазина нужен Pro.
> PGlite на Vercel не подходит: файловая система эфемерна. Обязателен `DATABASE_URL`.

### 3. Если база уже создана со старым паролем

`SEED_*` применяется только при первом заполнении. Для смены пароля:

```sql
-- сгенерируйте bcrypt-хеш локально:
-- node -e "console.log(require('bcryptjs').hashSync('NEW_PASSWORD',10))"
UPDATE users SET password_hash = '<bcrypt-хеш>' WHERE email = 'admin@irbis-mart.ru';
```

## Вариант 2 — Render Free + Neon

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/OldPartisan/mart)

1. <https://render.com> → **New → Web Service** → подключите GitHub-репозиторий.
2. Runtime: Node; Build: `pnpm install --frozen-lockfile && pnpm build`; Start: `pnpm start`.
3. Environment: те же переменные, что для Vercel, обязательно `DATABASE_URL` (Neon).
4. План **Free**: сервис засыпает после ~15 минут без трафика, первый запрос после сна — 30–60 секунд. Для теста нормально.
5. Render не хранит локальные файлы между деплоями — PGlite не использовать, только внешний PostgreSQL.

Есть `render.yaml` — можно задеплоить Blueprint, но секреты (`DATABASE_URL`, `AUTH_SECRET`) всё равно задаются в Dashboard.

## Вариант 3 — GitHub Codespaces (временный, без хостинга)

Бесплатно ~60 часов/мес:

```bash
# в Codespaces
corepack enable
pnpm install
cp .env.example .env.local
# AUTH_SECRET, DEMO_PAYMENTS=true
pnpm dev
```

Во вкладке **Ports** сделайте порт 3000 **Public** — получите `https://<codespace>-3000.app.github.dev`.
Пока Codespace запущен — сайт доступен. Закрыли — сервер остановился.

## Вариант 4 — Cloudflare Tunnel с аккаунтом

Даёт стабильный именованный туннель и Cloudflare Access (пароль/почта):

```bash
brew install cloudflared
cloudflared tunnel login
cloudflared tunnel create irbis-mart
cloudflared tunnel route dns irbis-mart mart-test.example.com
cloudflared tunnel run --url http://localhost:3000 irbis-mart
```

В этом окружении quick tunnel не поднялся из-за сломанного DNS для `argotunnel.com`, поэтому использован `localhost.run`.

## Чек-лист перед публикацией тестового сервера

- [ ] `SEED_ADMIN_PASSWORD` / `SEED_MANAGER_PASSWORD` — не демо-пароли.
- [ ] `AUTH_SECRET` уникальный, ≥32 символа.
- [ ] `DEMO_PAYMENTS=false`, если тест не про оплату; иначе любой с URL заказа может «оплатить» его.
- [ ] `DATABASE_URL` — отдельная тестовая БД, не production.
- [ ] Не загружать реальные персональные данные и реальные ключи ЮKassa.
- [ ] После теста остановить туннель/удалить deployment.
- [ ] Проверить `/admin`: не пускает без пароля, демо-пароли заменены.
