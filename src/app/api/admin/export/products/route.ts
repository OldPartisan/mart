import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";
import { getCurrentUser, isStaff } from "@/lib/auth";

export const runtime = "nodejs";

function cell(value: string | number | null | undefined): string {
  const text = String(value ?? "").replace(/"/g, '""');
  return /[;"\n]/.test(text) ? `"${text}"` : text;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) return new Response("Forbidden", { status: 403 });

  const db = await getDb();
  const rows = await db
    .select({
      name: products.name,
      slug: products.slug,
      category: categories.slug,
      price: products.price,
      description: products.description,
      images: products.images,
      stock: products.stock,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(products.name);

  const header = "name;slug;category;price;description;images;stock";
  const body = rows
    .map((row) =>
      [row.name, row.slug, row.category, row.price, row.description, row.images.join("|"), row.stock].map(cell).join(";"),
    )
    .join("\n");

  return new Response(`\uFEFF${header}\n${body}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="irbis-mart-products-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
