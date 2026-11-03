"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cartCount, useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;

  return (
    <Link
      href="/cart"
      className={cn(
        "relative flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-ink transition hover:text-brand-900",
        className,
      )}
      aria-label={count ? `Корзина, товаров: ${count}` : "Корзина"}
    >
      <span className="relative">
        <ShoppingCart className="h-[22px] w-[22px]" strokeWidth={1.5} aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -right-2.5 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </span>
      <span className="text-[11px]">Корзина</span>
    </Link>
  );
}
