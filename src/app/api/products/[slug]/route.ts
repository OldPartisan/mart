import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { apiError, apiOk, handleApiError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const row = await getProductBySlug(slug);
    if (!row) return apiError("Товар не найден", 404);
    const related = await getRelatedProducts(row.product.categoryId, row.product.id, 4);
    return apiOk({ ...row.product, category: { name: row.categoryName, slug: row.categorySlug }, related });
  } catch (error) {
    return handleApiError(error);
  }
}
