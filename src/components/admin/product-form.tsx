import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import type { Category, Product } from "@/db/schema";
import { saveProduct } from "@/app/admin/actions";

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  return (
    <form action={saveProduct} className="mt-5 space-y-4">
      {product && <input type="hidden" name="id" value={product.id} />}

      <section className="rounded-2xl border border-line/70 bg-white p-5">
        <h2 className="font-display text-base font-bold">Основное</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="label">Название</label>
            <input id="name" name="name" defaultValue={product?.name} required className="field" />
          </div>
          <div>
            <label htmlFor="slug" className="label">Slug (латиница)</label>
            <input id="slug" name="slug" defaultValue={product?.slug} className="field" placeholder="moloko-irbis-3-2" />
          </div>
          <div>
            <label htmlFor="categoryId" className="label">Категория</label>
            <select id="categoryId" name="categoryId" defaultValue={product?.categoryId ?? categories[0]?.id} required className="field">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="label">Описание</label>
            <textarea id="description" name="description" defaultValue={product?.description} className="field-area min-h-[100px]" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="images" className="label">Изображения (через запятую)</label>
            <input id="images" name="images" defaultValue={product?.images.join(", ")} className="field" placeholder="/images/milk-carton.jpg, /images/milk-pour.jpg" />
            <p className="mt-1 text-[10.5px] text-muted">Файлы лежат в /public/images. Первое изображение — главное.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-5">
        <h2 className="font-display text-base font-bold">Цена и наличие</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="price" className="label">Цена, ₽</label>
            <input id="price" name="price" type="number" min={1} defaultValue={product?.price} required className="field" />
          </div>
          <div>
            <label htmlFor="oldPrice" className="label">Старая цена, ₽</label>
            <input id="oldPrice" name="oldPrice" type="number" min={0} defaultValue={product?.oldPrice ?? ""} className="field" />
          </div>
          <div>
            <label htmlFor="stock" className="label">Остаток, шт.</label>
            <input id="stock" name="stock" type="number" min={0} defaultValue={product?.stock ?? 0} className="field" />
          </div>
          <div>
            <label htmlFor="unit" className="label">Единица</label>
            <input id="unit" name="unit" defaultValue={product?.unit ?? "шт"} className="field" />
          </div>
          <div>
            <label htmlFor="weight" className="label">Вес / объём</label>
            <input id="weight" name="weight" defaultValue={product?.weight ?? ""} className="field" placeholder="900 мл" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-5">
        <h2 className="font-display text-base font-bold">Состав и производство</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="composition" className="label">Состав</label>
            <textarea id="composition" name="composition" defaultValue={product?.composition ?? ""} className="field-area min-h-[80px]" />
          </div>
          <div>
            <label htmlFor="storageInfo" className="label">Хранение и срок</label>
            <textarea id="storageInfo" name="storageInfo" defaultValue={product?.storageInfo ?? ""} className="field-area min-h-[80px]" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="producer" className="label">Производитель</label>
            <input id="producer" name="producer" defaultValue={product?.producer ?? ""} className="field" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {[
            { name: "isOwnProduction", label: "Собственное производство", checked: product?.isOwnProduction },
            { name: "isFarm", label: "Фермерское", checked: product?.isFarm },
            { name: "isNew", label: "Новинка", checked: product?.isNew },
            { name: "isHit", label: "Хит", checked: product?.isHit },
            { name: "isActive", label: "Показывать на сайте", checked: product?.isActive ?? true },
          ].map((flag) => (
            <label key={flag.name} className="flex cursor-pointer items-center gap-2 text-[12px] text-ink-soft">
              <input type="checkbox" name={flag.name} defaultChecked={flag.checked} className="h-4 w-4 accent-[#2E7D32]" />
              {flag.label}
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary btn-sm"><Save className="h-3.5 w-3.5" /> Сохранить</button>
        <Link href="/admin/products" className="btn-secondary btn-sm"><ArrowLeft className="h-3.5 w-3.5" /> К списку</Link>
      </div>
    </form>
  );
}
