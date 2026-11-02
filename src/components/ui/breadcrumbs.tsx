import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Хлебные крошки" className={cn("flex flex-wrap items-center gap-1.5 text-[12px] text-muted", className)}>
      <Link href="/" className="transition-colors hover:text-brand-800">
        Главная
      </Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-line" aria-hidden="true" />
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-brand-800">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-soft">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
