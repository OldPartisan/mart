"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Monitor,
  Plus,
  Save,
  Smartphone,
  Tablet,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { CmsBlocks, type CmsBlock } from "@/components/cms/cms-blocks";
import { ContentStatusBadge } from "@/components/admin/content-status";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { publishPage, savePage, schedulePage } from "@/app/admin/content/actions";
import { cn } from "@/lib/utils";

type Block = { id?: string; type: string; data: Record<string, unknown>; isVisible?: boolean };
type PageData = {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  publishAt: string;
  unpublishAt: string;
};

const blockTemplates: Record<string, { label: string; data: Record<string, unknown> }> = {
  hero: { label: "Hero", data: { eyebrow: "Заголовок надзаголовка", title: "Большой заголовок", text: "Короткое описание предложения.", ctaLabel: "В каталог", ctaHref: "/catalog", image: "/images/store.jpg", alt: "Ирбис Март" } },
  banner: { label: "Баннер", data: { title: "Заголовок баннера", text: "Текст баннера.", ctaLabel: "Подробнее", ctaHref: "/catalog", image: "/images/store.jpg", alt: "Ирбис Март" } },
  text: { label: "Текст", data: { title: "Заголовок блока", text: "Текст блока. Можно использовать переносы строк." } },
  image: { label: "Фото", data: { image: "/images/store.jpg", alt: "Фотография", caption: "Подпись к фотографии" } },
  faq: { label: "FAQ", data: { title: "Частые вопросы", items: [{ q: "Вопрос", a: "Ответ" }] } },
};

const typeLabels: Record<string, string> = {
  HOME: "Главная",
  PROMOTIONS: "Акции",
  CATALOG: "Каталог",
  CATEGORY: "Категории",
  LANDING: "SEO-лендинг",
};

function str(data: Record<string, unknown>, key: string): string {
  return typeof data[key] === "string" ? (data[key] as string) : "";
}

function toMoscowInput(iso: string): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Moscow",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso)).replace(" ", "T");
}

function fromMoscowInput(value: string): string {
  return new Date(`${value}:00+03:00`).toISOString();
}

function faqText(data: Record<string, unknown>): string {
  const items = Array.isArray(data.items) ? (data.items as Array<{ q?: string; a?: string }>) : [];
  return items.map((item) => `${item.q ?? ""}|${item.a ?? ""}`).join("\n");
}

export function ContentEditor({ page, blocks: initialBlocks, isAdmin }: { page: PageData; blocks: Block[]; isAdmin: boolean }) {
  const router = useRouter();
  const [pageData, setPageData] = useState(page);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selected, setSelected] = useState(0);
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [pending, startTransition] = useTransition();
  const [showSeo, setShowSeo] = useState(false);
  const [publishAt, setPublishAt] = useState(page.publishAt ? toMoscowInput(page.publishAt) : "");
  const [unpublishAt, setUnpublishAt] = useState(page.unpublishAt ? toMoscowInput(page.unpublishAt) : "");
  const selectedBlock = blocks[selected];

  const updatePage = (patch: Partial<PageData>) => setPageData((current) => ({ ...current, ...patch }));
  const updateBlock = (index: number, patch: Partial<Block>) =>
    setBlocks((current) => current.map((block, blockIndex) => (blockIndex === index ? { ...block, ...patch } : block)));
  const updateData = (index: number, key: string, value: unknown) =>
    updateBlock(index, { data: { ...blocks[index].data, [key]: value } });

  const addBlock = (type: string) => {
    setBlocks((current) => [...current, { type, data: structuredClone(blockTemplates[type].data), isVisible: true }]);
    setSelected(blocks.length);
  };
  const removeBlock = (index: number) => {
    setBlocks((current) => current.filter((_, blockIndex) => blockIndex !== index));
    setSelected((current) => Math.max(0, current - (index <= current ? 1 : 0)));
  };
  const moveBlock = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= blocks.length) return;
    setBlocks((current) => {
      const copy = [...current];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
    setSelected(next);
  };

  const save = (submitForReview = false) => {
    startTransition(async () => {
      try {
        await savePage({
          id: pageData.id,
          title: pageData.title,
          slug: pageData.slug,
          type: pageData.type,
          seoTitle: pageData.seoTitle,
          seoDescription: pageData.seoDescription,
          ogImage: pageData.ogImage,
          blocks,
          submitForReview,
        });
        updatePage({ status: submitForReview ? "IN_REVIEW" : "DRAFT" });
        toast.success(submitForReview ? "Отправлено на согласование" : "Черновик сохранён");
        router.refresh();
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  const publish = () => {
    startTransition(async () => {
      try {
        await publishPage(pageData.id);
        updatePage({ status: "PUBLISHED" });
        toast.success("Страница опубликована");
        router.refresh();
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  const schedule = () => {
    if (!publishAt) {
      toast.error("Укажите дату и время публикации");
      return;
    }
    startTransition(async () => {
      try {
        const result = await schedulePage({
          id: pageData.id,
          publishAt: fromMoscowInput(publishAt),
          unpublishAt: unpublishAt ? fromMoscowInput(unpublishAt) : undefined,
        });
        updatePage({ status: result.status });
        setPageData((current) => ({ ...current, publishAt: fromMoscowInput(publishAt), unpublishAt: unpublishAt ? fromMoscowInput(unpublishAt) : "" }));
        toast.success(result.status === "PUBLISHED" ? "Страница опубликована" : "Публикация запланирована");
        router.refresh();
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/admin/content" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-muted hover:text-ink" aria-label="К списку страниц">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold text-ink">{pageData.title || "Без названия"}</h1>
              <ContentStatusBadge status={pageData.status} />
            </div>
            <p className="mt-0.5 text-[11px] text-muted">{typeLabels[pageData.type]} · /p/{pageData.slug}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/content/${pageData.id}/history`} className="btn-secondary h-10 text-[12px]">История</Link>
          <button type="button" onClick={() => setShowSeo((value) => !value)} className="btn-secondary h-10 text-[12px]">
            SEO
          </button>
          <button type="button" onClick={() => save(true)} disabled={pending} className="btn-secondary h-10 text-[12px]">
            На согласование
          </button>
          <button type="button" onClick={() => save(false)} disabled={pending} className="btn-primary h-10 text-[12px]">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Сохранить
          </button>
          {isAdmin && (
            <button type="button" onClick={publish} disabled={pending} className="btn-primary h-10 bg-brand-950 text-[12px] hover:bg-black">
              <Check className="h-4 w-4" /> Опубликовать
            </button>
          )}
        </div>
      </div>

      {showSeo && (
        <div className="mt-4 grid gap-3 rounded-[18px] border border-line bg-white p-4 md:grid-cols-2">
          <label className="text-[11px] font-semibold text-muted">SEO title<input value={pageData.seoTitle} onChange={(event) => updatePage({ seoTitle: event.target.value })} className="field mt-1" /></label>
          <label className="text-[11px] font-semibold text-muted">OG image URL<input value={pageData.ogImage} onChange={(event) => updatePage({ ogImage: event.target.value })} className="field mt-1" /></label>
          <label className="text-[11px] font-semibold text-muted md:col-span-2">SEO description<textarea value={pageData.seoDescription} onChange={(event) => updatePage({ seoDescription: event.target.value })} className="field-area mt-1 min-h-[70px]" /></label>
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_340px]">
        <div className="rounded-[18px] border border-line bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Блоки</p>
            <span className="text-[10px] text-muted">{blocks.length}</span>
          </div>
          <div className="mt-2 space-y-1">
            {blocks.map((block, index) => (
              <button key={block.id ?? index} type="button" onClick={() => setSelected(index)} className={cn("flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[12px] transition", selected === index ? "bg-brand-50 text-brand-900" : "text-ink hover:bg-cream")}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-brand-700">{index + 1}</span>
                <span className="min-w-0 flex-1 truncate">{blockTemplates[block.type]?.label ?? block.type}</span>
                {block.isVisible === false && <EyeOff className="h-3.5 w-3.5 text-muted" />}
              </button>
            ))}
          </div>
          <div className="mt-3 border-t border-line pt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">Добавить блок</p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(blockTemplates).map(([type, template]) => (
                <button key={type} type="button" onClick={() => addBlock(type)} className="flex items-center gap-1 rounded-lg border border-line px-2 py-2 text-[11px] font-semibold text-ink hover:bg-cream">
                  <Plus className="h-3 w-3" /> {template.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Предпросмотр</p>
            <div className="flex rounded-lg border border-line bg-white p-0.5">
              {[{ key: "mobile", icon: Smartphone, label: "Mobile" }, { key: "tablet", icon: Tablet, label: "Tablet" }, { key: "desktop", icon: Monitor, label: "Desktop" }].map((item) => (
                <button key={item.key} type="button" onClick={() => setDevice(item.key as typeof device)} className={cn("flex h-8 items-center gap-1 rounded-md px-2 text-[10px] font-semibold", device === item.key ? "bg-brand-700 text-white" : "text-muted")}>
                  <item.icon className="h-3.5 w-3.5" /> {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-auto rounded-[18px] border border-line bg-[#E9E5DA] p-3">
            <div className="mx-auto overflow-hidden rounded-[14px] bg-white shadow-sm transition-all" style={{ width: device === "mobile" ? 360 : device === "tablet" ? 768 : "100%" }}>
              <div className="max-h-[620px] overflow-y-auto p-3 sm:p-5">
                <CmsBlocks blocks={blocks as CmsBlock[]} preview />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-line bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Настройки</p>
          <div className="mt-3 space-y-3">
            <label className="block text-[11px] font-semibold text-muted">Название<input value={pageData.title} onChange={(event) => updatePage({ title: event.target.value })} className="field mt-1 h-10" /></label>
            <label className="block text-[11px] font-semibold text-muted">Slug<input value={pageData.slug} onChange={(event) => updatePage({ slug: event.target.value })} className="field mt-1 h-10" /></label>
            <label className="block text-[11px] font-semibold text-muted">Тип
              <select value={pageData.type} onChange={(event) => updatePage({ type: event.target.value })} className="field mt-1 h-10">
                {Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            {selectedBlock && (
              <>
                <div className="flex items-center justify-between border-t border-line pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Блок {selected + 1}</p>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => updateBlock(selected, { isVisible: selectedBlock.isVisible === false })} className="flex h-7 w-7 items-center justify-center rounded-md border border-line" aria-label="Скрыть блок">{selectedBlock.isVisible === false ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
                    <button type="button" onClick={() => moveBlock(selected, -1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-line" aria-label="Выше"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => moveBlock(selected, 1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-line" aria-label="Ниже"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => removeBlock(selected)} className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-accent-600" aria-label="Удалить"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                {selectedBlock.type === "hero" && (
                  <label className="block text-[11px] font-semibold text-muted">Надзаголовок<input value={str(selectedBlock.data, "eyebrow")} onChange={(event) => updateData(selected, "eyebrow", event.target.value)} className="field mt-1 h-10" /></label>
                )}
                <label className="block text-[11px] font-semibold text-muted">Заголовок<input value={str(selectedBlock.data, "title")} onChange={(event) => updateData(selected, "title", event.target.value)} className="field mt-1 h-10" /></label>
                {selectedBlock.type === "text" ? (
                  <div className="block text-[11px] font-semibold text-muted">Текст
                    <div className="mt-1"><RichTextEditor value={str(selectedBlock.data, "html") || str(selectedBlock.data, "text")} onChange={(html) => updateData(selected, "html", html)} /></div>
                  </div>
                ) : selectedBlock.type !== "image" ? (
                  <label className="block text-[11px] font-semibold text-muted">Текст<textarea value={str(selectedBlock.data, "text")} onChange={(event) => updateData(selected, "text", event.target.value)} className="field-area mt-1 min-h-[90px]" /></label>
                ) : null}
                {(selectedBlock.type === "hero" || selectedBlock.type === "banner") && (
                  <>
                    <label className="block text-[11px] font-semibold text-muted">CTA<input value={str(selectedBlock.data, "ctaLabel")} onChange={(event) => updateData(selected, "ctaLabel", event.target.value)} className="field mt-1 h-10" /></label>
                    <label className="block text-[11px] font-semibold text-muted">Ссылка<input value={str(selectedBlock.data, "ctaHref")} onChange={(event) => updateData(selected, "ctaHref", event.target.value)} className="field mt-1 h-10" /></label>
                  </>
                )}
                {(selectedBlock.type === "hero" || selectedBlock.type === "banner" || selectedBlock.type === "image") && (
                  <>
                    <label className="block text-[11px] font-semibold text-muted">URL фото<input value={str(selectedBlock.data, "image")} onChange={(event) => updateData(selected, "image", event.target.value)} className="field mt-1 h-10" placeholder="/images/store.jpg" /></label>
                    <label className="block text-[11px] font-semibold text-muted">Alt<input value={str(selectedBlock.data, "alt")} onChange={(event) => updateData(selected, "alt", event.target.value)} className="field mt-1 h-10" /></label>
                  </>
                )}
                {selectedBlock.type === "image" && <label className="block text-[11px] font-semibold text-muted">Подпись<input value={str(selectedBlock.data, "caption")} onChange={(event) => updateData(selected, "caption", event.target.value)} className="field mt-1 h-10" /></label>}
                {selectedBlock.type === "faq" && <label className="block text-[11px] font-semibold text-muted">Вопросы и ответы <span className="font-normal">(по одному на строку: вопрос|ответ)</span><textarea value={faqText(selectedBlock.data)} onChange={(event) => updateData(selected, "items", event.target.value.split("\n").map((line) => { const [q, a] = line.split("|"); return { q: q ?? "", a: a ?? "" }; }))} className="field-area mt-1 min-h-[100px]" /></label>}
              </>
            )}
            {isAdmin && (
              <div className="mt-4 border-t border-line pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Публикация</p>
                <label className="mt-2 block text-[10px] text-muted">Опубликовать (Москва)
                  <input type="datetime-local" value={publishAt} onChange={(event) => setPublishAt(event.target.value)} className="field mt-1 h-9 text-[11px]" />
                </label>
                <label className="mt-2 block text-[10px] text-muted">Снять с публикации (опционально)
                  <input type="datetime-local" value={unpublishAt} onChange={(event) => setUnpublishAt(event.target.value)} className="field mt-1 h-9 text-[11px]" />
                </label>
                <button type="button" onClick={schedule} disabled={pending} className="btn-secondary mt-2 h-9 w-full text-[11px]">Запланировать</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
