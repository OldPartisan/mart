import Link from "next/link";
import { ArrowUpRight, Car, Clock, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";

const mapSrc = `https://yandex.ru/map-widget/v1/?ll=${site.coords.lng}%2C${site.coords.lat}&z=16&pt=${site.coords.lng},${site.coords.lat},pm2rdm`;

export function MapBlock() {
  return (
    <section className="bg-white py-10 sm:py-12" id="map">
      <div className="container-x grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-between rounded-[18px] border border-line bg-white p-6 sm:p-8">
          <div>
            <p className="eyebrow">Как нас найти</p>
            <h2 className="mt-2 font-display text-[26px] font-normal tracking-[-0.02em] text-ink sm:text-[32px]">Новая Тура, трасса М-7</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              15 минут от Казани и Зеленодольска. Своя парковка, удобный въезд с трассы, отдельный вход в кафе.
            </p>

            <div className="mt-6 space-y-4 text-[13px]">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-900" />
                <span className="font-semibold text-ink">{site.addressFull}</span>
              </p>
              <p className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-900" />
                <span>
                  Магазин: {site.hours}
                  <br />
                  Кафе: {site.cafeHours}
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-900" />
                <a href={site.phoneHref} className="font-semibold text-ink hover:text-brand-900">
                  {site.phone}
                </a>
              </p>
              <p className="flex items-start gap-3">
                <Car className="mt-0.5 h-4 w-4 shrink-0 text-brand-900" />
                <span>Бесплатная парковка на 80 мест, зарядка для электромобилей</span>
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={`https://yandex.ru/maps/?rtext=~${site.coords.lat},${site.coords.lng}&rtt=auto`}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-primary btn-sm"
            >
              Построить маршрут <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <Link href="/contacts" className="btn-secondary btn-sm">
              Контакты
            </Link>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden rounded-[18px] bg-cream">
          <iframe
            src={mapSrc}
            title="Ирбис Март на карте — с. Новая Тура, ул. Совхозная, 1"
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allowFullScreen
          />
          <div className="pointer-events-none absolute left-4 top-4 rounded-xl bg-white/95 px-4 py-2.5 shadow-card backdrop-blur">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Ирбис Март</p>
            <p className="text-[12px] font-semibold text-ink">Совхозная, 1 · Новая Тура</p>
          </div>
        </div>
      </div>
    </section>
  );
}
