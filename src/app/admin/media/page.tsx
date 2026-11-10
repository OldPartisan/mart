import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { media } from "@/db/schema";
import { MediaUploader } from "@/components/admin/media-uploader";

export const dynamic = "force-dynamic";
export const metadata = { title: "Медиа" };

export default async function MediaPage() {
  const db = await getDb();
  const rows = await db.select().from(media).orderBy(desc(media.createdAt)).limit(60);
  const configured = Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY);
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">Хранилище</p>
      <h1 className="mt-1 text-2xl font-bold text-ink">Медиа</h1>
      <p className="mt-1 max-w-2xl text-[13px] text-muted">S3-совместимое хранилище. Локальные файлы на Vercel не переживают деплой.</p>
      <MediaUploader configured={configured} />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {rows.map((item) => (
          <figure key={item.id} className="overflow-hidden rounded-xl border border-line bg-white">
            <img src={item.url} alt={item.alt ?? ""} className="aspect-square w-full object-cover" />
            <figcaption className="truncate p-2 text-[10px] text-muted">{item.alt || item.key}</figcaption>
          </figure>
        ))}
      </div>
      {rows.length === 0 && <p className="mt-6 rounded-[18px] border border-dashed border-line bg-white p-8 text-center text-[13px] text-muted">Загрузок пока нет.</p>}
    </div>
  );
}
