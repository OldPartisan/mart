import Link from "next/link";
import { ArrowRight } from "lucide-react";
import sanitizeHtml from "sanitize-html";

export type CmsBlockData = Record<string, unknown>;
export type CmsBlock = {
  id?: string;
  type: string;
  data: CmsBlockData;
  isVisible?: boolean;
  sortOrder?: number;
};

const text = (data: CmsBlockData, key: string, fallback = "") =>
  typeof data[key] === "string" ? (data[key] as string) : fallback;

export function CmsBlocks({ blocks, preview = false }: { blocks: CmsBlock[]; preview?: boolean }) {
  const visible = blocks.filter((block) => block.isVisible !== false);
  if (!visible.length) {
    return (
      <div className="rounded-[18px] border border-dashed border-line bg-[#F7F8F9] p-10 text-center text-[13px] text-muted">
        В этой странице пока нет блоков.
      </div>
    );
  }

  return (
    <div className={preview ? "space-y-4" : "space-y-6"}>
      {visible.map((block, index) => {
        if (block.type === "hero") {
          const image = text(block.data, "image");
          return (
            <section key={block.id ?? index} className="relative overflow-hidden rounded-[18px] bg-brand-700 text-white">
              {image && <img src={image} alt={text(block.data, "alt")} className="absolute inset-0 h-full w-full object-cover opacity-30" />}
              <div className="relative z-10 max-w-2xl px-6 py-10 sm:px-10 lg:py-16">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">{text(block.data, "eyebrow")}</p>
                <h1 className="mt-3 font-display text-[36px] font-extrabold uppercase leading-[0.98] sm:text-[52px]">{text(block.data, "title")}</h1>
                <p className="mt-4 text-[16px] leading-relaxed text-white/90 sm:text-[18px]">{text(block.data, "text")}</p>
                {text(block.data, "ctaLabel") && (
                  <Link href={text(block.data, "ctaHref", "/catalog")} className="mt-6 inline-flex h-12 items-center gap-2 rounded-lg bg-accent-500 px-6 text-[14px] font-semibold text-white">
                    {text(block.data, "ctaLabel")} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </section>
          );
        }

        if (block.type === "banner") {
          const image = text(block.data, "image");
          return (
            <section key={block.id ?? index} className="relative overflow-hidden rounded-[18px] bg-brand-700 px-6 py-8 text-white sm:px-10">
              {image && <img src={image} alt={text(block.data, "alt")} className="absolute inset-0 h-full w-full object-cover opacity-25" />}
              <div className="relative z-10 max-w-xl">
                <h2 className="font-display text-[28px] font-bold leading-tight">{text(block.data, "title")}</h2>
                <p className="mt-2 text-[14px] text-white/85">{text(block.data, "text")}</p>
                {text(block.data, "ctaLabel") && (
                  <Link href={text(block.data, "ctaHref", "/catalog")} className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-[13px] font-semibold text-brand-900">
                    {text(block.data, "ctaLabel")} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </section>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={block.id ?? index} className="overflow-hidden rounded-[18px] border border-line bg-white">
              {text(block.data, "image") && (
                <img src={text(block.data, "image")} alt={text(block.data, "alt")} className="max-h-[520px] w-full object-cover" />
              )}
              {text(block.data, "caption") && <figcaption className="px-5 py-3 text-[12px] text-muted">{text(block.data, "caption")}</figcaption>}
            </figure>
          );
        }

        if (block.type === "faq") {
          const items = Array.isArray(block.data.items) ? (block.data.items as Array<{ q?: string; a?: string }>) : [];
          return (
            <section key={block.id ?? index} className="rounded-[18px] border border-line bg-white p-6">
              <h2 className="font-display text-[26px] font-bold">{text(block.data, "title", "Вопросы и ответы")}</h2>
              <div className="mt-4 divide-y divide-line">
                {items.map((item, itemIndex) => (
                  <details key={itemIndex} className="py-3">
                    <summary className="cursor-pointer text-[14px] font-semibold">{item.q}</summary>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          );
        }

        const html = text(block.data, "html");
        return (
          <section key={block.id ?? index} className="rounded-[18px] border border-line bg-white p-6">
            <h2 className="font-display text-[30px] font-bold leading-tight">{text(block.data, "title")}</h2>
            {html ? (
              <div
                className="prose-irbis mt-3 text-[15px] leading-relaxed text-ink-soft"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(html, { allowedTags: ["p", "br", "strong", "em", "s", "ul", "ol", "li", "h2", "h3", "a", "blockquote"], allowedAttributes: { a: ["href", "target", "rel"] } }) }}
              />
            ) : text(block.data, "text") ? (
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{text(block.data, "text")}</p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
