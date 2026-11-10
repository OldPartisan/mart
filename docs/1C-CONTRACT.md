# Контракт интеграции с 1С (черновик)

Пока 1С не отдаёт API, стороны фиксируют контракт и тестируют его на mock-сервере.

## 1С → сайт

- `POST /api/integration/1c/catalog` — номенклатура, категории, изображения;
- `POST /api/integration/1c/prices` — типы цен;
- `POST /api/integration/1c/stocks` — остатки по складам;
- `POST /api/integration/1c/orders/status` — статусы заказов.

## Сайт → 1С

- `POST /hs/site/v1/orders` — создать заказ;
- `POST /hs/site/v1/orders/{id}/cancel` — отменить;
- `GET  /hs/site/v1/orders/{id}` — статус;
- `POST /hs/site/v1/stock/reserve` — резерв;
- `POST /hs/site/v1/stock/release` — снять резерв.

## Обязательные поля номенклатуры

`externalId` (GUID), `sku`, `barcode`, `name`, `categoryId`, `unit`, `price`, `priceType`, `stock`, `warehouseId`, `vat`, `images[]`, `description`, `isActive`, `updatedAt`.

## Правила

- идемпотентность по `externalId` и `orderId`;
- `changedSince` для delta;
- HMAC-подпись и timestamp;
- retry с backoff;
- журнал `integration_events`;
- ежедневная сверка.

## Mock

```bash
node scripts/mock-1c-server.mjs
```

Сервер слушает `http://127.0.0.1:4010` и отдаёт тестовый каталог/остатки/health.
