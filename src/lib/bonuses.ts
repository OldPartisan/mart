/**
 * Программа лояльности «Ирбис Март».
 * Правило начисления: 1 бонус за каждые 100 ₽ (1% кэшбэка), уровни повышают ставку.
 * Списывать можно до 50% суммы заказа, но не больше баланса.
 * Бонусы живут 365 дней с момента начисления.
 */

export const BONUS_RULES = {
  perAmount: 100,
  maxSpendPercent: 0.5,
  welcome: 300,
  referral: 300,
  ttlDays: 365,
} as const;

export type LoyaltyLevel = {
  id: "basic" | "silver" | "gold";
  name: string;
  threshold: number;
  multiplier: number;
  accent: string;
  perks: string[];
};

export const LOYALTY_LEVELS: LoyaltyLevel[] = [
  {
    id: "basic",
    name: "Базовый",
    threshold: 0,
    multiplier: 1,
    accent: "#2E7D32",
    perks: ["1 бонус за 100 ₽", "Приветственные 300 бонусов", "Оплата бонусами до 50%"],
  },
  {
    id: "silver",
    name: "Серебряный",
    threshold: 15_000,
    multiplier: 1.5,
    accent: "#8A9A8F",
    perks: ["1,5 бонуса за 100 ₽", "Бесплатная доставка от 1 500 ₽", "Ранний доступ к акциям"],
  },
  {
    id: "gold",
    name: "Золотой",
    threshold: 50_000,
    multiplier: 2,
    accent: "#C79A3C",
    perks: ["2 бонуса за 100 ₽", "Бесплатная доставка от 1 000 ₽", "Подарок на день рождения"],
  },
];

export function getLevel(totalSpent: number): LoyaltyLevel {
  return [...LOYALTY_LEVELS].reverse().find((level) => totalSpent >= level.threshold) ?? LOYALTY_LEVELS[0];
}

export function nextLevel(totalSpent: number): { level: LoyaltyLevel; remaining: number } | null {
  const next = LOYALTY_LEVELS.find((level) => totalSpent < level.threshold);
  return next ? { level: next, remaining: next.threshold - totalSpent } : null;
}

/** Сколько бонусов начислим за оплаченный заказ. */
export function calculateAccrual(orderTotal: number, multiplier = 1): number {
  if (orderTotal <= 0) return 0;
  return Math.floor((orderTotal / BONUS_RULES.perAmount) * multiplier);
}

/** Максимум бонусов, которые можно списать в заказе. */
export function maxBonusSpend(subtotal: number, balance: number): number {
  return Math.max(0, Math.min(balance, Math.floor(subtotal * BONUS_RULES.maxSpendPercent)));
}

export function bonusValueLabel(amount: number): string {
  return `${amount} ₽`;
}
