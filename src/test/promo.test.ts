import { describe, expect, it } from "vitest";
import { calculatePromoDiscount } from "@/lib/promo";
import { discountPercent, formatPrice, pluralize } from "@/lib/money";

describe("скидки", () => {
  it("считает процент и фиксированную скидку", () => {
    expect(calculatePromoDiscount(2400, "PERCENT", 10)).toBe(240);
    expect(calculatePromoDiscount(2400, "FIXED", 300)).toBe(300);
    expect(calculatePromoDiscount(200, "FIXED", 300)).toBe(200);
    expect(calculatePromoDiscount(100, "PERCENT", 150)).toBe(100);
  });

  it("показывает процент скидки по старой цене", () => {
    expect(discountPercent(890, 1090)).toBe(18);
    expect(discountPercent(100, null)).toBeNull();
    expect(discountPercent(100, 90)).toBeNull();
  });

  it("форматирует цену и склонения", () => {
    expect(formatPrice(890)).toContain("890");
    expect(formatPrice(890)).toContain("₽");
    expect(pluralize(1, "товар", "товара", "товаров")).toBe("товар");
    expect(pluralize(3, "товар", "товара", "товаров")).toBe("товара");
    expect(pluralize(11, "товар", "товара", "товаров")).toBe("товаров");
  });
});
