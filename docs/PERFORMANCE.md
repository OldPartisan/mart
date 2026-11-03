# PageSpeed / Lighthouse: что исправлено

**Отчёт Google PageSpeed:** <https://pagespeed.web.dev/analysis/https-irbis-mart-vercel-app/fi18wyubo8?form_factor=desktop>

API PageSpeed вернул 429 (дневная квота), поэтому аудит воспроизведён локально Lighthouse 12.8.2 с тем же Chrome и проверен на production.

## Результат

| Метрика | До | После |
|---|---|---|
| Lighthouse desktop (warm) | 90 / 93 / 100 / 100 | **99 / 100 / 100 / 100** |
| Lighthouse mobile | 73 / 93 / 96 / 100 | **94 / 100 / 100 / 100** |
| LCP mobile | 8,8 с | **2,9 с** |
| Total bytes | 2 970 КиБ | **563 КиБ** |
| Contrast | 2,36:1 | **4,91:1** |
| Target size | 6×6 px | **24×24 px** |

Первая cold-проверка desktop после деплоя дала 77–80 из-за холодного старта serverless-функции Vercel; повторный warm-прогон — 99.

## Что изменено

### 1. Изображения

- Для Vercel/Node включён `next/image` optimizer: `formats: ["image/avif","image/webp"]`.
- Добавлен `sharp@0.34.5`.
- Responsive `sizes` теперь реально работает; продуктам отдаётся 384/640 px вместо 1200–2048 px.
- Для static export GitHub Pages сохранён `unoptimized: true`.
- Экономия: **2 970 → 563 КиБ**, LCP mobile **8,8 → 2,9 с**.

Файл: `next.config.ts`.

### 2. Контраст

Проблема была в белом тексте на `#99B415` (2,36:1). Основные CTA/бейджи/hero переведены на `brand-900 #5F7A08` (4,91:1). Текст в hero/лояльности — чистый белый без opacity.

Файлы: `tailwind`-классы в `src`, `globals.css`, `hero.tsx`, `loyalty-block.tsx`, `catalog-menu.tsx`, `product-card.tsx`, `add-to-cart.tsx`, `footer.tsx`, `newsletter-form.tsx`.

### 3. Размер touch-target

Точки карусели были 6×6 px и не проходили `target-size`. Теперь кнопка **24×24 px**, визуальная точка осталась 6×24 внутри.

Файл: `src/components/home/hero.tsx`.

### 4. LCP

Hero-изображение получило `fetchPriority="high"` и `priority`; LCP mobile опустился до 2,9 с.

## Что осталось

- **DOM size** ~1 040 элементов на desktop — архитектурное, не критично.
- **legacy JS** ~11 КиБ полифилов Next.
- **bf-cache** — 2 причины; не влияет на загрузку.
- Холодный старт Vercel: первый запрос после простоя может быть медленнее. Для стабильного PageSpeed нужен прогрев (uptime-монитор) или статическая оболочка главной с клиентским session.
