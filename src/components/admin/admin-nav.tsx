"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LayoutDashboard, Package, FolderTree, ShoppingCart, Ticket, Users, FileText, Plug, LockKeyhole, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const allRoles = ["ADMIN", "MANAGER", "MARKETER", "EDITOR"];
const links = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true, roles: ["ADMIN", "MANAGER"] },
  { href: "/admin/content", label: "Контент", icon: FileText, roles: allRoles },
  { href: "/admin/media", label: "Медиа", icon: ImageIcon, roles: allRoles },
  { href: "/admin/products", label: "Товары", icon: Package, roles: ["ADMIN", "MANAGER"] },
  { href: "/admin/categories", label: "Категории", icon: FolderTree, roles: ["ADMIN", "MANAGER"] },
  { href: "/admin/orders", label: "Заказы", icon: ShoppingCart, roles: ["ADMIN", "MANAGER"] },
  { href: "/admin/users", label: "Пользователи", icon: Users, roles: ["ADMIN", "MANAGER"] },
  { href: "/admin/integration", label: "Интеграция 1С", icon: Plug, roles: ["ADMIN", "MANAGER"] },
  { href: "/admin/security", label: "Безопасность", icon: LockKeyhole, roles: allRoles },
];

export function AdminNav({ role }: { role: string }) {
  const pathname = usePathname();
  return (
    <nav className="no-scrollbar flex gap-1 overflow-x-auto p-3 lg:flex-col lg:gap-0.5 lg:overflow-visible">
      {links.filter((link) => link.roles.includes(role)).map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold transition",
              active ? "bg-cream text-brand-950" : "text-cream/65 hover:bg-white/5 hover:text-cream",
            )}
          >
            <link.icon className="h-4 w-4" aria-hidden="true" />
            {link.label}
          </Link>
        );
      })}
      <Link href="/" className="mt-2 flex shrink-0 items-center gap-2 rounded-xl border border-cream/15 px-3 py-2.5 text-[12px] font-semibold text-cream/65 hover:text-cream lg:mt-6">
        <ArrowUpRight className="h-3.5 w-3.5" /> На сайт
      </Link>
    </nav>
  );
}
