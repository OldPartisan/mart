import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Milk, Croissant, ChefHat, CakeSlice } from "lucide-react";

const lines = [
  { icon: Milk, title: "Молочная", text: "Пастеризация каждое утро, срок — от 5 суток." },
  { icon: Croissant, title: "Пекарня", text: "Пять выпечек в день: от багета до медовика." },
  { icon: ChefHat, title: "Кухня", text: "Салаты, супы и горячее — каждые 3 часа." },
  { icon: CakeSlice, title: "Кондитерская", text: "Торты и десерты без полуфабрикатов." },
];

export function OwnProduction() {
  return (
    <section className="section bg-[#FBF8F1]">
      <div className="container-x">
        <div className="overflow-hidden rounded-[2.5rem] bg-brand-950 text-white">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[320px] lg:min-h-full">
              <Image
                src="/images/chef.jpg"
                alt="Повар на кухне Ирбис Март"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent lg:bg-gradient-to-r" />
              <div className="absolute bottom-5 left-5 rounded-2xl bg-cream/95 px-4 py-3 text-ink shadow-card">
                <p className="font-display text-2xl font-extrabold leading-none">4</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">своих производства</p>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12">
              <p className="eyebrow text-accent-300">Собственное производство</p>
              <h2 className="mt-3 text-h2 font-bold text-white text-balance">От коровы до прилавка — без посредников</h2>
              <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-white/85">
                Мы производим сами: молочную продукцию, хлеб и выпечку, готовую еду и десерты. Поэтому знаем состав
                каждого продукта и отвечаем за свежесть не словами, а ежедневной полкой.
              </p>

              <div className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {lines.map((line) => (
                  <div key={line.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-accent-300">
                      <line.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-white">{line.title}</p>
                      <p className="mt-0.5 text-[11.5px] leading-snug text-white/80">{line.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/own-production" className="inline-flex h-11 items-center gap-2 rounded-full bg-cream px-5 text-[13px] font-bold text-brand-900 transition hover:bg-white">
                  Как мы производим <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/catalog/molochnaya-produktsiya" className="text-[12px] font-semibold text-white/90 underline-offset-4 transition hover:text-white hover:underline">
                  Молочная полка
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
