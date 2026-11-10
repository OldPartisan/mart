# Тестовые данные для RFM

Скрипт `scripts/seed-rfm-test.ts` создаёт:

- 250 покупателей с email `test.rfm***@example.com`;
- 1 075 оплаченных заказов;
- сценарии: чемпионы, лояльные, новые, перспективные, нельзя терять, под угрозой, спящие, требуют внимания;
- пароль тестовых аккаунтов: `TestRfm123!` (для входа не используется).

Все заказы имеют номер `TEST-RFM-*` и комментарий `TEST-RFM <сценарий>`.

## Запуск

```bash
DATABASE_URL=... RESET=1 pnpm tsx scripts/seed-rfm-test.ts
```

## Удаление

```bash
DATABASE_URL=... REMOVE=1 pnpm tsx scripts/seed-rfm-test.ts
```

Удаляются только заказы `TEST-RFM-%` и пользователи `test.rfm%@example.com`.
