import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { getDb } from "@/db";
import { pages } from "@/db/schema";
import { ContentStatusBadge } from "@/components/admin/content-status";

export const dynamic = "force-dynamic";
export const metadata = { title: "Контент" };

const typeLabels: Record<string, string> = {
  HOME: "Главная",
  PROMOTIONS: "Акции",
  CATALOG: "Каталог",
  CATEGORY: "Категории",
  LANDING: "SEO-лендинг",
};

export default async function AdminContentPage() {
  const db = await getDb();
  const rows = await db.select().from(pages).orderBy(pages.type, pages.title);
  const home = rows.find((page) => page.slug === "home");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">CMS</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">Контент</h1>
          <p className="mt-1 text-[13px] text-muted">Страницы, блоки и SEO. Публикация — только администратором.</p>
        </div>
        {home && (
          <Link href={`/admin/content/${home.id}`} className="btn-primary h-11 text-[13px]">
            <Plus className="h-4 w-4" /> Редактировать главную
          </Link>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-[18px] border border-line bg-white">
        <div className="hidden grid-cols-[1.4fr_0.8fr_0.7fr_0.8fr_40px] gap-3 border-b border-line bg-[#F7F8F9] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted md:grid">
          <span>Страница</span><span>Тип</span><span>Статус</span><span>Обновлено</span><span />
        </div>
        {rows.map((page) => (
          <Link key={page.id} href={`/admin/content/${page.id}`} className="grid gap-1 border-b border-line px-4 py-3 text-[12px] transition last:border-0 hover:bg-cream/60 md:grid-cols-[1.4fr_0.8fr_0.7fr_0.8fr_40px] md:items-center md:gap-3">
            <span className="flex min-w-0 items-center gap-2 font-semibold text-ink">
              <FileText className="h-4 w-4 shrink-0 text-brand-700" />
              <span className="truncate">{page.title}</span>
              <span className="truncate text-[10px] font-normal text-muted">/{page.slug === "home" ? "" : `p/${page.slug}`}</span>
            </span>
            <span className="text-muted">{typeLabels[page.type] ?? page.type}</span>
            <ContentStatusBadge status={page.status} />
            <span className="text-[11px] text-muted">{page.updatedAt.toLocaleDateString("ru-RU")}</span>
            <span className="text-right text-muted">→</span>
          </Link>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-muted">
        SEO-лендинги доступны по адресу <code>/p/&lt;slug&gt;</code>. Главная, акции, каталог и категории подключим к рендеру блоков следующим шагом.
      </p>
    </div>
  );
}
