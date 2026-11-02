import { cn } from "@/lib/utils";

/** Цена в стиле макета: рубли крупно, копейки — верхним индексом. */
export function PriceTag({ value, className }: { value: number; className?: string }) {
  const rubles = Math.floor(value);
  const kopecks = Math.round((value - rubles) * 100);
  return (
    <span className={cn("inline-flex items-start font-display font-extrabold leading-none tracking-[-0.02em] text-ink", className)}>
      <span>{rubles.toLocaleString("ru-RU")}</span>
      <sup className="ml-0.5 mt-1 text-[0.45em] font-extrabold leading-none">{String(kopecks).padStart(2, "0")}</sup>
    </span>
  );
}
