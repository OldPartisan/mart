"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/db/schema";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  activeCategory?: string;
  total: number;
};

export function CatalogFilters({ categories, activeCategory, total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const update = (patch: Record<string, string | null>) => {
    const query = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "") query.delete(key);
      else query.set(key, value);
    }
    query.delete("page");
    router.push(`${pathname}?${query.toString()}`, { scroll: false });
  };

  const toggle = (key: string) => update({ [key]: params.get(key) === "1" ? null : "1" });

  const activeCount = ["minPrice", "maxPrice", "own", "farm", "sale"].filter((key) => params.get(key)).length;

  const body = (
    <div className="space-y-7">
      <div>
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Категории</h2>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/catalog"
              className={cn(
                "block rounded-lg px-2.5 py-1.5 text-[13px] transition",
                !activeCategory ? "bg-brand-50 font-bold text-brand-900" : "text-ink-soft hover:bg-cream",
              )}
            >
              Все товары
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/catalog/${category.slug}`}
                className={cn(
                  "block rounded-lg px-2.5 py-1.5 text-[13px] transition",
                  activeCategory === category.slug ? "bg-brand-50 font-bold text-brand-900" : "text-ink-soft hover:bg-cream",
                )}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Цена, ₽</h2>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="от"
            aria-label="Цена от"
            className="field h-10 rounded-xl px-3 text-[13px]"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="до"
            aria-label="Цена до"
            className="field h-10 rounded-xl px-3 text-[13px]"
          />
        </div>
        <button
          type="button"
          onClick={() => update({ minPrice: minPrice || null, maxPrice: maxPrice || null })}
          className="btn-secondary btn-sm mt-2 w-full"
        >
          Применить
        </button>
      </div>

      <div>
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Особенности</h2>
        <div className="space-y-1">
          {[
            { key: "own", label: "Собственное производство" },
            { key: "farm", label: "Фермерское" },
            { key: "sale", label: "Со скидкой" },
          ].map((option) => (
            <label key={option.key} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-soft hover:bg-cream">
              <input
                type="checkbox"
                checked={params.get(option.key) === "1"}
                onChange={() => toggle(option.key)}
                className="h-4 w-4 rounded border-line text-brand-700 accent-[#2E7D32]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-cream p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Совет</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
          Ищите метку «Своё» — это продукты нашего производства. Свежесть гарантируем сами.
        </p>
      </div>

      {activeCount > 0 && (
        <button type="button" onClick={() => router.push(pathname)} className="text-[12px] font-semibold text-accent-600 hover:text-accent-700">
          Сбросить фильтры ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <button type="button" onClick={() => setOpen(true)} className="btn-secondary btn-sm">
          <SlidersHorizontal className="h-4 w-4" />
          Фильтры {activeCount > 0 && <span className="ml-1 rounded-full bg-brand-800 px-1.5 text-[10px] text-cream">{activeCount}</span>}
        </button>
        <span className="text-[12px] text-muted">{total} товаров</span>
      </div>

      <aside className="hidden w-[236px] shrink-0 lg:block" aria-label="Фильтры каталога">
        <div className="sticky top-[150px]">{body}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Закрыть фильтры" />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="font-display text-lg font-bold">Фильтры</p>
              <button type="button" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-line" aria-label="Закрыть">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{body}</div>
            <div className="border-t border-line p-4">
              <button type="button" onClick={() => setOpen(false)} className="btn-primary w-full">
                Показать {total} товаров
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
