import type { Metadata } from "next";
import Link from "next/link";
import { Car, Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";
import { ContactForm } from "@/components/content/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Адрес «Ирбис Март»: с. Новая Тура, ул. Совхозная, 1. Телефон, часы работы, карта проезда и форма обратной связи.",
  alternates: { canonical: "/contacts" },
  openGraph: { title: "Контакты — Ирбис Март", description: "Новая Тура, ул. Совхозная, 1. Ежедневно 08:00–23:00.", url: "/contacts", images: ["/images/store.jpg"] },
};

const mapSrc = `https://yandex.ru/map-widget/v1/?ll=${site.coords.lng}%2C${site.coords.lat}&z=16&pt=${site.coords.lng},${site.coords.lat},pm2rdm`;

export default function ContactsPage() {
  return (
    <>
      <PageHero
        eyebrow="Контакты"
        title="Мы в Новой Туре, на трассе М-7"
        description="15 минут от Казани и Зеленодольска. Своя парковка, отдельный вход в кафе и стойка самовывоза."
        crumbs={[{ label: "Контакты" }]}
        image="/images/figma/tile-market.webp"
        imageAlt="Торговый зал Ирбис Март"
      />

      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            {[
              { icon: MapPin, title: "Адрес", text: site.addressFull, href: `https://yandex.ru/maps/?pt=${site.coords.lng},${site.coords.lat}&z=16` },
              { icon: Phone, title: "Телефон", text: site.phone, href: site.phoneHref },
              { icon: Mail, title: "Email", text: site.email, href: `mailto:${site.email}` },
              { icon: Clock, title: "Часы работы", text: `Магазин: ${site.hours}. Кафе: ${site.cafeHours}.` },
              { icon: Car, title: "Парковка", text: "Бесплатная, 80 мест, зарядка для электромобилей. Въезд с трассы." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-line/80 bg-white p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-800"><item.icon className="h-4 w-4" /></span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener" className="mt-0.5 block text-[13px] font-semibold text-ink hover:text-brand-800">
                      {item.text}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-[13px] font-semibold text-ink">{item.text}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              <a href={site.social.vk} target="_blank" rel="noreferrer noopener" className="btn-secondary btn-sm">VK</a>
              <a href={site.social.telegram} target="_blank" rel="noreferrer noopener" className="btn-secondary btn-sm"><Send className="h-3.5 w-3.5" /> Telegram</a>
              <Link href="/delivery" className="btn-secondary btn-sm"><MessageCircle className="h-3.5 w-3.5" /> Доставка</Link>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-brand-100">
            <iframe src={mapSrc} title="Ирбис Март на карте" className="absolute inset-0 h-full w-full" loading="lazy" allowFullScreen />
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
          <div>
            <p className="eyebrow">Обратная связь</p>
            <h2 className="mt-2.5 text-h2 font-bold text-ink">Напишите нам</h2>
            <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-muted">
              Вопрос по заказу, отзыв о продукте или предложение от фермера — читаем всё. Отвечаем в рабочие часы,
              обычно в течение дня.
            </p>
            <div className="mt-5 rounded-2xl bg-white p-4 text-[12px] leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">Для быстрых вопросов по заказу</p>
              <p className="mt-1">Позвоните на стойку самовывоза: <a href={site.phoneHref} className="font-semibold text-brand-800">{site.phone}</a>. Номер заказа ускорит ответ.</p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-line/80 bg-white p-5 sm:p-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
