import Link from "next/link";
import { Truck } from "lucide-react";

export function DeliveryLink() {
  return (
    <Link
      href="/delivery"
      className="hidden flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-ink transition hover:text-brand-800 sm:flex"
    >
      <Truck className="h-[22px] w-[22px]" strokeWidth={1.5} aria-hidden="true" />
      <span className="whitespace-nowrap text-[11px]">Доставка / Самовывоз</span>
    </Link>
  );
}
