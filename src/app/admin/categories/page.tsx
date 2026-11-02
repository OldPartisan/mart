import Image from "next/image";
import { FolderTree, Trash2 } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";
import { Flash } from "@/components/admin/flash";
import { saveCategory, deleteCategory } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const categories = await getCategories();
  const db = await getDb();
  const counts = await db
    .select({ categoryId: products.categoryId, count: sql<number>`count(*)::int` })
    .from(products)
    .groupBy(products.categoryId);
  const countByCategory = new Map(counts.map((row) => [row.categoryId, row.count]));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Каталог</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Категории</h1>
        <p className="mt-1 text-[12px] text-muted">Порядок вывода — по полю «сортировка».</p>
      </div>

      <Flash ok={ok} error={error} />

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-2xl border border-line/70 bg-white">
          <table className="w-full text-left text-[12px]">
            <thead className="border-b border-line bg-cream/50 text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Категория</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Товаров</th>
                <th className="px-4 py-3 font-semibold">Порядок</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                        {category.image && <Image src={category.image} alt="" fill sizes="36px" className="object-cover" />}
                      </div>
                      <span className="font-semibold">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted">/{category.slug}</td>
                  <td className="px-4 py-2.5">{countByCategory.get(category.id) ?? 0}</td>
                  <td className="px-4 py-2.5">{category.sortOrder}</td>
                  <td className="px-4 py-2.5 text-right">
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-red-50 hover:text-red-600" aria-label="Удалить категорию">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form action={saveCategory} className="h-fit rounded-2xl border border-line/70 bg-white p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-bold"><FolderTree className="h-4 w-4 text-brand-700" /> Новая категория</h2>
          <div className="mt-3 space-y-3">
            <div>
              <label htmlFor="cat-name" className="label">Название</label>
              <input id="cat-name" name="name" required className="field h-10 text-[12px]" />
            </div>
            <div>
              <label htmlFor="cat-slug" className="label">Slug</label>
              <input id="cat-slug" name="slug" className="field h-10 text-[12px]" placeholder="molochnaya-produktsiya" />
            </div>
            <div>
              <label htmlFor="cat-description" className="label">Описание</label>
              <textarea id="cat-description" name="description" className="field-area min-h-[70px] text-[12px]" />
            </div>
            <div>
              <label htmlFor="cat-image" className="label">Изображение</label>
              <input id="cat-image" name="image" className="field h-10 text-[12px]" placeholder="/images/dairy.jpg" />
            </div>
            <div>
              <label htmlFor="cat-sort" className="label">Сортировка</label>
              <input id="cat-sort" name="sortOrder" type="number" defaultValue={100} className="field h-10 text-[12px]" />
            </div>
            <button type="submit" className="btn-primary btn-sm w-full">Добавить</button>
          </div>
        </form>
      </div>
    </div>
  );
}
