"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Package, Sparkles, User } from "lucide-react";
import { initials } from "@/lib/utils";

export type HeaderUser = { name: string; email: string; role: "CUSTOMER" | "MANAGER" | "ADMIN" } | null;

export function UserMenu({ user }: { user: HeaderUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-full px-2 py-2 text-[13px] font-semibold text-ink transition hover:bg-ink/5 sm:px-3"
      >
        <User className="h-5 w-5" aria-hidden="true" />
        <span className="hidden md:inline">Войти</span>
      </Link>
    );
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full p-1.5 pr-2 transition hover:bg-ink/5"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-[12px] font-bold text-brand-900">
          {initials(user.name)}
        </span>
        <span className="hidden max-w-24 truncate text-[13px] font-semibold text-ink lg:block">{user.name.split(" ")[0]}</span>
        <ChevronDown className="hidden h-4 w-4 text-muted lg:block" aria-hidden="true" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 overflow-hidden rounded-2xl border border-line bg-white shadow-float">
          <div className="border-b border-line px-4 py-3">
            <p className="text-[13px] font-bold text-ink">{user.name}</p>
            <p className="truncate text-[11px] text-muted">{user.email}</p>
          </div>
          <div className="p-1.5">
            <Link href="/account" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink hover:bg-cream">
              <User className="h-4 w-4 text-muted" /> Личный кабинет
            </Link>
            <Link href="/account/orders" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink hover:bg-cream">
              <Package className="h-4 w-4 text-muted" /> Мои заказы
            </Link>
            <Link href="/account/bonuses" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink hover:bg-cream">
              <Sparkles className="h-4 w-4 text-muted" /> Бонусы
            </Link>
            {(user.role === "ADMIN" || user.role === "MANAGER") && (
              <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink hover:bg-cream">
                <LayoutDashboard className="h-4 w-4 text-muted" /> Админ-панель
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 border-t border-line px-4 py-3 text-left text-[13px] font-medium text-muted transition hover:bg-cream hover:text-ink"
          >
            <LogOut className="h-4 w-4" /> Выйти
          </button>
        </div>
      )}
    </div>
  );
}
