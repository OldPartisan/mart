"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "description", label: "Описание" },
  { id: "composition", label: "Состав" },
  { id: "storage", label: "Хранение" },
  { id: "producer", label: "Производитель" },
];

export function ProductDetails({
  description,
  composition,
  storage,
  producer,
}: {
  description: string;
  composition: string | null;
  storage: string | null;
  producer: string | null;
}) {
  const [active, setActive] = useState("description");
  const content = {
    description: <p>{description}</p>,
    composition: <p>{composition ?? "Состав уточняйте на упаковке или у консультанта в магазине."}</p>,
    storage: <p>{storage ?? "Условия хранения указаны на упаковке."}</p>,
    producer: <p>{producer ?? "Произведено в супермаркете «Ирбис Март», с. Новая Тура."}</p>,
  }[active];

  return (
    <div className="min-w-0 rounded-3xl border border-line/80 bg-white">
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line/80 p-2" role="tablist" aria-label="Информация о товаре">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            aria-selected={active === tab.id}
            role="tab"
            aria-controls={`product-panel-${tab.id}`}
            id={`product-tab-${tab.id}`}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition",
              active === tab.id ? "bg-brand-900 text-cream" : "text-ink-soft hover:bg-cream",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div id={`product-panel-${active}`} role="tabpanel" aria-labelledby={`product-tab-${active}`} className="prose-irbis min-h-[120px] p-5 text-[14px] leading-relaxed text-ink-soft sm:p-6">{content}</div>
    </div>
  );
}

export function ProductAccordion({ items }: { items: Array<{ title: string; content: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line/70 rounded-3xl border border-line/80 bg-white">
      {items.map((item, index) => (
        <div key={item.title}>
          <button
            type="button"
            onClick={() => setOpen(open === index ? null : index)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[13.5px] font-semibold text-ink"
            aria-expanded={open === index}
          >
            {item.title}
            <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open === index && "rotate-180")} />
          </button>
          {open === index && <p className="px-5 pb-4 text-[13px] leading-relaxed text-muted">{item.content}</p>}
        </div>
      ))}
    </div>
  );
}
