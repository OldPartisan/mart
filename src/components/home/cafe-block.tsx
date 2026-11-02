import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Coffee, Users } from "lucide-react";

export function CafeBlock() {
  return (
    <section className="section bg-cream">
      <div className="container-x grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2.5rem]">
            <Image src="/images/cafe-interior.jpg" alt="Интерьер кафе Ирбис Март" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-float sm:left-8 sm:right-auto sm:w-[320px]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-800">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-xl font-extrabold leading-none">102</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">посадочных места</p>
              </div>
            </div>
            <span className="badge bg-brand-100 text-brand-900">открыто</span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="eyebrow">Кафе IRBIS MART</p>
          <h2 className="mt-3 text-h2 font-bold text-ink text-balance">Поесть по пути или посидеть с семьёй</h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
            Горячие завтраки, бизнес-ланчи, пицца из дровяной печи, роллы, десерты и кофе собственной обжарки.
            Отдельный зал на 102 места, детское меню и парковка у входа.
          </p>

          <ul className="mt-6 space-y-3">
            <li className="flex items-start gap-3 text-[13.5px] text-ink-soft">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <span><strong className="font-semibold text-ink">Завтраки до 11:00.</strong> Круассан и капучино — 249 ₽.</span>
            </li>
            <li className="flex items-start gap-3 text-[13.5px] text-ink-soft">
              <Coffee className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <span><strong className="font-semibold text-ink">Бизнес-ланч 12:00–15:00.</strong> Суп, горячее и напиток — 490 ₽.</span>
            </li>
            <li className="flex items-start gap-3 text-[13.5px] text-ink-soft">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <span><strong className="font-semibold text-ink">Семейный формат.</strong> Детское меню, комбо на 3–4 человек, праздники.</span>
            </li>
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/cafe" className="btn-primary">
              Меню кафе <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/cafe#preorder" className="btn-secondary">
              Предзаказ блюд
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
