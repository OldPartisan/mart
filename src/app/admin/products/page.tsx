import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus, Upload } from "lucide-react";
import { getAdminProducts } from "@/lib/queries";
import { getCategories } from "@/lib/queries";
import { formatPrice } from "@/lib/money";
import { Flash } from "@/components/admin/flash";
import { toggleProduct, importProducts } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ok?: string; error?: string }>;
}) {
  const { q, ok, error } = await searchParams;
  const [rows, categories] = await Promise.all([getAdminProducts(q), getCategories()]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Каталог</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Товары</h1>
          <p className="mt-1 text-[12px] text-muted">{rows.length} позиций · {categories.length} категорий</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/api/admin/export/products" className="btn-secondary btn-sm"><Upload className="h-3.5 w-3.5" /> Экспорт CSV</a>
          <Link href="/admin/products/new" className="btn-primary btn-sm"><Plus className="h-3.5 w-3.5" /> Добавить</Link>
        </div>
      </div>

      <Flash ok={ok} error={error} />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <form method="get" className="flex flex-1 gap-2 sm:max-w-md">
          <input name="q" defaultValue={q} placeholder="Поиск по названию или slug" className="field h-10 rounded-xl text-[12px]" />
          <button type="submit" className="btn-secondary btn-sm">Найти</button>
        </form>
        <form action={importProducts} encType="multipart/form-data" className="flex items-center gap-2">
          <input type="file" name="file" accept=".csv,text/csv" className="text-[10px] text-muted file:mr-2 file:rounded-full file:border-0 file:bg-cream file:px-3 file:py-1.5 file:text-[10px] file:font-semibold" />
          <button type="submit" className="btn-secondary btn-sm">Импорт</button>
        </form>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-line/70 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[12px]">
            <thead className="border-b border-line bg-cream/50 text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Товар</th>
                <th className="px-4 py-3 font-semibold">Категория</th>
                <th className="px-4 py-3 font-semibold">Цена</th>
                <th className="px-4 py-3 font-semibold">Остаток</th>
                <th className="px-4 py-3 font-semibold">Метки</th>
                <th className="px-4 py-3 font-semibold">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {rows.map(({ product, categoryName }) => (
                <tr key={product.id} className="hover:bg-cream/30">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                        <Image src={product.images[0] ?? "/images/store.jpg"} alt="" fill sizes="40px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{product.name}</p>
                        <p className="truncate text-[10px] text-muted">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted">{categoryName}</td>
                  <td className="px-4 py-2.5 font-semibold">{formatPrice(product.price)}</td>
                  <td className="px-4 py-2.5">{product.stock}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {product.isOwnProduction && <span className="badge-green">своё</span>}
                      {product.isFarm && <span className="badge-orange">ферма</span>}
                      {product.isHit && <span className="badge bg-ink text-cream">хит</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <form action={toggleProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button type="submit" className={`badge ${product.isActive ? "bg-brand-100 text-brand-900" : "bg-red-50 text-red-700"}`}>
                        {product.isActive ? "активен" : "скрыт"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link href={`/admin/products/${product.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line hover:border-brand-700/40" aria-label="Редактировать">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-muted">CSV-формат: name;slug;category;price;description;images;stock (разделитель — точка с запятой, изображения — через |).</p>
    </div>
  );
}
