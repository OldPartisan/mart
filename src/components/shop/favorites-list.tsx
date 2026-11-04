"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useFavoritesStore } from "@/store/favorites";

export function FavoritesList() {
  const [mounted, setMounted] = useState(false);
  const items = useFavoritesStore((s) => s.items);
  const remove = useFavoritesStore((s) => s.remove);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <p className="mt-8 text-[13px] text-muted">Загружаем избранное…</p>;

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-[18px] border border-line bg-[#F7F8F9] px-6 py-14 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-900">
          <Heart className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold">Пока пусто</h2>
        <p className="mt-1.5 text-[13px] text-muted">Нажмите на сердечко в карточке товара.</p>
        <Link href="/catalog" className="btn-primary mt-5 inline-flex">В каталог</Link>
      </div>
    );
  }

  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.slug} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
          <Link href={`/product/${item.slug}`} className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-semibold text-ink">{item.name}</span>
            <span className="mt-1 block text-[12px] text-muted">Перейти к товару</span>
          </Link>
          <button
            type="button"
            onClick={() => remove(item.slug)}
            aria-label={`Убрать ${item.name} из избранного`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-cream hover:text-accent-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
