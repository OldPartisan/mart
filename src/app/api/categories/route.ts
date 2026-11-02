import { getCategories } from "@/lib/queries";
import { apiOk, handleApiError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await getCategories();
    const byParent = new Map<string | null, typeof rows>();
    for (const row of rows) {
      const key = row.parentId ?? null;
      byParent.set(key, [...(byParent.get(key) ?? []), row]);
    }
    const tree = (parentId: string | null): unknown[] =>
      (byParent.get(parentId) ?? []).map((category) => ({ ...category, children: tree(category.id) }));
    return apiOk({ items: rows, tree: tree(null) });
  } catch (error) {
    return handleApiError(error);
  }
}
