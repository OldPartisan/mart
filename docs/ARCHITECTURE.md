# Архитектура

## 1. Компоненты

```
┌─────────────────────────────────────────────────────────────────┐
│                         Браузер / PWA                            │
│  Next.js RSC + client components: корзина (Zustand), формы,      │
│  поиск, галерея, фильтры, аналитика (dataLayer / GA4 / Метрика)  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS, httpOnly JWT cookies
┌───────────────────────────────▼─────────────────────────────────┐
│                     Next.js 15 (Node runtime)                    │
│  ┌───────────────┐  ┌────────────────┐  ┌────────────────────┐   │
│  │ (shop) RSC    │  │ /admin + server│  │ /api REST          │   │
│  │ каталог, SSR  │  │ actions        │  │ auth, orders,      │   │
│  │ SEO, metadata │  │ CRUD, статусы  │  │ promo, payments    │   │
│  └───────┬───────┘  └───────┬────────┘  └─────────┬──────────┘   │
│          └──────────────────┼─────────────────────┘              │
│                     lib/queries, lib/orders                      │
│                     Zod, jose, bcrypt, rate-limit                │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Drizzle ORM
              ┌─────────────────┴──────────────────┐
              │                                    │
      ┌───────▼────────┐                  ┌────────▼─────────┐
      │ PGlite (local) │                  │ PostgreSQL (prod)│
      │ .data/pglite   │                  │ Neon / Supabase  │
      └────────────────┘                  └──────────────────┘
              │                                    │
              └────────── same schema / SQL ───────┘
```

Внешние сервисы: ЮKassa (платежи), Яндекс.Карты (карта/маршрут), SMTP/SMS.RU (уведомления), GA4/Яндекс.Метрика (аналитика).

## 2. Поток оформления заказа

1. Клиент собирает корзину в `localStorage` (`irbis-cart-v1`).
2. `POST /api/orders` с `items[{productId, quantity}]` — **цены не принимаются с клиента**.
3. Сервер:
   - загружает товары, проверяет активность и остатки;
   - пересчитывает `subtotal`, применяет промокод и лимит бонусов (≤ 50%);
   - считает доставку по зоне;
   - в транзакции создаёт заказ и позиции, уменьшает остатки, увеличивает счётчик промокода, списывает бонусы;
   - для онлайн-оплаты создаёт платёж ЮKassa (или демо-платёж).
4. После оплаты (`payment.succeeded` / демо-кнопка):
   - `markOrderPaid` идемпотентно меняет статус;
   - начисляет бонусы с учётом уровня и срока 365 дней;
   - отправляет email/SMS (в демо — в лог).
5. Отмена: возврат остатков, бонусов и сторно начислений.

## 3. Схема БД

13 таблиц, PostgreSQL-типы, UUID PK, `timestamptz`.

| Таблица | Ключевые поля | Связи |
|---|---|---|
| `users` | email UQ, password_hash, name, phone, role, bonus_balance, referral_code UQ, referred_by, is_blocked | 1→N orders, addresses, bonus_transactions |
| `addresses` | user_id, city, street, house, apartment, entrance, floor, is_default | N→1 users |
| `categories` | name, slug UQ, parent_id, image, sort_order, is_active | 1→N products |
| `products` | name, slug UQ, description, composition, storage_info, producer, price, old_price, images jsonb, category_id, is_own_production, is_farm, is_new, is_hit, unit, weight, stock, popularity, is_active | N→1 categories |
| `orders` | number UQ, user_id, customer_name, phone, email, status, subtotal, discount, bonus_used, delivery_fee, total, delivery_type, delivery_zone, address_text, pickup_date, pickup_slot, payment_method, payment_status, payment_id, promo_code, comment, paid_at | N→1 users; 1→N order_items |
| `order_items` | order_id, product_id, name, slug, image, price, quantity, line_total | N→1 orders/products |
| `promo_codes` | code UQ, discount_type, discount_value, min_order_amount, valid_until, usage_limit, used_count, is_active | — |
| `bonus_transactions` | user_id, amount, type (ACCRUAL/SPEND/WELCOME/REFERRAL/REFUND/EXPIRE), order_id, description, expires_at | N→1 users/orders |
| `promotions` | slug UQ, title, subtitle, description, terms, image, badge, accent, starts_at, ends_at, is_active | контент акций |
| `reviews` | product_id, user_id, author_name, location, rating, text, is_published | N→1 products |
| `subscriptions` | email UQ, user_id, source | рассылка |
| `contact_messages` | name, phone, email, message, status | обращения |
| `password_reset_tokens` | user_id, token_hash, expires_at, used_at | сброс пароля |

Индексы: `users(email, referral_code)`, `products(slug, category_id, price)`, `orders(number, user_id, status)`, `order_items(order_id)`, `bonus_transactions(user_id)`, `promotions(slug)`, `promo_codes(code)`.

Миграции: `src/db/migrations/0000_*.sql`, генерируются `pnpm db:generate`, применяются автоматически в `src/db/index.ts`.

## 4. Слои кода

| Слой | Файлы | Ответственность |
|---|---|---|
| Данные | `src/db/schema.ts`, `index.ts`, `seed-data.ts` | схема, подключение PGlite/Postgres, сиды |
| Запросы | `src/lib/queries.ts` | каталог, фильтры, заказы, статистика, админ-выборки |
| Домен | `orders.ts`, `bonuses.ts`, `delivery.ts`, `promo.ts`, `payments.ts` | бизнес-правила, транзакции, интеграции |
| Валидация | `validation.ts` | Zod-схемы клиента и сервера |
| Auth | `auth.ts`, `jwt.ts`, `rate-limit.ts` | bcrypt, JWT, cookies, роли, лимиты |
| UI | `components/*`, `app/(shop)` | серверные страницы + клиентские интерактивы |
| Админка | `app/admin`, `actions.ts` | CRUD, смена статусов, роли |

## 5. Дизайн-система

| Токен | Значение |
|---|---|
| Основной лаймовый | `#99B415` (brand-700), кнопочный `#AED200` (500) |
| Красный | `#E50000` — CTA, скидки, «Акции» |
| Жёлтый | `#FFCF58` — рейтинг |
| Фон | `#FFFFFF`, светлый `#F7F8F9`, границы `#E3E6E9` |
| Текст | `#1A1A1A` / `#72777C` |
| Шрифты | Golos Text (замена EuropaNuova) — `next/font`, кириллица |
| Радиусы | 18 px карточки/баннеры, 9 px кнопки «+», 8 px CTA |
| Сетка | контейнер 1280 px, поля 80 px, карточка 290×455, шаг 40 px |

Компоненты: `btn-primary/secondary/accent`, `badge`, `field`, карточка товара с рейтингом и избранным, хлебные крошки, пагинация, drawer, toast (Sonner), аккордеон, галерея.

## 6. Производительность и SEO

- Server components + статические страницы каталога/товаров при экспорте.
- `next/image` с локальными изображениями; в продакшене включить оптимизатор и sharp.
- `next/font` с `display: swap`, предзагрузка кириллицы.
- Метаданные на каждой странице, canonical, Open Graph, Twitter Card.
- JSON-LD: `GroceryStore`, `WebSite` + SearchAction, `Product`, `BreadcrumbList`, `AggregateRating` при отзывах.
- `sitemap.xml` и `robots.txt` генерируются из БД.
- Семантические URL: `/catalog/[slug]`, `/product/[slug]`, `/promotions/[slug]`.

## 7. Масштабирование

- Кэш каталога: 5 минут (Redis или in-memory) с инвалидацией при изменении товара.
- Сессии: сейчас stateless JWT; при выходе из всех устройств добавить `token_version` в `users`.
- Очереди: письма/SMS через BullMQ + Redis, вебхуки — идемпотентные обработчики.
- Платежи: хранить `payment_id`, обрабатывать повторные вебхуки идемпотентно (реализовано).
- 1С: обмен через промежуточную таблицу `sync_log` и API `/api/integrations/1c` (не реализовано).
- Горизонтальное масштабирование: PGlite только для локальной разработки; в проде — PostgreSQL и общий Redis.
