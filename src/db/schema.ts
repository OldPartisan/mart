import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* ───────────────────────────── Перечисления ───────────────────────────── */

export const userRoleEnum = pgEnum("user_role", ["CUSTOMER", "MANAGER", "ADMIN", "MARKETER", "EDITOR"]);

export const orderStatusEnum = pgEnum("order_status", [
  "NEW",
  "PROCESSING",
  "READY",
  "DELIVERING",
  "COMPLETED",
  "CANCELLED",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "PAID",
  "CANCELLED",
  "REFUNDED",
]);

export const paymentMethodEnum = pgEnum("payment_method", ["ONLINE", "ON_RECEIPT"]);

export const deliveryTypeEnum = pgEnum("delivery_type", ["PICKUP", "DELIVERY"]);

export const bonusTypeEnum = pgEnum("bonus_type", ["ACCRUAL", "SPEND", "WELCOME", "REFERRAL", "REFUND", "EXPIRE"]);

export const discountTypeEnum = pgEnum("discount_type", ["PERCENT", "FIXED"]);

/* ────────────────────────────── Пользователи ──────────────────────────── */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    phone: text("phone"),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    role: userRoleEnum("role").notNull().default("CUSTOMER"),
    bonusBalance: integer("bonus_balance").notNull().default(0),
    isBlocked: boolean("is_blocked").notNull().default(false),
    marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
    referralCode: text("referral_code").notNull(),
    referredBy: uuid("referred_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("users_email_uq").on(t.email),
    uniqueIndex("users_referral_uq").on(t.referralCode),
    index("users_phone_idx").on(t.phone),
  ],
);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull().default("Дом"),
  city: text("city").notNull(),
  street: text("street").notNull(),
  house: text("house").notNull(),
  apartment: text("apartment"),
  entrance: text("entrance"),
  floor: text("floor"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ─────────────────────────── Каталог и контент ────────────────────────── */

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    image: text("image"),
    parentId: uuid("parent_id"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("categories_slug_uq").on(t.slug), index("categories_parent_idx").on(t.parentId)],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull().default(""),
    composition: text("composition"),
    storageInfo: text("storage_info"),
    producer: text("producer"),
    price: integer("price").notNull(),
    oldPrice: integer("old_price"),
    images: jsonb("images").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    isOwnProduction: boolean("is_own_production").notNull().default(false),
    isFarm: boolean("is_farm").notNull().default(false),
    isNew: boolean("is_new").notNull().default(false),
    isHit: boolean("is_hit").notNull().default(false),
    unit: text("unit").notNull().default("шт"),
    weight: text("weight"),
    stock: integer("stock").notNull().default(0),
    bonusPoints: integer("bonus_points").notNull().default(0),
    popularity: integer("popularity").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("products_slug_uq").on(t.slug),
    index("products_category_idx").on(t.categoryId),
    index("products_price_idx").on(t.price),
  ],
);

export const promotions = pgTable(
  "promotions",
  {
    id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle").notNull().default(""),
    description: text("description").notNull().default(""),
    terms: text("terms"),
    image: text("image").notNull().default(""),
    badge: text("badge"),
    accent: text("accent").notNull().default("green"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull().defaultNow(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [uniqueIndex("promotions_slug_uq").on(t.slug)],
);

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  authorName: text("author_name").notNull(),
  location: text("location"),
  rating: integer("rating").notNull().default(5),
  text: text("text").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ─────────────────────────────── Заказы ──────────────────────────────── */

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    number: text("number").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    customerName: text("customer_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    status: orderStatusEnum("status").notNull().default("NEW"),
    subtotal: integer("subtotal").notNull(),
    discount: integer("discount").notNull().default(0),
    bonusUsed: integer("bonus_used").notNull().default(0),
    deliveryFee: integer("delivery_fee").notNull().default(0),
    total: integer("total").notNull(),
    deliveryType: deliveryTypeEnum("delivery_type").notNull().default("PICKUP"),
    deliveryZone: text("delivery_zone"),
    addressText: text("address_text"),
    pickupDate: date("pickup_date"),
    pickupSlot: text("pickup_slot"),
    paymentMethod: paymentMethodEnum("payment_method").notNull().default("ON_RECEIPT"),
    paymentStatus: paymentStatusEnum("payment_status").notNull().default("PENDING"),
    paymentId: text("payment_id"),
    promoCode: text("promo_code"),
    comment: text("comment"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("orders_number_uq").on(t.number),
    index("orders_user_idx").on(t.userId),
    index("orders_status_idx").on(t.status),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    image: text("image"),
    unit: text("unit").notNull().default("шт"),
    price: integer("price").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: integer("line_total").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

/* ───────────────────────── Промокоды и бонусы ────────────────────────── */

export const promoCodes = pgTable(
  "promo_codes",
  {
    id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    code: text("code").notNull(),
    discountType: discountTypeEnum("discount_type").notNull().default("PERCENT"),
    discountValue: integer("discount_value").notNull(),
    minOrderAmount: integer("min_order_amount").notNull().default(0),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    usageLimit: integer("usage_limit").notNull().default(0),
    usedCount: integer("used_count").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("promo_codes_code_uq").on(t.code)],
);

export const bonusTransactions = pgTable(
  "bonus_transactions",
  {
    id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    type: bonusTypeEnum("type").notNull(),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    description: text("description").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("bonus_user_idx").on(t.userId)],
);

/* ──────────────────── Подписки, обращения, сброс пароля ───────────────── */

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    source: text("source").notNull().default("site"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("subscriptions_email_uq").on(t.email)],
);

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  message: text("message").notNull(),
  status: text("status").notNull().default("NEW"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ────────────────────────────── Связи ───────────────────────────────── */

export const categoryRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parent: one(categories, { fields: [categories.parentId], references: [categories.id] }),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  reviews: many(reviews),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Promotion = typeof promotions.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type BonusTransaction = typeof bonusTransactions.$inferSelect;

/* ─────────────────────────────── CMS ────────────────────────────────── */

export const pages = pgTable(
  "pages",
  {
    id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    type: text("type").notNull().default("LANDING"),
    status: text("status").notNull().default("DRAFT"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ogImage: text("og_image"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    publishAt: timestamp("publish_at", { withTimezone: true }),
    unpublishAt: timestamp("unpublish_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("pages_slug_uq").on(t.slug), index("pages_status_idx").on(t.status)],
);

export const contentBlocks = pgTable(
  "content_blocks",
  {
    id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    data: jsonb("data").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    isVisible: boolean("is_visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("content_blocks_page_idx").on(t.pageId, t.sortOrder)],
);

export const contentRevisions = pgTable("content_revisions", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  pageId: uuid("page_id")
    .notNull()
    .references(() => pages.id, { onDelete: "cascade" }),
  snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const media = pgTable("media", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  key: text("key").notNull(),
  url: text("url").notNull(),
  alt: text("alt"),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull().default(0),
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Page = typeof pages.$inferSelect;
export type ContentBlock = typeof contentBlocks.$inferSelect;
export type ContentRevision = typeof contentRevisions.$inferSelect;
export type AppSetting = typeof appSettings.$inferSelect;
