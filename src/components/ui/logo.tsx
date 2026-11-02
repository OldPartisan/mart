import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="14" fill={inverted ? "#F8F4EA" : "currentColor"} />
      <path d="M12 33L21 17l6 10 4-6 5 12H12Z" fill={inverted ? "#0F2C16" : "#F8F4EA"} />
      <circle cx="33" cy="14" r="3" fill="#F26B21" />
      <path d="M15 37h18" stroke={inverted ? "#0F2C16" : "#F8F4EA"} strokeWidth="2" strokeLinecap="round" opacity=".4" />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
  inverted = false,
}: {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
}) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Ирбис Март — на главную">
      <LogoMark className="h-10 w-10 shrink-0 text-brand-800" inverted={inverted} />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-display text-[17px] font-extrabold uppercase tracking-[-0.02em] sm:text-[19px]", inverted ? "text-cream" : "text-ink")}>
            Ирбис <span className="text-brand-700 group-hover:text-accent-500 transition-colors">Март</span>
          </span>
          <span className={cn("mt-1 hidden text-[8.5px] font-semibold uppercase tracking-[0.22em] sm:block", inverted ? "text-cream/60" : "text-muted")}>
            фермерский супермаркет
          </span>
        </span>
      )}
    </Link>
  );
}
