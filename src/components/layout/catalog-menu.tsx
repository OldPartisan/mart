"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import type { Category } from "@/db/schema";
import { cn } from "@/lib/utils";

export function CatalogMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "flex h-11 items-center gap-2 rounded-lg px-4 text-[14px] font-semibold text-white transition",
          open ? "bg-brand-600" : "bg-brand-700 hover:bg-brand-600",
        )}
      >
        <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
        Каталог
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-[min(760px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-line bg-white shadow-float">
          <div className="grid gap-1 p-3 sm:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog/${category.slug}`}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-cream"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                  {category.image && (
                    <Image src={category.image} alt="" fill sizes="56px" className="object-cover transition duration-500 group-hover:scale-105" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-ink">{category.name}</p>
                  <p className="line-clamp-1 text-[11px] text-muted">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-cream/60 px-5 py-3.5">
            <p className="text-[12px] text-muted">
              <span className="font-semibold text-brand-900">1 бонус = 1 ₽</span> · оплата до 50% заказа
            </p>
            <Link href="/catalog" onClick={() => setOpen(false)} className="link-underline text-[12px]">
              Весь каталог <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
