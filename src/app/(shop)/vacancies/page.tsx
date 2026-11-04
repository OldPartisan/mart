import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Heart, MapPin, Users } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Вакансии",
  description: "Работа в «Ирбис Март» в Новой Туре: продавцы, пекари, повара, курьеры. Официальное трудоустройство, смены рядом с домом.",
  alternates: { canonical: "/vacancies" },
};

const jobs = [
  { title: "Продавец-кассир", type: "Смены 2/2", salary: "от 45 000 ₽", text: "Работа с покупателями, касса, выкладка. Обучим стандартам сервиса и продукту." },
  { title: "Пекарь", type: "Смены 5/2", salary: "от 60 000 ₽", text: "Хлеб на закваске, выпечка. Нужен опыт от года и любовь к ремеслу." },
  { title: "Повар холодного цеха", type: "Смены 2/2", salary: "от 55 000 ₽", text: "Салаты, закуски, боулы. Работа с собственным производством без полуфабрикатов." },
  { title: "Курьер", type: "Гибкий график", salary: "от 50 000 ₽", text: "Доставка по ближним посёлкам на автомобиле компании. Права категории B." },
];

export default function VacanciesPage() {
  return (
    <>
      <PageHero
        eyebrow="Команда"
        title="Работа рядом с домом — в Новой Туре"
        description="Мы собираем команду загородного супермаркета: без ночных смен, с обучением и скидками для сотрудников."
        crumbs={[{ label: "Вакансии" }]}
        image="/images/cafe-interior.jpg"
        imageAlt="Команда Ирбис Март"
      />

      <section className="section">
        <div className="container-x grid gap-3 md:grid-cols-2">
          {jobs.map((job) => (
            <article key={job.title} className="rounded-3xl border border-line/80 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-xl font-bold">{job.title}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-muted"><Clock className="h-3.5 w-3.5" /> {job.type}</p>
                </div>
                <span className="badge-green">{job.salary}</span>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-muted">{job.text}</p>
              <a href={`mailto:hr@irbis-mart.ru?subject=${encodeURIComponent(`Вакансия: ${job.title}`)}`} className="link-underline mt-4">
                Откликнуться <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>

        <div className="container-x mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Heart, title: "Забота", text: "Питание, скидки, форма и обучение за счёт компании." },
            { icon: Users, title: "Команда", text: "Небольшие смены, наставник в первые недели." },
            { icon: MapPin, title: "Рядом", text: "Новая Тура, удобный въезд с М-7, парковка." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-cream p-4">
              <item.icon className="h-4 w-4 text-brand-900" />
              <p className="mt-2 text-[12.5px] font-bold">{item.title}</p>
              <p className="mt-0.5 text-[11.5px] text-muted">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="container-x mt-6 rounded-2xl bg-brand-700 p-5 text-white sm:flex sm:items-center sm:justify-between">
          <p className="text-[13px]">Не нашли подходящую вакансию? Присылайте резюме — вернёмся, когда появится место.</p>
          <a href="mailto:hr@irbis-mart.ru" className="mt-3 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-[12px] font-bold text-brand-900 sm:mt-0">
            hr@irbis-mart.ru <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    </>
  );
}
