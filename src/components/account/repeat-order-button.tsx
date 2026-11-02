"use client";

import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";

type Item = {
  productId: string | null;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  unit: string;
};

export function RepeatOrderButton({ items }: { items: Item[] }) {
  const add = useCartStore((s) => s.add);
  const router = useRouter();

  const repeat = () => {
    const available = items.filter((item) => item.productId);
    if (available.length === 0) {
      toast.error("Товары из этого заказа больше недоступны");
      return;
    }
    for (const item of available) {
      add(
        {
          productId: item.productId!,
          slug: item.slug,
          name: item.name,
          price: item.price,
          image: item.image ?? "",
          unit: item.unit,
          weight: null,
        },
        item.quantity,
      );
    }
    toast.success("Товары добавлены в корзину", { description: `${available.length} позиций` });
    router.push("/cart");
  };

  return (
    <button type="button" onClick={repeat} className="btn-secondary btn-sm">
      <RotateCcw className="h-3.5 w-3.5" /> Повторить заказ
    </button>
  );
}
