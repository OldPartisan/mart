import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted hover:text-brand-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Товары
      </Link>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Новый товар</h1>
      <p className="mt-1 text-[12px] text-muted">Заполните карточку — она сразу появится в каталоге.</p>
      <ProductForm categories={categories} />
    </div>
  );
}
