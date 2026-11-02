# API

Базовый URL: `/api`. Формат — JSON (`Content-Type: application/json`). Аутентификация — httpOnly cookie `im_access` (access) и `im_refresh` (refresh), выставляются `/api/auth/login` и `/api/auth/register`.

Ошибки:

```json
{ "error": "Проверьте заполнение полей", "fields": { "email": ["Проверьте email"] } }
```

Коды: `400` — бизнес-ошибка, `401` — нет сессии, `403` — нет прав, `404` — not found, `409` — конфликт/остатки, `422` — валидация, `429` — rate limit, `500` — внутренняя ошибка.

## Аутентификация

| Метод | Путь | Тело | Ответ |
|---|---|---|---|
| POST | `/auth/register` | `{name,email,phone?,password,consent,marketingOptIn?,referral?}` | `201 {user,message}` + cookies |
| POST | `/auth/login` | `{email,password}` | `{user}` + cookies |
| POST | `/auth/logout` | — | `{ok:true}` |
| POST | `/auth/refresh` | — (refresh cookie) | `{ok:true}` + новые cookies |
| POST | `/auth/forgot-password` | `{email}` | `{ok,message,demoResetUrl?}` |
| POST | `/auth/reset-password` | `{token,password}` | `{ok,message}` |

Пароль: ≥ 8 символов, буква и цифра. Welcome-бонус начисляется при регистрации; реферальный — пригласившему.

## Каталог

| Метод | Путь | Параметры | Ответ |
|---|---|---|---|
| GET | `/products` | `category, q, minPrice, maxPrice, own=1, farm=1, sale=1, sort=popular\|price-asc\|price-desc\|new, page, perPage=12\|24\|48` | `{items,total,page,perPage,pages,category}` |
| GET | `/products/[slug]` | — | товар + `category` + `related` |
| GET | `/categories` | — | `{items,tree}` |
| GET | `/search?q=` | минимум 2 символа | `{items:[{id,name,slug,price,images,categoryName}]}` (до 6) |

Пример:

```bash
curl "http://localhost:3000/api/products?category=molochnaya-produktsiya&farm=1&sort=price-asc&page=1"
```

## Корзина и заказы

Корзина гостя хранится в localStorage и не синхронизируется с сервером. Сервер принимает только `productId` и `quantity`, цены пересчитывает сам.

| Метод | Путь | Тело | Ответ |
|---|---|---|---|
| POST | `/orders` | `CheckoutInput` | `201 {order,items,paymentUrl,demoPayment,bonusEarnedPreview}` |
| GET | `/orders` | — (auth) | `{items}` история |
| GET | `/orders/[id]` | — (auth, владелец/ staff) | `{order,items}` |

`CheckoutInput`:

```json
{
  "customerName": "Алия Габдуллина",
  "phone": "+7 (917) 000-00-03",
  "email": "client@irbis-mart.ru",
  "deliveryType": "PICKUP",
  "pickupDate": "2026-11-03",
  "pickupSlot": "12:00–14:00",
  "deliveryZoneId": "",
  "addressText": "",
  "paymentMethod": "ONLINE",
  "promoCode": "IRBIS10",
  "bonusToUse": 100,
  "comment": "",
  "items": [{ "productId": "uuid", "quantity": 2 }],
  "consent": true
}
```

Для `DELIVERY`: обязательны `deliveryZoneId` и `addressText`; для `PICKUP` — `pickupDate` и `pickupSlot` (ближайшие 7 дней, интервалы 10:00–22:00).

## Промокоды

`POST /promo/validate` → `{code,subtotal}` → `{ok,code,discount,description}` или `400 {error}`.

Правила: активен, не истёк, `subtotal ≥ minOrderAmount`, `usedCount < usageLimit`. Скидка: процент (не более 100%) или фиксированная (не больше суммы).

## Оплата

| Метод | Путь | Назначение |
|---|---|---|
| POST | `/payments/webhook` | Вебхук ЮKassa. Проверяет платёж через API, при `succeeded` вызывает `markOrderPaid` идемпотентно |
| POST | `/payments/mock-success` | Только без ключей ЮKassa: `{orderId}` → демо-оплата |

В `paymentUrl` возвращается либо `confirmation_url` ЮKassa, либо `/checkout/payment/[orderId]` для демо.

## Пользователь

| Метод | Путь | Тело | Ответ |
|---|---|---|---|
| GET | `/user/profile` | — | профиль |
| PUT | `/user/profile` | `{name,phone,marketingOptIn}` | `{user,message}` |
| GET | `/user/bonuses` | — | `{balance,totalSpent,level,next,history}` |
| GET | `/user/addresses` | — | `{items}` |
| POST | `/user/addresses` | адрес | `201 {address}` |
| DELETE | `/user/addresses?id=` | — | `{ok}` |

## Контент и рассылка

| Метод | Путь | Тело | Ответ |
|---|---|---|---|
| POST | `/subscribe` | `{email,source?}` | `{ok,message}` |
| POST | `/contact` | `{name,phone?,email?,message,consent}` | `{ok,message}` |

## Админка

CRUD реализован через **server actions** (`src/app/admin/actions.ts`), защищён проверкой `ADMIN/MANAGER`:

- `saveProduct`, `deleteProduct`, `toggleProduct`
- `saveCategory`, `deleteCategory`
- `updateOrderStatus` (отмена/выполнение/готовность), `updateCustomerNote`
- `savePromo`, `togglePromo`
- `toggleUserBlock`, `updateUserRole` (только ADMIN)
- `importProducts` (CSV `name;slug;category;price;description;images;stock`)

Экспорт CSV: `GET /api/admin/export/products` (staff), `text/csv`, BOM для Excel.

## Rate limits

| Маршрут | Лимит |
|---|---|
| login | 8 / мин на IP+email |
| register | 8 / мин на IP |
| orders | 6 / мин на IP |
| promo validate | 20 / мин на IP |
| contact | 5 / мин на IP |
| subscribe | 6 / мин на IP |

В продакшене заменить in-memory лимитер на Redis/Upstash, чтобы ограничения работали между инстансами.
