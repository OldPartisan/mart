import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionTitle({
  title,
  href,
  linkLabel,
  className,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4", className)}>
      <h2 className="font-display text-[26px] font-normal leading-tight tracking-[-0.02em] text-ink sm:text-[30px] lg:text-[36px]">
        {title}
      </h2>
      {href && (
        <Link href={href} className="hidden shrink-0 items-center gap-1 text-[13px] text-muted transition hover:text-brand-800 sm:flex">
          {linkLabel ?? "Смотреть все"} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
