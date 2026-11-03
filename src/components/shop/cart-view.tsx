"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Sparkles, Trash2, Truck } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatPrice, pluralize } from "@/lib/money";
import { site } from "@/lib/site";

export function CartView() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="container-x py-16 text-center text-sm text-muted">Загружаем корзину…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-14 md:py-20">
        <div className="mx-auto max-w-lg rounded-[2rem] border border-line bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream text-brand-900">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-ink">Корзина пока пуста</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Начните с молочной полки, свежей выпечки или готового ужина. Самовывоз — через 2 часа.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/catalog" className="btn-primary">
              В каталог <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/catalog/kombo-nabory" className="btn-secondary">
              Комбо-наборы
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const bonusPreview = Math.floor(subtotal / 100);

  return (
    <div className="container-x py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1 font-bold text-ink">Корзина</h1>
          <p className="mt-1 text-[13px] text-muted">
            {count} {pluralize(count, "товар", "товара", "товаров")} · {formatPrice(subtotal)}
          </p>
        </div>
        <button type="button" onClick={clear} className="text-[12px] font-semibold text-muted underline-offset-4 hover:text-accent-600 hover:underline">
          Очистить корзину
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.productId} className="flex gap-3 rounded-3xl border border-line/80 bg-white p-3 sm:gap-4 sm:p-4">
              <Link href={`/product/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream-dark sm:h-28 sm:w-28">
                <Image src={item.image || "/images/store.jpg"} alt={item.name} fill sizes="112px" className="object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/product/${item.slug}`} className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink hover:text-brand-900">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-[11px] text-muted">{item.weight ?? item.unit}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Удалить ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <div className="flex items-center gap-1 rounded-full border border-line p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-cream"
                      aria-label="Уменьшить количество"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-7 text-center text-[13px] font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-cream"
                      aria-label="Увеличить количество"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[15px] font-bold text-ink">{formatPrice(item.price * item.quantity)}</p>
                    {item.quantity > 1 && <p className="text-[10px] text-muted">{formatPrice(item.price)} / шт.</p>}
                  </div>
                </div>
              </div>
            </article>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-50 px-4 py-3 text-[12px] text-brand-900">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> За этот заказ начислим ≈ {bonusPreview} бонусов
            </span>
            <Link href="/loyalty" className="font-semibold underline underline-offset-2">
              Как работают бонусы
            </Link>
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] border border-line/80 bg-white p-5 lg:sticky lg:top-[150px]">
          <h2 className="font-display text-lg font-bold">Итого</h2>
          <dl className="mt-4 space-y-2.5 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-muted">Товары ({count})</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Самовывоз</dt>
              <dd className="font-semibold text-brand-900">бесплатно</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Промокод</dt>
              <dd className="text-muted">на следующем шаге</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-[13px] font-semibold">К оплате</span>
            <span className="price text-2xl">{formatPrice(subtotal)}</span>
          </div>

          <Link href="/checkout" className="btn-primary mt-5 w-full">
            Оформить заказ <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/catalog" className="mt-2 flex h-10 items-center justify-center text-[12px] font-semibold text-muted hover:text-brand-900">
            Продолжить покупки
          </Link>

          <div className="mt-4 space-y-2 border-t border-line pt-4 text-[11px] text-muted">
            <p className="flex items-start gap-2">
              <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-900" />
              Доставка от 149 ₽, бесплатно от {formatPrice(site.deliveryFreeFrom)}. Зоны — на шаге оформления.
            </p>
            <p>Заказ храним {site.pickupStorage}. Оплата картой онлайн или при получении.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
