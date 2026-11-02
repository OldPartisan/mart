import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { addresses } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { addressSchema } from "@/lib/validation";
import { apiError, apiOk, handleApiError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("Требуется авторизация", 401);
    const db = await getDb();
    const rows = await db.select().from(addresses).where(eq(addresses.userId, user.id));
    return apiOk({ items: rows });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("Требуется авторизация", 401);
    const data = addressSchema.parse(await request.json());
    const db = await getDb();
    const [created] = await db.transaction(async (tx) => {
      if (data.isDefault) {
        await tx.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, user.id));
      }
      return tx
        .insert(addresses)
        .values({
          userId: user.id,
          label: data.label || "Дом",
          city: data.city,
          street: data.street,
          house: data.house,
          apartment: data.apartment || null,
          entrance: data.entrance || null,
          floor: data.floor || null,
          isDefault: data.isDefault,
        })
        .returning();
    });
    return apiOk({ address: created }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return apiError("Требуется авторизация", 401);
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return apiError("Не указан адрес", 400);
    const db = await getDb();
    await db.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.userId, user.id)));
    return apiOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
