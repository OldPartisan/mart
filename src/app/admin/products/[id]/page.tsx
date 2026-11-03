import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/product-form";
import { deleteProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!product) notFound();
  const categories = await getCategories();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted hover:text-brand-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Товары
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{product.name}</h1>
          <p className="mt-1 text-[12px] text-muted">/{product.slug}</p>
        </div>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button type="submit" className="btn-secondary btn-sm text-red-600"><Trash2 className="h-3.5 w-3.5" /> Удалить</button>
        </form>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
