import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { getDb } from "@/db";
import { contentRevisions, pages } from "@/db/schema";
import { restoreRevision } from "@/app/admin/content/actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  if (!page) notFound();
  const revisions = await db.select().from(contentRevisions).where(eq(contentRevisions.pageId, id)).orderBy(desc(contentRevisions.createdAt));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link href={`/admin/content/${id}`} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> К редактору</Link>
      <h1 className="mt-3 text-2xl font-bold">История версий</h1>
      <p className="mt-1 text-[13px] text-muted">{page.title} · /p/{page.slug}</p>
      <div className="mt-6 overflow-hidden rounded-[18px] border border-line bg-white">
        {revisions.length === 0 && <p className="p-6 text-[13px] text-muted">Версий пока нет. Сохраните страницу — появится первая версия.</p>}
        {revisions.map((revision) => (
          <div key={revision.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-0">
            <div>
              <p className="text-[13px] font-semibold">{revision.note ?? "Версия"}</p>
              <p className="text-[11px] text-muted">{formatDate(revision.createdAt)}</p>
            </div>
            <form action={async () => { "use server"; await restoreRevision(revision.id); }}>
              <button type="submit" className="btn-secondary h-9 text-[11px]"><RotateCcw className="h-3.5 w-3.5" /> Восстановить</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
