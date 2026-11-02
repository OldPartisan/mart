"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    images: string[];
    unit: string;
    weight?: string | null;
    stock?: number;
  };
  variant?: "icon" | "full" | "compact";
  className?: string;
};

export function AddToCart({ product, variant = "icon", className }: Props) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const item = items.find((i) => i.productId === product.id);
  const quantity = item?.quantity ?? 0;

  useEffect(() => setMounted(true), []);

  const handleAdd = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? "",
        unit: product.unit,
        weight: product.weight ?? null,
      },
      1,
    );
    track("add_to_cart", { item_id: product.slug, item_name: product.name, value: product.price, currency: "RUB" });
    if (variant !== "icon") toast.success("Добавлено в корзину", { description: product.name });
  };

  const outOfStock = product.stock === 0;

  if (outOfStock) {
    return (
      <span className={cn("badge badge-outline", className)} aria-disabled="true">
        Нет в наличии
      </span>
    );
  }

  if (!mounted || quantity === 0) {
    if (variant === "full") {
      return (
        <button type="button" onClick={handleAdd} className={cn("btn-primary w-full", className)}>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          В корзину
        </button>
      );
    }
    if (variant === "compact") {
      return (
        <button
          type="button"
          onClick={handleAdd}
          className={cn("btn-primary btn-sm w-full", className)}
          aria-label={`Добавить ${product.name} в корзину`}
        >
          В корзину
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Добавить ${product.name} в корзину`}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-cream transition hover:bg-brand-900 active:scale-95",
          className,
        )}
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full bg-brand-800 p-1 text-cream",
        variant === "full" ? "h-12 w-full justify-between px-2" : "h-10",
        className,
      )}
      role="group"
      aria-label={`Количество ${product.name}`}
    >
      <button
        type="button"
        onClick={() => setQuantity(product.id, quantity - 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/15"
        aria-label="Уменьшить количество"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="min-w-6 text-center text-sm font-bold" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => setQuantity(product.id, quantity + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/15"
        aria-label="Увеличить количество"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
