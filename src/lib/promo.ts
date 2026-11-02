import { and, eq, gt, isNull, or, sql } from "drizzle-orm";
import { promoCodes } from "@/db/schema";
import type { AppDb } from "@/db";

export type PromoResult =
  | { ok: true; code: string; discount: number; description: string }
  | { ok: false; error: string };

export function calculatePromoDiscount(subtotal: number, type: "PERCENT" | "FIXED", value: number): number {
  if (subtotal <= 0) return 0;
  if (type === "PERCENT") return Math.min(subtotal, Math.floor((subtotal * Math.min(value, 100)) / 100));
  return Math.min(subtotal, value);
}

export async function validatePromo(db: AppDb, rawCode: string, subtotal: number): Promise<PromoResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Введите промокод" };

  const [promo] = await db
    .select()
    .from(promoCodes)
    .where(
      and(
        eq(promoCodes.code, code),
        eq(promoCodes.isActive, true),
        or(isNull(promoCodes.validUntil), gt(promoCodes.validUntil, new Date())),
      ),
    )
    .limit(1);

  if (!promo) return { ok: false, error: "Промокод не найден или истёк" };
  if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) return { ok: false, error: "Лимит использований промокода исчерпан" };
  if (subtotal < promo.minOrderAmount) {
    return { ok: false, error: `Промокод действует от ${promo.minOrderAmount.toLocaleString("ru-RU")} ₽` };
  }

  const discount = calculatePromoDiscount(subtotal, promo.discountType, promo.discountValue);
  return {
    ok: true,
    code: promo.code,
    discount,
    description:
      promo.discountType === "PERCENT" ? `−${promo.discountValue}% на заказ` : `−${promo.discountValue} ₽ на заказ`,
  };
}

export async function usePromo(db: AppDb, code: string): Promise<void> {
  await db
    .update(promoCodes)
    .set({ usedCount: sql`${promoCodes.usedCount} + 1` })
    .where(eq(promoCodes.code, code));
}
