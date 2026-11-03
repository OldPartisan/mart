"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <nav aria-label="Основная навигация" className="no-scrollbar flex h-full items-center justify-end gap-0.5 overflow-x-auto">
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
              "relative flex h-full shrink-0 items-center whitespace-nowrap px-[9px] text-[13px] font-normal transition-colors",
              active ? "text-brand-900" : "text-ink hover:text-brand-900",
              "accent" in item && item.accent && "text-accent-500 hover:text-accent-600",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
