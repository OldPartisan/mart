import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Download, Info, ShieldCheck, Smartphone } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";

export const metadata: Metadata = {
  title: "Мобильное приложение",
  description: "Тестовое Android-приложение «Ирбис Март»: каталог, корзина, самовывоз, доставка и бонусы. Скачать APK.",
  alternates: { canonical: "/app" },
};

const APK = "/downloads/irbis-mart-1.0.0-debug.apk";

export default function AppPage() {
  return (
    <>
      <PageHero
        eyebrow="Мобильное приложение"
        title="Ирбис Март в кармане"
        description="Тестовая Android-сборка сайта: тот же каталог, корзина, самовывоз, доставка и бонусный счёт — в отдельном приложении."
        crumbs={[{ label: "Мобильное приложение" }]}
      />

      <section className="bg-white py-8 sm:py-10">
        <div className="container-x grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[18px] bg-brand-700 p-6 text-white sm:p-8">
            <Smartphone className="h-6 w-6" />
            <h2 className="mt-4 font-display text-[28px] font-extrabold uppercase leading-none sm:text-[36px]">Android APK</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-white/85">
              Debug-сборка для тестирования. Не опубликована в Google Play, устанавливается вручную.
            </p>
            <dl className="mt-5 grid grid-cols-3 gap-2 text-[11px]">
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                <dt className="text-white/60">Версия</dt><dd className="mt-1 font-semibold">1.0.0</dd>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                <dt className="text-white/60">Android</dt><dd className="mt-1 font-semibold">6.0+</dd>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                <dt className="text-white/60">Размер</dt><dd className="mt-1 font-semibold">4,5 МБ</dd>
              </div>
            </dl>
            <a
              href={APK}
              download
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 text-[14px] font-semibold text-brand-900 transition hover:bg-cream"
            >
              <Download className="h-4 w-4" /> Скачать APK
            </a>
            <p className="mt-2 text-[10px] text-white/50">SHA-256: 90ce6510…1d8c1d · debug-подпись</p>
          </div>

          <div className="rounded-[18px] border border-line bg-[#F7F8F9] p-6">
            <h2 className="font-display text-xl font-bold">Что внутри</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                "каталог, поиск и карточки товаров",
                "корзина и оформление заказа",
                "самовывоз и доставка",
                "программа лояльности и бонусы",
                "личный кабинет и история заказов",
                "акции, кафе и фермерская полка",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white pb-10">
        <div className="container-x grid gap-4 md:grid-cols-3">
          {[
            { icon: Download, title: "Скачайте APK", text: "Откройте ссылку на Android-устройстве и скачайте файл." },
            { icon: ShieldCheck, title: "Разрешите установку", text: "Настройки → Безопасность → Установка неизвестных приложений для браузера." },
            { icon: Smartphone, title: "Откройте приложение", text: "Найдите «Ирбис Март» на рабочем столе и войдите в аккаунт." },
          ].map((step, index) => (
            <div key={step.title} className="rounded-[18px] border border-line p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-[12px] font-bold text-white">{index + 1}</span>
              <step.icon className="mt-4 h-4 w-4 text-brand-700" />
              <p className="mt-1.5 text-[13px] font-bold">{step.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="container-x mt-4">
          <div className="flex items-start gap-2 rounded-xl bg-accent-50 p-4 text-[12px] text-accent-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Это тестовая debug-сборка: возможны предупреждения Play Protect. Для production нужен подписанный release APK / AAB
              и публикация в RuStore или Google Play. Приложение открывает <Link href="/" className="underline">irbis-mart.vercel.app</Link> внутри нативного WebView.
            </p>
          </div>
          <Link href="/" className="link-underline mt-5 inline-flex">Вернуться на сайт <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      </section>
    </>
  );
}
