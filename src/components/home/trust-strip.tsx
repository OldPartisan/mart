import { Coffee, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";

const items = [
  { icon: Leaf, title: "Своё производство", text: "молочная, пекарня, кухня" },
  { icon: ShieldCheck, title: "Фермеры Татарстана", text: "12 местных хозяйств" },
  { icon: Truck, title: "Самовывоз за 2 часа", text: "бесплатно, хранение 24 ч" },
  { icon: Sparkles, title: "Бонусы 1 = 1 ₽", text: "оплата до 50% заказа" },
  { icon: Coffee, title: "Кафе на 102 места", text: "завтраки и бизнес-ланчи" },
];

export function TrustStrip() {
  return (
    <section aria-label="Преимущества" className="border-b border-line/70 bg-white">
      <div className="container-x grid grid-cols-2 gap-x-4 gap-y-5 py-6 sm:grid-cols-3 lg:grid-cols-5 lg:py-7">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-800">
              <item.icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[12px] font-bold leading-tight text-ink">{item.title}</p>
              <p className="mt-1 text-[11px] leading-tight text-muted">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
