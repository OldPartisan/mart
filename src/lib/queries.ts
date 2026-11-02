import "server-only";
import { and, asc, desc, eq, gte, ilike, inArray, isNotNull, lte, ne, or, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import {
  addresses,
  bonusTransactions,
  categories,
  contactMessages,
  orderItems,
  orders,
  products,
  promoCodes,
  promotions,
  reviews,
  users,
} from "@/db/schema";

export type ProductCard = {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  unit: string;
  weight: string | null;
  stock: number;
  isOwnProduction: boolean;
  isFarm: boolean;
  isNew: boolean;
  isHit: boolean;
  categoryName?: string;
  categorySlug?: string;
};

const cardColumns = {
  id: products.id,
  name: products.name,
  slug: products.slug,
  price: products.price,
  oldPrice: products.oldPrice,
  images: products.images,
  unit: products.unit,
  weight: products.weight,
  stock: products.stock,
  isOwnProduction: products.isOwnProduction,
  isFarm: products.isFarm,
  isNew: products.isNew,
  isHit: products.isHit,
  categoryName: categories.name,
  categorySlug: categories.slug,
};

export async function getCategories() {
  const db = await getDb();
  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  const [category] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return category ?? null;
}

export type ProductFilters = {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  own?: boolean;
  farm?: boolean;
  sale?: boolean;
  sort?: "popular" | "price-asc" | "price-desc" | "new";
  page?: number;
  perPage?: number;
};

export async function getProducts(filters: ProductFilters = {}) {
  const db = await getDb();
  const page = Math.max(1, filters.page ?? 1);
  const perPage = [12, 24, 48].includes(filters.perPage ?? 12) ? (filters.perPage ?? 12) : 12;

  const conditions: SQL[] = [eq(products.isActive, true)];
  if (filters.category) {
    const category = await getCategoryBySlug(filters.category);
    if (!category) return { items: [] as ProductCard[], total: 0, page, perPage, pages: 0, category: null };
    conditions.push(eq(products.categoryId, category.id));
  }
  if (filters.q) {
    const term = `%${filters.q.trim()}%`;
    const search = or(
      ilike(products.name, term),
      ilike(products.description, term),
      ilike(products.composition, term),
    );
    if (search) conditions.push(search);
  }
  if (typeof filters.minPrice === "number") conditions.push(gte(products.price, filters.minPrice));
  if (typeof filters.maxPrice === "number") conditions.push(lte(products.price, filters.maxPrice));
  if (filters.own) conditions.push(eq(products.isOwnProduction, true));
  if (filters.farm) conditions.push(eq(products.isFarm, true));
  if (filters.sale) {
    conditions.push(isNotNull(products.oldPrice));
    conditions.push(sql`${products.oldPrice} > ${products.price}`);
  }

  const where = and(...conditions);
  const orderBy =
    filters.sort === "price-asc"
      ? [asc(products.price)]
      : filters.sort === "price-desc"
        ? [desc(products.price)]
        : filters.sort === "new"
          ? [desc(products.createdAt)]
          : [desc(products.popularity), desc(products.createdAt)];

  const [items, countRows] = await Promise.all([
    db
      .select(cardColumns)
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(...orderBy)
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ count: sql<number>`count(*)::int` }).from(products).where(where),
  ]);

  const total = countRows[0]?.count ?? 0;
  return {
    items: items as ProductCard[],
    total,
    page,
    perPage,
    pages: Math.max(1, Math.ceil(total / perPage)),
    category: filters.category ? await getCategoryBySlug(filters.category) : null,
  };
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      product: products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  const db = await getDb();
  const rows = await db
    .select(cardColumns)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.categoryId, categoryId), ne(products.id, excludeId), eq(products.isActive, true)))
    .orderBy(desc(products.popularity))
    .limit(limit);
  return rows as ProductCard[];
}

export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return [] as ProductCard[];
  const db = await getDb();
  const rows = await db
    .select(cardColumns)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(inArray(products.id, ids));
  return rows as ProductCard[];
}

export async function getHomeProducts() {
  const db = await getDb();
  const [hits, own, farm, combos, fresh] = await Promise.all([
    db
      .select(cardColumns)
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, true), eq(products.isHit, true)))
      .orderBy(desc(products.popularity))
      .limit(8),
    db
      .select(cardColumns)
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, true), eq(products.isOwnProduction, true)))
      .orderBy(desc(products.popularity))
      .limit(4),
    db
      .select(cardColumns)
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, true), eq(products.isFarm, true)))
      .orderBy(desc(products.popularity))
      .limit(4),
    db
      .select(cardColumns)
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, true), eq(categories.slug, "kombo-nabory")))
      .orderBy(desc(products.popularity))
      .limit(3),
    db
      .select(cardColumns)
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, true), eq(products.isNew, true)))
      .orderBy(desc(products.createdAt))
      .limit(4),
  ]);
  return { hits, own, farm, combos, fresh } as Record<string, ProductCard[]>;
}

export async function getPromotions(limit?: number) {
  const db = await getDb();
  const query = db
    .select()
    .from(promotions)
    .where(eq(promotions.isActive, true))
    .orderBy(asc(promotions.sortOrder));
  return limit ? query.limit(limit) : query;
}

export async function getPromotionBySlug(slug: string) {
  const db = await getDb();
  const [promotion] = await db.select().from(promotions).where(eq(promotions.slug, slug)).limit(1);
  return promotion ?? null;
}

export async function getReviews(limit = 6) {
  const db = await getDb();
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.isPublished, true))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}

export async function getProductReviews(productId: string) {
  const db = await getDb();
  return db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isPublished, true)))
    .orderBy(desc(reviews.createdAt));
}

export async function getUserOrders(userId: string) {
  const db = await getDb();
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(orderId: string) {
  const db = await getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { order, items };
}

export async function getOrderByNumber(number: string) {
  const db = await getDb();
  const [order] = await db.select().from(orders).where(eq(orders.number, number)).limit(1);
  return order ?? null;
}

export async function getBonusHistory(userId: string) {
  const db = await getDb();
  return db
    .select()
    .from(bonusTransactions)
    .where(eq(bonusTransactions.userId, userId))
    .orderBy(desc(bonusTransactions.createdAt));
}

export async function getUserAddresses(userId: string) {
  const db = await getDb();
  return db.select().from(addresses).where(eq(addresses.userId, userId)).orderBy(desc(addresses.isDefault));
}

export async function getTotalSpent(userId: string) {
  const db = await getDb();
  const since = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${orders.total}), 0)::int` })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.paymentStatus, "PAID"), gte(orders.createdAt, since)));
  return row?.total ?? 0;
}

/* ─────────────────────────────── Админка ─────────────────────────────── */

export async function getAdminStats() {
  const db = await getDb();
  const [revenueRow] = await db
    .select({
      revenue: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
      count: sql<number>`count(*)::int`,
      avg: sql<number>`coalesce(round(avg(${orders.total})), 0)::int`,
    })
    .from(orders)
    .where(eq(orders.paymentStatus, "PAID"));

  const [todayRow] = await db
    .select({ count: sql<number>`count(*)::int`, sum: sql<number>`coalesce(sum(${orders.total}), 0)::int` })
    .from(orders)
    .where(gte(orders.createdAt, new Date(new Date().setHours(0, 0, 0, 0))));

  const [customersRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.role, "CUSTOMER"));

  const [newRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(inArray(orders.status, ["NEW", "PROCESSING"]));

  const topProducts = await db
    .select({
      name: products.name,
      slug: products.slug,
      quantity: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
      revenue: sql<number>`coalesce(sum(${orderItems.lineTotal}), 0)::int`,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .groupBy(products.name, products.slug)
    .orderBy(desc(sql`sum(${orderItems.quantity})`))
    .limit(5);

  const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8);

  const salesByDay = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${orders.createdAt}), 'DD.MM')`,
      total: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
    })
    .from(orders)
    .where(and(eq(orders.paymentStatus, "PAID"), gte(orders.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))))
    .groupBy(sql`date_trunc('day', ${orders.createdAt})`)
    .orderBy(asc(sql`date_trunc('day', ${orders.createdAt})`));

  return {
    revenue: revenueRow?.revenue ?? 0,
    paidOrders: revenueRow?.count ?? 0,
    avgOrder: revenueRow?.avg ?? 0,
    todayOrders: todayRow?.count ?? 0,
    todayRevenue: todayRow?.sum ?? 0,
    customers: customersRow?.count ?? 0,
    activeOrders: newRow?.count ?? 0,
    topProducts,
    recentOrders,
    salesByDay,
  };
}

export async function getAdminOrders(options: { status?: string; q?: string } = {}) {
  const db = await getDb();
  const conditions: SQL[] = [];
  if (options.status && options.status !== "ALL") {
    conditions.push(eq(orders.status, options.status as typeof orders.status.enumValues[number]));
  }
  if (options.q) {
    const term = `%${options.q.trim()}%`;
    const search = or(ilike(orders.number, term), ilike(orders.customerName, term), ilike(orders.phone, term));
    if (search) conditions.push(search);
  }
  return db
    .select()
    .from(orders)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(100);
}

export async function getAdminProducts(q?: string) {
  const db = await getDb();
  const conditions: SQL[] = [];
  if (q) {
    const term = `%${q.trim()}%`;
    const search = or(ilike(products.name, term), ilike(products.slug, term));
    if (search) conditions.push(search);
  }
  return db
    .select({ product: products, categoryName: categories.name })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(products.createdAt))
    .limit(200);
}

export async function getAdminPromos() {
  const db = await getDb();
  return db.select().from(promoCodes).orderBy(desc(promoCodes.createdAt));
}

export async function getAdminUsers(q?: string) {
  const db = await getDb();
  const conditions: SQL[] = [];
  if (q) {
    const term = `%${q.trim()}%`;
    const search = or(ilike(users.name, term), ilike(users.email, term), ilike(users.phone, term));
    if (search) conditions.push(search);
  }
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      bonusBalance: users.bonusBalance,
      isBlocked: users.isBlocked,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(users.createdAt))
    .limit(200);
}

export async function getContactMessages() {
  const db = await getDb();
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(50);
}
