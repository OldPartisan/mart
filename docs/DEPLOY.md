# Деплой

## 0. Варианты

| Вариант | Что получаете | Когда использовать |
|---|---|---|
| **Vercel + Neon/Supabase** | Полный сайт: API, БД, авторизация, оплата, админка | Продакшен |
| **Docker + PostgreSQL** | То же на своём сервере/VPS | Свой контур, 152-ФЗ, контроль данных |
| **GitHub Pages** | Статическая витрина + корзина + демо-заказ | Публичная демо-ссылка, портфолио |

Текущая демо-витрина: <https://oldpartisan.github.io/mart/>

---

## 1. Vercel + Neon (рекомендуется)

### 1.1 База

1. Создайте проект в [Neon](https://neon.tech) или [Supabase](https://supabase.com).
2. Скопируйте строку подключения с `sslmode=require`.
3. Локально проверьте: `psql "$DATABASE_URL" -c "select 1"`.

### 1.2 Проект

```bash
pnpm i -g vercel
vercel link
vercel env add DATABASE_URL production
vercel env add AUTH_SECRET production
vercel env add NEXT_PUBLIC_SITE_URL production
# остальные переменные из .env.example
vercel --prod
```

Или импортируйте репозиторий в Vercel Dashboard:
- Framework: Next.js
- Build: `pnpm build`
- Install: `pnpm install --frozen-lockfile`
- Node: 22

При первом запросе приложение применит миграции и загрузит сиды, если каталог пуст. Для контролируемой миграции:

```bash
DATABASE_URL="..." pnpm exec drizzle-kit migrate
```

### 1.3 Обязательные переменные

| Переменная | Пример | Комментарий |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` | Neon/Supabase, SSL |
| `AUTH_SECRET` | `openssl rand -base64 48` | ≥ 32 символа, уникальный |
| `NEXT_PUBLIC_SITE_URL` | `https://mart.irbis.ru` | canonical, sitemap, возврат ЮKassa |
| `NEXT_PUBLIC_SHOP_PHONE` | `+7 (843) 200-00-00` | отображается на сайте |
| `YOOKASSA_SHOP_ID` / `YOOKASSA_SECRET_KEY` | — | без них работает демо-касса |
| `NEXT_PUBLIC_YM_ID` / `NEXT_PUBLIC_GA_ID` | — | аналитика |
| `SMTP_*` | — | письма; без них письма в лог |
| `SMSRU_API_ID` | — | SMS; без него в лог |
| `CRON_SECRET` | random | защита cron-задач |

Секреты не коммитить. `.env.local` — локально, Vercel Environment Variables — в проде.

### 1.4 ЮKassa

1. В личном кабинете ЮKassa включите приём платежей и получите `shopId` и секретный ключ.
2. URL вебхука: `https://<домен>/api/payments/webhook`, события `payment.succeeded`, `payment.canceled`.
3. Укажите `YOOKASSA_RETURN_URL=https://<домен>/checkout/success`.
4. Проверьте тестовый платёж картой `5555 5555 5555 4477` (тестовый магазин).
5. Вебхук перепроверяет платёж через API, поэтому подделка тела не проходит. Обработка идемпотентна.

### 1.5 Домен и SSL

- Добавьте домен в Vercel → Domains, пропишите CNAME/A.
- SSL выпускается автоматически.
- После смены домена обновите `NEXT_PUBLIC_SITE_URL` и `YOOKASSA_RETURN_URL`, пересоберите.

### 1.6 Проверка после деплоя

```bash
curl -I https://<домен>/
curl https://<домен>/sitemap.xml | head
curl https://<домен>/robots.txt
# регистрация → заказ → демо-оплата → бонусы в кабинете
```

---

## 2. Docker + PostgreSQL

```bash
cp .env.example .env
# задайте AUTH_SECRET и NEXT_PUBLIC_SITE_URL
docker compose up --build -d
docker compose logs -f app
```

- Приложение: <http://localhost:3000>
- PostgreSQL: `localhost:5432`, БД `irbis_mart`.
- Миграции применяются автоматически.
- Для внешнего PostgreSQL уберите сервис `db` и задайте `DATABASE_URL`.

Обновление:

```bash
git pull
docker compose build app
docker compose up -d app
```

Бэкапы:

```bash
docker compose exec db pg_dump -U irbis irbis_mart | gzip > backup-$(date +%F).sql.gz
```

---

## 3. GitHub Pages (статическая витрина)

### 3.1 Что работает

- Главная, каталог, карточки товаров, акции, доставка, лояльность, о нас, фермеры, производство, кафе, контакты, legal.
- Поиск по локальному `products.json`.
- Корзина (localStorage) и демо-оформление заказа (без отправки в магазин).
- Адаптив, SEO-метаданные, sitemap.

### 3.2 Что не работает (и почему)

GitHub Pages не исполняет серверный код. Поэтому недоступны: вход/регистрация, личный кабинет, бонусный счёт, реальная оплата, админ-панель, запись заказов в БД. Эти разделы показывают поясняющую заглушку. Полная версия — Vercel/Docker.

### 3.3 Сборка

```bash
# локально (на macOS с подписанным Node может понадобиться NODE_BIN)
NODE_BIN=node bash scripts/build-pages.sh
```

Скрипт:
1. копирует проект в `.pages-build`;
2. удаляет серверные разделы и API;
3. подставляет заглушки;
4. экспортирует каталог в `products.json`;
5. собирает `next build` с `output: export`, `basePath: /mart`;
6. кладёт результат в `.pages-build/out`.

### 3.4 Публикация

```bash
cd .pages-build/out
git init
git add -A
git commit -m "Deploy Irbis Mart static showcase"
git push --force https://github.com/OldPartisan/mart.git HEAD:gh-pages
```

В настройках репозитория: **Settings → Pages → Source: Deploy from a branch → gh-pages / (root)**.

Домен: `https://oldpartisan.github.io/mart/`. Для своего домена в корне репозитория `mart` уберите `basePath` из `.pages-build/next.config.ts` и добавьте `CNAME`.

### 3.5 Обновление демо

Повторите сборку и пуш в `gh-pages`. Основная ветка `main` хранит полный код.

---

## 4. CI

`docs/ci.yml` — шаблон CI. Скопируйте его в `.github/workflows/ci.yml` (для push файла нужен scope `workflow`) — workflow запускает на push/PR:
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

Для автодеплоя на Vercel добавьте интеграцию GitHub в Dashboard или шаг `vercel --prod` с `VERCEL_TOKEN`.

---

## 5. Откат и мониторинг

- Vercel: Deployments → предыдущий билд → Promote to Production.
- Docker: `docker compose down`, вернуть предыдущий образ/тег.
- БД: миграции только вперёд; перед релизом — `pg_dump`.
- Ошибки: подключить Sentry (`@sentry/nextjs`) или слать логи в Better Stack.
- Аптайм: Better Stack/UptimeRobot на `/` и `/api/products`.
- Аналитика: проверить события `purchase` и `add_to_cart` в GA4 DebugView и Метрике.

---

## 6. Чек-лист продакшена

- [ ] `AUTH_SECRET` заменён, демо-пароли отключены/удалены.
- [ ] `DATABASE_URL` с SSL, бэкапы ежедневно.
- [ ] ЮKassa боевые ключи, вебхук отвечает 200.
- [ ] SMTP и SMS настроены, письма не в спаме (SPF/DKIM/DMARC).
- [ ] Реальные фото и юридические документы.
- [ ] Телефон, адрес, реквизиты, часы работы.
- [ ] `NEXT_PUBLIC_SITE_URL`, canonical, sitemap, robots.
- [ ] Яндекс.Метрика и GA4, цели проверены.
- [ ] Rate limit вынесен в Redis при нескольких инстансах.
- [ ] Lighthouse ≥ 90/90/95, LCP < 2,5 с.
- [ ] Резервный сценарий при недоступности ЮKassa (оплата при получении).
