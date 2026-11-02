import { z } from "zod";

const phoneRe = /^\+?[0-9\s()-]{10,20}$/;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Имя слишком короткое").max(80),
  email: z.string().trim().toLowerCase().email("Проверьте email"),
  phone: z.string().trim().regex(phoneRe, "Проверьте телефон").optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Минимум 8 символов")
    .regex(/[A-Za-zА-Яа-я]/, "Добавьте хотя бы одну букву")
    .regex(/\d/, "Добавьте хотя бы одну цифру")
    .max(72, "Максимум 72 символа"),
  marketingOptIn: z.boolean().default(false),
  consent: z.literal(true, { errorMap: () => ({ message: "Нужно согласие на обработку данных" }) }),
  referral: z.string().trim().max(40).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Проверьте email"),
  password: z.string().min(1, "Введите пароль"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Имя слишком короткое").max(80),
  phone: z.string().trim().regex(phoneRe, "Проверьте телефон").optional().or(z.literal("")),
  marketingOptIn: z.boolean().default(false),
});

export const addressSchema = z.object({
  label: z.string().trim().max(40).default("Дом"),
  city: z.string().trim().min(2, "Укажите город или посёлок"),
  street: z.string().trim().min(2, "Укажите улицу"),
  house: z.string().trim().min(1, "Укажите дом"),
  apartment: z.string().trim().max(20).optional().or(z.literal("")),
  entrance: z.string().trim().max(10).optional().or(z.literal("")),
  floor: z.string().trim().max(10).optional().or(z.literal("")),
  isDefault: z.boolean().default(false),
});

export const checkoutSchema = z
  .object({
    customerName: z.string().trim().min(2, "Укажите имя").max(80),
    phone: z.string().trim().regex(phoneRe, "Проверьте телефон"),
    email: z.string().trim().toLowerCase().email("Проверьте email"),
    deliveryType: z.enum(["PICKUP", "DELIVERY"]),
    deliveryZoneId: z.string().trim().optional().or(z.literal("")),
    addressText: z.string().trim().max(240).optional().or(z.literal("")),
    pickupDate: z.string().trim().optional().or(z.literal("")),
    pickupSlot: z.string().trim().optional().or(z.literal("")),
    paymentMethod: z.enum(["ONLINE", "ON_RECEIPT"]),
    comment: z.string().trim().max(500).optional().or(z.literal("")),
    promoCode: z.string().trim().max(40).optional().or(z.literal("")),
    bonusToUse: z.coerce.number().int().min(0).max(100_000).default(0),
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.coerce.number().int().min(1).max(99),
        }),
      )
      .min(1, "Корзина пуста"),
    consent: z.literal(true, { errorMap: () => ({ message: "Подтвердите согласие с условиями" }) }),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "DELIVERY") {
      if (!data.deliveryZoneId) ctx.addIssue({ code: "custom", path: ["deliveryZoneId"], message: "Выберите зону доставки" });
      if (!data.addressText || data.addressText.length < 5)
        ctx.addIssue({ code: "custom", path: ["addressText"], message: "Укажите адрес доставки" });
    } else {
      if (!data.pickupDate) ctx.addIssue({ code: "custom", path: ["pickupDate"], message: "Выберите дату" });
      if (!data.pickupSlot) ctx.addIssue({ code: "custom", path: ["pickupSlot"], message: "Выберите интервал" });
    }
  });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80),
  phone: z.string().trim().regex(phoneRe, "Проверьте телефон").optional().or(z.literal("")),
  email: z.string().trim().toLowerCase().email("Проверьте email").optional().or(z.literal("")),
  message: z.string().trim().min(10, "Опишите вопрос подробнее").max(1000),
  consent: z.literal(true),
});

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email("Проверьте email"),
  source: z.string().trim().max(40).default("footer"),
});

export const promoValidateSchema = z.object({
  code: z.string().trim().min(1).max(40),
  subtotal: z.coerce.number().int().min(0),
});

export const productAdminSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Только латиница, цифры и дефис").max(120),
  description: z.string().trim().max(2000).default(""),
  composition: z.string().trim().max(1000).optional().or(z.literal("")),
  storageInfo: z.string().trim().max(500).optional().or(z.literal("")),
  producer: z.string().trim().max(160).optional().or(z.literal("")),
  price: z.coerce.number().int().min(1).max(1_000_000),
  oldPrice: z.coerce.number().int().min(0).max(1_000_000).optional(),
  categoryId: z.string().uuid(),
  images: z.string().trim().default(""),
  isOwnProduction: z.boolean().default(false),
  isFarm: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isHit: z.boolean().default(false),
  unit: z.string().trim().max(20).default("шт"),
  weight: z.string().trim().max(40).optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0).max(100_000).default(0),
  isActive: z.boolean().default(true),
});

export const promoAdminSchema = z.object({
  code: z.string().trim().toUpperCase().min(2).max(40),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.coerce.number().int().min(1).max(100_000),
  minOrderAmount: z.coerce.number().int().min(0).default(0),
  validUntil: z.string().trim().optional().or(z.literal("")),
  usageLimit: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const orderStatusSchema = z.object({
  status: z.enum(["NEW", "PROCESSING", "READY", "DELIVERING", "COMPLETED", "CANCELLED"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/** Схема для клиентской формы оформления (позиции корзины добавляются при отправке). */
export const checkoutFormSchema = z
  .object({
    customerName: z.string().trim().min(2, "Укажите имя").max(80),
    phone: z.string().trim().regex(phoneRe, "Проверьте телефон"),
    email: z.string().trim().toLowerCase().email("Проверьте email"),
    deliveryType: z.enum(["PICKUP", "DELIVERY"]),
    deliveryZoneId: z.string().trim().optional().or(z.literal("")),
    addressText: z.string().trim().max(240).optional().or(z.literal("")),
    pickupDate: z.string().trim().optional().or(z.literal("")),
    pickupSlot: z.string().trim().optional().or(z.literal("")),
    paymentMethod: z.enum(["ONLINE", "ON_RECEIPT"]),
    comment: z.string().trim().max(500).optional().or(z.literal("")),
    consent: z.boolean().refine((value) => value, { message: "Подтвердите согласие с условиями" }),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "DELIVERY") {
      if (!data.deliveryZoneId) ctx.addIssue({ code: "custom", path: ["deliveryZoneId"], message: "Выберите зону доставки" });
      if (!data.addressText || data.addressText.length < 5)
        ctx.addIssue({ code: "custom", path: ["addressText"], message: "Укажите адрес доставки" });
    } else {
      if (!data.pickupDate) ctx.addIssue({ code: "custom", path: ["pickupDate"], message: "Выберите дату" });
      if (!data.pickupSlot) ctx.addIssue({ code: "custom", path: ["pickupSlot"], message: "Выберите интервал" });
    }
  });

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
