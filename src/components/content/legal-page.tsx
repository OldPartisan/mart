import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export type LegalSection = { id: string; title: string; body: string[]; list?: string[] };

export function LegalPage({
  title,
  subtitle,
  updated,
  sections,
}: {
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="bg-[#FBF8F1]">
      <div className="border-b border-line/70 bg-cream">
        <div className="container-x py-8">
          <Breadcrumbs items={[{ label: title }]} />
          <h1 className="mt-3 text-h1 font-bold text-ink">{title}</h1>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">{subtitle}</p>
          <p className="mt-3 text-[11px] text-muted">Редакция от {updated}</p>
        </div>
      </div>

      <div className="container-x grid gap-10 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[150px] rounded-2xl border border-line/80 bg-white p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">Содержание</p>
            <ol className="space-y-1.5">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-[11.5px] leading-snug text-ink-soft hover:text-brand-800">
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <article className="max-w-3xl">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="mb-8 scroll-mt-40">
              <h2 className="font-display text-xl font-bold text-ink">
                {index + 1}. {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 50)} className="mt-2.5 text-[13px] leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-ink-soft">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="rounded-2xl border border-line bg-white p-5 text-[12px] leading-relaxed text-muted">
            <p>
              По вопросам обработки персональных данных и работы сайта:{" "}
              <Link href="/contacts" className="font-semibold text-brand-800">форма обратной связи</Link> или{" "}
              <a href="mailto:hello@irbis-mart.ru" className="font-semibold text-brand-800">hello@irbis-mart.ru</a>.
            </p>
            <p className="mt-2">Документ является шаблоном и перед публикацией требует проверки юристом.</p>
          </div>
        </article>
      </div>
    </div>
  );
}
