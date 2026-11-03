"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/db/schema";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  counts: Record<string, number>;
  activeCategory?: string;
  total: number;
};

export function CatalogFilters({ categories, counts, activeCategory, total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");
  const staticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

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
    <div>
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className="flex h-12 w-full items-center justify-between rounded-lg bg-[#F3F3F3] px-4 text-[13px] text-ink transition hover:bg-line"
      >
        {collapsed ? "Показать категории и фильтры" : "Скрыть категории и фильтры"}
        <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", collapsed && "-rotate-90")} />
      </button>

      {!collapsed && (
        <>
          <ul className="mt-2">
            <li>
              <Link
                href="/catalog"
                className={cn(
                  "flex h-12 items-center justify-between border-b border-line px-4 text-[13px] transition",
                  !activeCategory ? "bg-brand-700 font-semibold text-brand-950" : "text-ink hover:bg-cream",
                )}
              >
                <span className="flex items-center gap-2">
                  {!activeCategory && <ChevronLeft className="h-3.5 w-3.5" />}
                  Все товары
                </span>
                <span className={!activeCategory ? "text-white/80" : "text-muted"}>{total}</span>
              </Link>
            </li>
            {categories.map((category) => {
              const active = activeCategory === category.slug;
              return (
                <li key={category.id}>
                  <Link
                    href={`/catalog/${category.slug}`}
                    className={cn(
                      "flex h-12 items-center justify-between border-b border-line px-4 text-[13px] transition",
                      active ? "bg-brand-700 font-semibold text-brand-950" : "text-ink hover:bg-cream",
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {active && <ChevronLeft className="h-3.5 w-3.5" />}
                      {category.name}
                    </span>
                    <span className={active ? "text-white/80" : "text-muted"}>({counts[category.id] ?? 0})</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {!staticDemo && (
            <>
              <div className="mt-5">
                <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-muted">Цена, ₽</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="от"
                    aria-label="Цена от"
                    className="field h-10 rounded-lg px-3 text-[13px]"
                  />
                  <span className="text-muted">—</span>
                  <input
                    type="number"
                    min={0}
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="до"
                    aria-label="Цена до"
                    className="field h-10 rounded-lg px-3 text-[13px]"
                  />
                </div>
                <button type="button" onClick={() => update({ minPrice: minPrice || null, maxPrice: maxPrice || null })} className="btn-secondary btn-sm mt-2 w-full">
                  Применить
                </button>
              </div>

              <div className="mt-5">
                <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-muted">Особенности</h2>
                {[
                  { key: "own", label: "Собственное производство" },
                  { key: "farm", label: "Фермерское" },
                  { key: "sale", label: "Со скидкой" },
                ].map((option) => (
                  <label key={option.key} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-ink">
                    <input
                      type="checkbox"
                      checked={params.get(option.key) === "1"}
                      onChange={() => toggle(option.key)}
                      className="h-4 w-4 rounded border-line accent-[#99B415]"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </>
          )}

          {!staticDemo && activeCount > 0 && (
            <button type="button" onClick={() => router.push(pathname)} className="mt-4 text-[12px] font-semibold text-accent-500 hover:text-accent-600">
              Сбросить фильтры ({activeCount})
            </button>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <button type="button" onClick={() => setOpen(true)} className="btn-secondary btn-sm">
          <SlidersHorizontal className="h-4 w-4" /> Категории и фильтры
        </button>
        <span className="text-[12px] text-muted">{total} товаров</span>
      </div>

      <aside className="hidden w-[290px] shrink-0 lg:block" aria-label="Фильтры каталога">
        <div className="sticky top-[132px]">{body}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} aria-label="Закрыть фильтры" />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,340px)] flex-col bg-white">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-[15px] font-semibold">Каталог</p>
              <button type="button" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-line" aria-label="Закрыть">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">{body}</div>
            <div className="border-t border-line p-3">
              <button type="button" onClick={() => setOpen(false)} className="btn-primary w-full">Показать {total} товаров</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
