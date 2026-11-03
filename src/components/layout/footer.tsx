import Link from "next/link";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import { NewsletterForm } from "./newsletter-form";

function Column({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <h3 className="mb-3 text-[13px] font-semibold text-ink">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-[13px] text-muted transition-colors hover:text-brand-900">
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
    <footer className="mt-4 bg-[#F3F3F3]">
      <div className="container-x py-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_2.4fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-muted">
              Свежие фермерские продукты и собственная продукция ГК IRBIS. Готовая еда, кафе и самовывоз
              на трассе М-7 у Новой Туры.
            </p>
            <div className="mt-4 space-y-2 text-[12.5px]">
              <a href={site.phoneHref} className="flex items-center gap-2 font-semibold text-ink hover:text-brand-900">
                <Phone className="h-3.5 w-3.5 text-brand-900" /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-muted hover:text-ink">
                <Mail className="h-3.5 w-3.5 text-brand-900" /> {site.email}
              </a>
              <p className="flex items-start gap-2 text-muted">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-900" /> {site.address}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <Column
              title="Партнерам"
              links={[
                { href: "/contacts", label: "Поставщикам" },
                { href: "/contacts", label: "Помещения в аренду" },
                { href: "/contacts", label: "Партнерская программа" },
              ]}
            />
            <Column
              title="Покупателям"
              links={[
                { href: "/quality", label: "Система качества" },
                { href: "/loyalty", label: "Программа лояльности" },
                { href: "/promotions", label: "Акции" },
                { href: "/about", label: "О нас" },
              ]}
            />
            <Column
              title="Помощь"
              links={[
                { href: "/legal/privacy", label: "Правовая информация" },
                { href: "/delivery", label: "Доставка и оплата" },
                { href: "/pickup", label: "Самовывоз" },
                { href: "/contacts", label: "Контакты" },
              ]}
            />
            <div>
              <h3 className="mb-3 text-[13px] font-semibold text-ink">Горячая линия</h3>
              <p className="text-[13px] leading-relaxed text-muted">Ежедневно с 9:00 до 22:00</p>
              <a href={site.phoneHref} className="mt-1 block text-[13px] font-semibold text-ink">
                {site.phone}
              </a>
              <Link
                href="/contacts"
                className="mt-3 inline-flex h-10 items-center rounded-lg bg-brand-900 px-4 text-[12px] font-semibold text-white transition hover:bg-brand-950"
              >
                Написать нам
              </Link>
              <div className="mt-4 flex gap-2">
                <a href={site.social.vk} target="_blank" rel="noreferrer noopener" className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold text-ink" aria-label="VK">
                  VK
                </a>
                <a href={site.social.telegram} target="_blank" rel="noreferrer noopener" className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink" aria-label="Telegram">
                  <Send className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-5">
          <div className="grid gap-5 sm:grid-cols-[1fr_320px] sm:items-center">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted">
              <span>© 2026 ГК IRBIS. Супермаркет «Ирбис Март».</span>
              <Link href="/legal/privacy" className="hover:text-ink">Политика конфиденциальности</Link>
              <Link href="/legal/terms" className="hover:text-ink">Пользовательское соглашение</Link>
              <Link href="/legal/offer" className="hover:text-ink">Оферта</Link>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold text-ink">Акции и новинки на почту</p>
              <NewsletterForm compact />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {["Мир", "Visa", "Mastercard", "СБП", "ЮKassa"].map((method) => (
              <span key={method} className="rounded border border-line bg-white px-2 py-1 text-[9px] font-semibold text-muted">
                {method}
              </span>
            ))}
            <span className="ml-auto text-[9.5px] text-muted">Цены в рублях. Фото — иллюстрации.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
