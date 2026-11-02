import { ChevronDown } from "lucide-react";

export function Faq({ items, title = "Частые вопросы" }: { items: Array<{ q: string; a: string }>; title?: string }) {
  return (
    <section className="section bg-white">
      <div className="container-x grid gap-8 lg:grid-cols-[0.6fr_1fr]">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-2.5 text-h2 font-bold text-ink">{title}</h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
            Не нашли ответ? Позвоните на стойку самовывоза или напишите в Telegram — отвечаем в рабочие часы.
          </p>
        </div>
        <div className="divide-y divide-line/70 border-y border-line/70">
          {items.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold text-ink marker:hidden">
                {item.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-2.5 pr-8 text-[13px] leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
