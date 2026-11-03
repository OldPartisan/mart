import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Thermometer, Timer, Undo2 } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";

export const metadata: Metadata = {
  title: "Гарантия качества",
  description: "Как «Ирбис Март» проверяет продукты и что делать, если покупка не понравилась. Заменим или вернём деньги.",
  alternates: { canonical: "/quality" },
};

export default function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Гарантия"
        title="Если продукт не понравился — заменим или вернём деньги"
        description="Мы отвечаем за то, что стоит на полке. Без анкет, споров и «докажите, что это вы». Достаточно чека."
        crumbs={[{ label: "Гарантия качества" }]}
      />

      <section className="section">
        <div className="container-x grid gap-4 md:grid-cols-3">
          {[
            { icon: Undo2, title: "Вернём стоимость", text: "Если продукт оказался не свежим или не тем, что вы ожидали, — вернём деньги или заменим." },
            { icon: ShieldCheck, title: "Проверяем партии", text: "Каждая поставка проходит приёмку по температуре, срокам и документам. Молоко — на кислотность." },
            { icon: Thermometer, title: "Держим холод", text: "Холодильные витрины, камеры и транспорт с контролем температуры. Журнал проверок — ежедневно." },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-line/80 bg-white p-5">
              <item.icon className="h-5 w-5 text-brand-900" />
              <p className="mt-3 font-display text-lg font-bold">{item.title}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Что делать</p>
            <h2 className="mt-2.5 text-h2 font-bold text-ink">Три шага, если что-то не так</h2>
            <ol className="mt-5 space-y-4">
              {[
                { title: "Покажите чек", text: "На кассе или напишите нам — номер заказа тоже подойдёт." },
                { title: "Опишите проблему", text: "Фото или короткое сообщение. Не нужно везти продукт обратно, если он испорчен." },
                { title: "Получите замену или возврат", text: "Возврат на карту — до 3 рабочих дней, наличными — сразу на кассе." },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-900 text-[12px] font-bold text-cream">{index + 1}</span>
                  <div>
                    <p className="text-[13px] font-bold">{step.title}</p>
                    <p className="mt-0.5 text-[12px] text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/contacts" className="btn-primary btn-sm mt-5">Написать нам <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="rounded-[2rem] bg-white p-6">
            <p className="eyebrow">Сроки</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Что и когда проверяем</h2>
            <ul className="mt-4 space-y-3">
              {[
                { icon: Timer, title: "Молочная", text: "Новая партия — каждое утро. Остатки с истекающим сроком убираем с полки." },
                { icon: Timer, title: "Выпечка", text: "Пять выпечек в день. Вечерняя полка обновляется к 18:00." },
                { icon: Timer, title: "Кухня", text: "Витрина обновляется каждые 3 часа; готовые блюда — не дольше 12 часов." },
                { icon: Check, title: "Фермерское", text: "Каждая поставка — с документами. Яйца и молоко проверяем на месте." },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-900" />
                  <div>
                    <p className="text-[12.5px] font-semibold">{item.title}</p>
                    <p className="text-[11.5px] text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
