import { getProducts } from "@/lib/queries";
import { apiOk, handleApiError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const result = await getProducts({
      category: params.get("category") ?? undefined,
      q: params.get("q") ?? undefined,
      minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
      maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
      own: params.get("own") === "1",
      farm: params.get("farm") === "1",
      sale: params.get("sale") === "1",
      sort: (params.get("sort") as "popular" | "price-asc" | "price-desc" | "new" | null) ?? "popular",
      page: Number(params.get("page") ?? 1),
      perPage: Number(params.get("perPage") ?? 12),
    });
    return apiOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
