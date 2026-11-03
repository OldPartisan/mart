import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, Check, Clock, CreditCard, MapPin, Smartphone, Store, Truck } from "lucide-react";
import { DELIVERY_ZONES, PICKUP_INFO } from "@/lib/delivery";
import { site as shop } from "@/lib/site";
import { PageHero } from "@/components/content/page-hero";
import { Faq } from "@/components/content/faq";
import { formatPrice } from "@/lib/money";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description: "Условия доставки «Ирбис Март»: зоны, стоимость, бесплатная доставка от 1 500 ₽, самовывоз через 2 часа и способы оплаты.",
  alternates: { canonical: "/delivery" },
  openGraph: { title: "Доставка и оплата — Ирбис Март", description: "Доставка от 149 ₽ по ближним посёлкам, самовывоз бесплатно.", url: "/delivery", images: ["/images/store.jpg"] },
};

const faq = [
  { q: "Как быстро привезёте заказ?", a: "По Новой Туре и ТураНове — 2–3 часа с момента подтверждения. В дальние посёлки — 3–5 часов или на следующий день, если заказ оформлен поздно вечером." },
  { q: "Можно ли оплатить при получении?", a: "Да. Выберите «При получении» — курьер примет карту или наличные, на кассе самовывоза тоже можно оплатить картой." },
  { q: "Что если товара нет в наличии?", a: "Перед сборкой менеджер позвонит и предложит замену или исключит позицию из заказа. Сумма пересчитается автоматически." },
  { q: "Доставляете ли в Зеленодольск?", a: "Сейчас доставка работает по ближним посёлкам. В Зеленодольск и Казань удобнее самовывоз: заказ ждёт на стойке 24 часа." },
  { q: "Можно ли вернуть товар?", a: "Продукты надлежащего качества возврату не подлежат, но если что-то не понравилось — позвоните нам. Заменим или вернём деньги." },
];

export default function DeliveryPage() {
  return (
    <>
      <PageHero
        eyebrow="Доставка и оплата"
        title="Привезём за 2–5 часов или соберём к вашему приезду"
        description="Доставка по ближним посёлкам от 149 ₽, бесплатно от 1 500 ₽. Самовывоз в Новой Туре — бесплатный, заказ ждёт 24 часа."
        crumbs={[{ label: "Доставка и оплата" }]}
        image="/images/figma/tile-market.webp"
        imageAlt="Супермаркет Ирбис Март"
        cta={{ href: "/catalog", label: "Собрать заказ" }}
      />

      <section className="section">
        <div className="container-x grid gap-4 md:grid-cols-2">
          <div className="rounded-[2rem] border border-line/80 bg-white p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-800 text-cream"><Store className="h-5 w-5" /></span>
            <h2 className="mt-4 font-display text-xl font-bold">Самовывоз</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">Соберите корзину, оплатите онлайн или на месте — и заберите без очереди.</p>
            <ul className="mt-4 space-y-2.5 text-[12.5px]">
              {[`Бесплатно, хранение ${PICKUP_INFO.storage}`, "Готовим через 2 часа", "Отдельная стойка у входа", "Можно оплатить бонусами до 50%"].map((item) => (
                <li key={item} className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-700" />{item}</li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-cream p-3 text-[11.5px] text-ink-soft">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-700" /> {shop.address}
            </p>
            <Link href="/pickup" className="link-underline mt-4">Подробнее о самовывозе <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="rounded-[2rem] border border-line/80 bg-brand-900 p-6 text-cream">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-accent-300"><Truck className="h-5 w-5" /></span>
            <h2 className="mt-4 font-display text-xl font-bold">Доставка</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-cream/65">Привезём до двери по Новой Туре, ТураНове и ближним посёлкам. Курьер позвонит за 15 минут.</p>
            <ul className="mt-4 space-y-2.5 text-[12.5px] text-cream/85">
              {["От 149 ₽, бесплатно от 1 500 ₽", "Интервалы 2–3 часа", "Оплата картой онлайн или курьеру", "Можно попросить оставить у двери"].map((item) => (
                <li key={item} className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-300" />{item}</li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-cream/10 p-3 text-[11.5px] text-cream/70">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-300" /> Минимальный заказ — от 800 ₽. Зоны и стоимость — ниже.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x">
          <p className="eyebrow">Зоны</p>
          <h2 className="mt-2.5 text-h2 font-bold text-ink">Куда и за сколько</h2>
          <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-white">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-brand-50 text-[10px] uppercase tracking-wider text-brand-900">
                <tr>
                  <th className="px-4 py-3 font-bold">Зона</th>
                  <th className="px-4 py-3 font-bold">Населённые пункты</th>
                  <th className="px-4 py-3 font-bold">Доставка</th>
                  <th className="hidden px-4 py-3 font-bold sm:table-cell">Бесплатно от</th>
                  <th className="hidden px-4 py-3 font-bold md:table-cell">Время</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {DELIVERY_ZONES.map((zone) => (
                  <tr key={zone.id}>
                    <td className="px-4 py-3.5 font-semibold text-ink">{zone.name}</td>
                    <td className="px-4 py-3.5 text-muted">{zone.areas.join(", ")}</td>
                    <td className="px-4 py-3.5 font-semibold">{formatPrice(zone.fee)}</td>
                    <td className="hidden px-4 py-3.5 text-muted sm:table-cell">{formatPrice(zone.freeFrom)}</td>
                    <td className="hidden px-4 py-3.5 text-muted md:table-cell">{zone.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-muted">* Доставка работает в пилотном режиме. Точную зону и стоимость подтвердит менеджер при подтверждении заказа.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Оплата</p>
            <h2 className="mt-2.5 text-h2 font-bold text-ink">Как удобно — так и платите</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              Онлайн-оплата проходит через ЮKassa: карты «Мир», Visa, Mastercard, СБП. Данные карты не попадают на наш сервер.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: CreditCard, title: "Картой онлайн", text: "ЮKassa, 3-D Secure, чек на email" },
              { icon: Banknote, title: "При получении", text: "Наличными или картой курьеру и на кассе" },
              { icon: Smartphone, title: "СБП", text: "Оплата по QR-коду в приложении банка" },
              { icon: Check, title: "Бонусами", text: "До 50% суммы заказа, 1 бонус = 1 ₽" },
            ].map((method) => (
              <div key={method.title} className="rounded-2xl border border-line/80 bg-white p-4">
                <method.icon className="h-4 w-4 text-brand-700" />
                <p className="mt-2 text-[12.5px] font-bold">{method.title}</p>
                <p className="mt-0.5 text-[11px] text-muted">{method.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faq items={faq} title="Вопросы о доставке" />
    </>
  );
}
