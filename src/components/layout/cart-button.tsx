"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cartCount, cartSubtotal, useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;
  const subtotal = mounted ? cartSubtotal(items) : 0;

  return (
    <Link
      href="/cart"
      className={cn(
        "group relative flex items-center gap-2.5 rounded-full border border-line bg-white p-1.5 transition hover:border-brand-700/40 hover:shadow-card sm:py-2 sm:pl-3 sm:pr-4",
        className,
      )}
      aria-label={count ? `Корзина, ${count} товаров на ${formatPrice(subtotal)}` : "Корзина пуста"}
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-cream transition group-hover:bg-brand-900">
        <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {count}
          </span>
        )}
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Корзина</span>
        <span className="text-[13px] font-bold text-ink">{count ? formatPrice(subtotal) : "Пусто"}</span>
      </span>
    </Link>
  );
}
