"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { categories, orders, products, promoCodes, users } from "@/db/schema";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { promoAdminSchema, productAdminSchema } from "@/lib/validation";
import { cancelOrder, setOrderStatus } from "@/lib/orders";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) throw new Error("FORBIDDEN");
  return user;
}

function back(path: string, message: string, type: "ok" | "error" = "ok"): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export async function saveProduct(formData: FormData): Promise<void> {
  const staff = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const isNew = !id;
  const target = isNew ? "/admin/products/new" : `/admin/products/${id}`;

  try {
    const parsed = productAdminSchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
      description: formData.get("description") ?? "",
      composition: formData.get("composition") ?? "",
      storageInfo: formData.get("storageInfo") ?? "",
      producer: formData.get("producer") ?? "",
      price: formData.get("price"),
      oldPrice: formData.get("oldPrice") || undefined,
      categoryId: formData.get("categoryId"),
      images: formData.get("images") ?? "",
      isOwnProduction: formData.get("isOwnProduction") === "on",
      isFarm: formData.get("isFarm") === "on",
      isNew: formData.get("isNew") === "on",
      isHit: formData.get("isHit") === "on",
      unit: formData.get("unit") || "шт",
      weight: formData.get("weight") ?? "",
      stock: formData.get("stock") || 0,
      isActive: formData.get("isActive") === "on",
    });

    const images = parsed.images
      .split(",")
      .map((image) => image.trim())
      .filter(Boolean);

    const values = {
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description,
      composition: parsed.composition || null,
      storageInfo: parsed.storageInfo || null,
      producer: parsed.producer || null,
      price: parsed.price,
      oldPrice: parsed.oldPrice && parsed.oldPrice > 0 ? parsed.oldPrice : null,
      categoryId: parsed.categoryId,
      images: images.length ? images : ["/images/store.jpg"],
      isOwnProduction: parsed.isOwnProduction,
      isFarm: parsed.isFarm,
      isNew: parsed.isNew,
      isHit: parsed.isHit,
      unit: parsed.unit,
      weight: parsed.weight || null,
      stock: parsed.stock,
      isActive: parsed.isActive,
      updatedAt: new Date(),
    };

    const db = await getDb();
    if (isNew) {
      await db.insert(products).values(values);
    } else {
      await db.update(products).set(values).where(eq(products.id, id));
    }

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath(`/product/${parsed.slug}`);
    back("/admin/products", isNew ? "Товар создан" : "Товар обновлён");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    if (error instanceof Error && "issues" in error) {
      const first = (error as { issues: Array<{ message: string; path: string[] }> }).issues[0];
      back(target, `${first?.path.join(".")}: ${first?.message}`, "error");
    }
    console.error("[admin:saveProduct]", error, staff.email);
    back(target, "Не удалось сохранить товар", "error");
  }
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  const db = await getDb();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  back("/admin/products", "Товар удалён");
}

export async function toggleProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  const db = await getDb();
  await db
    .update(products)
    .set({ isActive: sql`not ${products.isActive}` })
    .where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  back("/admin/products", "Видимость товара изменена");
}

export async function saveCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) back("/admin/categories", "Название категории слишком короткое", "error");
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  const db = await getDb();
  try {
    await db.insert(categories).values({
      name,
      slug,
      description: String(formData.get("description") ?? "") || null,
      image: String(formData.get("image") ?? "") || null,
      sortOrder: Number(formData.get("sortOrder") ?? 100),
      isActive: true,
    });
  } catch {
    back("/admin/categories", "Категория с таким slug уже существует", "error");
  }
  revalidatePath("/admin/categories");
  back("/admin/categories", "Категория добавлена");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  const db = await getDb();
  const [used] = await db.select({ count: sql<number>`count(*)::int` }).from(products).where(eq(products.categoryId, id));
  if ((used?.count ?? 0) > 0) back("/admin/categories", "В категории есть товары — удаление запрещено", "error");
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
  back("/admin/categories", "Категория удалена");
}

export async function updateOrderStatus(formData: FormData): Promise<void> {
  const staff = await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as "NEW" | "PROCESSING" | "READY" | "DELIVERING" | "COMPLETED" | "CANCELLED";
  const path = staff.role === "MANAGER" ? `/admin/orders/${id}` : `/admin/orders/${id}`;
  try {
    if (status === "CANCELLED") await cancelOrder(id, `Отменён сотрудником ${staff.name}`);
    else await setOrderStatus(id, status);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    back(path, "Статус заказа обновлён");
  } catch (error) {
    back(path, (error as Error).message, "error");
  }
}

export async function savePromo(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  try {
    const parsed = promoAdminSchema.parse({
      code: formData.get("code"),
      discountType: formData.get("discountType"),
      discountValue: formData.get("discountValue"),
      minOrderAmount: formData.get("minOrderAmount") || 0,
      validUntil: formData.get("validUntil") ?? "",
      usageLimit: formData.get("usageLimit") || 0,
      isActive: formData.get("isActive") === "on",
    });
    const db = await getDb();
    const values = {
      code: parsed.code,
      discountType: parsed.discountType,
      discountValue: parsed.discountValue,
      minOrderAmount: parsed.minOrderAmount,
      validUntil: parsed.validUntil ? new Date(`${parsed.validUntil}T23:59:59`) : null,
      usageLimit: parsed.usageLimit,
      isActive: parsed.isActive,
    };
    if (id) await db.update(promoCodes).set(values).where(eq(promoCodes.id, id));
    else await db.insert(promoCodes).values(values);
    revalidatePath("/admin/promos");
    back("/admin/promos", id ? "Промокод обновлён" : "Промокод создан");
  } catch (error) {
    back("/admin/promos", (error as Error).message.includes("duplicate") ? "Такой код уже есть" : "Проверьте поля промокода", "error");
  }
}

export async function togglePromo(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  const db = await getDb();
  await db.update(promoCodes).set({ isActive: sql`not ${promoCodes.isActive}` }).where(eq(promoCodes.id, id));
  revalidatePath("/admin/promos");
  back("/admin/promos", "Статус промокода изменён");
}

export async function toggleUserBlock(formData: FormData): Promise<void> {
  const staff = await requireAdmin();
  if (staff.role !== "ADMIN") back("/admin/users", "Только администратор может блокировать пользователей", "error");
  const id = String(formData.get("id"));
  if (id === staff.id) back("/admin/users", "Нельзя заблокировать свой аккаунт", "error");
  const db = await getDb();
  await db.update(users).set({ isBlocked: sql`not ${users.isBlocked}` }).where(eq(users.id, id));
  revalidatePath("/admin/users");
  back("/admin/users", "Статус пользователя изменён");
}

export async function updateUserRole(formData: FormData): Promise<void> {
  const staff = await requireAdmin();
  if (staff.role !== "ADMIN") back("/admin/users", "Только администратор может менять роли", "error");
  const id = String(formData.get("id"));
  const role = String(formData.get("role")) as "CUSTOMER" | "MANAGER" | "ADMIN";
  if (id === staff.id) back("/admin/users", "Нельзя изменить собственную роль", "error");
  const db = await getDb();
  await db.update(users).set({ role }).where(eq(users.id, id));
  revalidatePath("/admin/users");
  back("/admin/users", "Роль обновлена");
}

export async function importProducts(formData: FormData): Promise<void> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) back("/admin/products", "Выберите CSV-файл", "error");
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) back("/admin/products", "CSV пустой", "error");

  const header = lines[0]!.split(";").map((cell) => cell.trim());
  const idx = (name: string) => header.indexOf(name);
  const db = await getDb();
  const categoriesRows = await db.select().from(categories);
  const categoryBySlug = new Map(categoriesRows.map((category) => [category.slug, category.id]));

  let created = 0;
  for (const line of lines.slice(1)) {
    const cells = line.split(";").map((cell) => cell.trim());
    const name = cells[idx("name")] ?? "";
    const slug = cells[idx("slug")] || slugify(name);
    const categorySlug = cells[idx("category")] ?? "";
    const categoryId = categoryBySlug.get(categorySlug);
    const price = Number(cells[idx("price")] ?? 0);
    if (!name || !categoryId || !price) continue;
    await db
      .insert(products)
      .values({
        name,
        slug,
        price,
        description: cells[idx("description")] ?? "",
        images: (cells[idx("images")] ?? "/images/store.jpg").split("|").filter(Boolean),
        categoryId,
        stock: Number(cells[idx("stock")] ?? 0),
        isActive: true,
      })
      .onConflictDoNothing();
    created += 1;
  }
  revalidatePath("/admin/products");
  back("/admin/products", `Импортировано строк: ${created}`);
}

export async function updateCustomerNote(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  const comment = String(formData.get("comment") ?? "");
  const db = await getDb();
  await db.update(orders).set({ comment }).where(eq(orders.id, id));
  revalidatePath(`/admin/orders/${id}`);
  back(`/admin/orders/${id}`, "Комментарий сохранён");
}
