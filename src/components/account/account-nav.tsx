"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, LayoutDashboard, MapPin, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Обзор", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Мои заказы", icon: Package },
  { href: "/account/bonuses", label: "Бонусы", icon: Gift },
  { href: "/account/profile", label: "Профиль и адреса", icon: User },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Личный кабинет" className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition",
              active ? "bg-brand-700 text-white" : "text-ink-soft hover:bg-white",
            )}
          >
            <link.icon className="h-4 w-4" aria-hidden="true" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
