import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { footerNav, site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import { NewsletterForm } from "./newsletter-form";

function FooterColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-cream/50">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-[13px] text-cream/80 transition-colors hover:text-accent-300">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-cream">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-800/30 blur-3xl" />
      <div className="container-x relative">
        <div className="grid gap-10 py-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo inverted />
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-cream/60">
              Свежие фермерские продукты и собственная продукция ГК IRBIS прямо от производителя. Готовая еда, кафе и
              самовывоз на трассе М-7 у Новой Туры.
            </p>

            <div className="mt-6 space-y-2.5 text-[13px]">
              <a href={site.phoneHref} className="flex items-center gap-2.5 font-semibold text-cream transition-colors hover:text-accent-300">
                <Phone className="h-4 w-4 text-accent-400" /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 text-cream/75 transition-colors hover:text-cream">
                <Mail className="h-4 w-4 text-accent-400" /> {site.email}
              </a>
              <p className="flex items-start gap-2.5 text-cream/75">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" /> {site.addressFull}
              </p>
              <p className="flex items-center gap-2.5 text-cream/75">
                <Clock className="h-4 w-4 text-accent-400" /> Магазин {site.hours} · Кафе {site.cafeHours}
              </p>
            </div>

            <div className="mt-6 flex gap-2">
              <a
                href={site.social.vk}
                target="_blank"
                rel="noreferrer noopener"
                className="flex h-10 items-center gap-2 rounded-full border border-cream/20 px-3.5 text-[12px] font-semibold text-cream/80 transition hover:border-cream/40 hover:text-cream"
              >
                VK
              </a>
              <a
                href={site.social.telegram}
                target="_blank"
                rel="noreferrer noopener"
                className="flex h-10 items-center gap-2 rounded-full border border-cream/20 px-3.5 text-[12px] font-semibold text-cream/80 transition hover:border-cream/40 hover:text-cream"
              >
                <Send className="h-3.5 w-3.5" /> Telegram
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
            <FooterColumn title="Магазин" links={footerNav.shop} />
            <FooterColumn title="Помощь" links={footerNav.help} />
            <FooterColumn title="Компания" links={footerNav.about} />
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold">Письма с полки</h3>
            <p className="mb-3 mt-1.5 text-[12px] leading-relaxed text-cream/55">
              Акции, новинки и рецепты от нашего шефа. Раз в неделю, без спама.
            </p>
            <NewsletterForm compact />
            <div className="mt-6 rounded-2xl border border-cream/15 bg-cream/5 p-4">
              <p className="text-[11px] uppercase tracking-wider text-cream/45">Самовывоз</p>
              <p className="mt-1 text-[13px] font-semibold">Заказ готов через 2 часа</p>
              <p className="mt-1 text-[11px] text-cream/55">Храним {site.pickupStorage} · бесплатно</p>
              <Link href="/pickup" className="mt-2.5 inline-block text-[12px] font-semibold text-accent-300 hover:text-accent-200">
                Как это работает →
              </Link>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-cream/10" />

        <div className="flex flex-col gap-4 py-6 text-[11px] text-cream/45 lg:flex-row lg:items-center lg:justify-between">
          <p>© 2026 {site.legalName}. Супермаркет «Ирбис Март». Все права защищены.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/legal/privacy" className="transition-colors hover:text-cream">
              Политика конфиденциальности
            </Link>
            <Link href="/legal/terms" className="transition-colors hover:text-cream">
              Пользовательское соглашение
            </Link>
            <Link href="/legal/offer" className="transition-colors hover:text-cream">
              Оферта
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pb-8">
          {["Мир", "Visa", "Mastercard", "СБП", "ЮKassa"].map((method) => (
            <span key={method} className="rounded-md border border-cream/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-cream/55">
              {method}
            </span>
          ))}
          <span className="ml-auto text-[10px] text-cream/35">Цены указаны в рублях. Фото — иллюстрации.</span>
        </div>
      </div>
    </footer>
  );
}
