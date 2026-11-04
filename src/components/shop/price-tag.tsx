import { cn } from "@/lib/utils";

/** Цена в стиле макета: рубли крупно, копейки — только если они есть. */
export function PriceTag({ value, className }: { value: number; className?: string }) {
  const rubles = Math.floor(value);
  const kopecks = Math.round((value - rubles) * 100);
  return (
    <span className={cn("inline-flex items-baseline font-display font-extrabold leading-none tracking-[-0.02em] text-ink", className)}>
      <span>{rubles.toLocaleString("ru-RU")}</span>
      {kopecks > 0 && <span className="ml-0.5 text-[0.5em] font-bold">,{String(kopecks).padStart(2, "0")}</span>}
      <span className="ml-1 text-[0.55em] font-bold">₽</span>
    </span>
  );
}
