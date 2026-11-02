"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, LayoutDashboard, LogIn, Menu, Phone, User, X } from "lucide-react";
import type { Category } from "@/db/schema";
import { mainNav, site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import type { HeaderUser } from "./user-menu";

export function MobileMenu({ categories, user }: { categories: Category[]; user: HeaderUser }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-lg text-ink lg:hidden"
        aria-label="Открыть меню"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Закрыть меню" />
          <div className="absolute inset-y-0 right-0 flex w-[min(92vw,420px)] flex-col bg-[#FBF8F1] shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white"
                aria-label="Закрыть меню"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-5">
              <Link href="/catalog" className="btn-primary w-full">
                Каталог товаров <ArrowRight className="h-4 w-4" />
              </Link>

              <nav className="mt-6 space-y-0.5" aria-label="Мобильная навигация">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold text-ink hover:bg-white"
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                  </Link>
                ))}
              </nav>

              <p className="mb-2 mt-7 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Категории</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link key={category.id} href={`/catalog/${category.slug}`} className="flex items-center gap-2 rounded-2xl bg-white p-2.5">
                    {category.image && (
                      <span className="relative h-9 w-9 overflow-hidden rounded-lg">
                        <Image src={category.image} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                    )}
                    <span className="text-[11px] font-semibold leading-tight text-ink">{category.name}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-7 rounded-2xl bg-brand-900 p-4 text-cream">
                <p className="text-[11px] uppercase tracking-wider text-cream/60">Программа лояльности</p>
                <p className="mt-1 font-display text-lg font-bold">1 бонус = 1 ₽</p>
                <p className="mt-1 text-[12px] text-cream/75">Оплачивайте бонусами до 50% заказа</p>
                <Link href="/loyalty" className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-accent-300">
                  Как это работает <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="border-t border-line bg-white px-5 py-4">
              <a href={site.phoneHref} className="flex items-center gap-2 text-[14px] font-bold text-ink">
                <Phone className="h-4 w-4 text-brand-700" /> {site.phone}
              </a>
              <p className="mt-1 text-[11px] text-muted">{site.hours} · {site.address}</p>
              <div className="mt-3 flex gap-2">
                {user ? (
                  <>
                    <Link href="/account" className="btn-secondary btn-sm flex-1">
                      <User className="h-4 w-4" /> Кабинет
                    </Link>
                    {(user.role === "ADMIN" || user.role === "MANAGER") && (
                      <Link href="/admin" className="btn-primary btn-sm" aria-label="Админ-панель">
                        <LayoutDashboard className="h-4 w-4" />
                      </Link>
                    )}
                  </>
                ) : (
                  <Link href="/login" className="btn-primary btn-sm flex-1">
                    <LogIn className="h-4 w-4" /> Войти
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
