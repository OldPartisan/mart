"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, Sparkles, User } from "lucide-react";


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
        className="flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-ink transition hover:text-brand-800"
      >
        <User className="h-[22px] w-[22px]" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[11px]">Войти</span>
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
        className="flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-ink transition hover:text-brand-800"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <User className="h-[22px] w-[22px]" strokeWidth={1.5} aria-hidden="true" />
        <span className="max-w-16 truncate text-[11px]">{user.name.split(" ")[0]}</span>
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
