"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <nav aria-label="Основная навигация" className="no-scrollbar flex h-full items-center gap-0.5 overflow-x-auto">
      {mainNav.map((item) => {
        const [base, query] = item.href.split("?");
        const queryParam = query?.split("=");
        const active = queryParam
          ? pathname === base && params.get(queryParam[0]) === queryParam[1]
          : pathname === base || (base !== "/" && pathname.startsWith(base));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex h-full shrink-0 items-center whitespace-nowrap px-3 text-[13px] font-semibold transition-colors",
              active ? "text-brand-800" : "text-ink-soft hover:text-brand-800",
              "accent" in item && item.accent && !active && "text-accent-600 hover:text-accent-700",
            )}
          >
            {item.label}
            {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-700" />}
          </Link>
        );
      })}
    </nav>
  );
}
