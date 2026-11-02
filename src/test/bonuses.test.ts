import { describe, expect, it } from "vitest";
import { BONUS_RULES, calculateAccrual, getLevel, maxBonusSpend, nextLevel } from "@/lib/bonuses";

describe("бонусная программа", () => {
  it("начисляет 1 бонус за 100 ₽", () => {
    expect(calculateAccrual(2400)).toBe(24);
    expect(calculateAccrual(99)).toBe(0);
    expect(calculateAccrual(0)).toBe(0);
  });

  it("учитывает множитель уровня", () => {
    expect(calculateAccrual(2400, 1.5)).toBe(36);
    expect(calculateAccrual(2400, 2)).toBe(48);
  });

  it("не списывает больше 50% и больше баланса", () => {
    expect(maxBonusSpend(2400, 5000)).toBe(1200);
    expect(maxBonusSpend(2400, 300)).toBe(300);
    expect(maxBonusSpend(100, 0)).toBe(0);
  });

  it("определяет уровень по тратам за 12 месяцев", () => {
    expect(getLevel(0).id).toBe("basic");
    expect(getLevel(14999).id).toBe("basic");
    expect(getLevel(15000).id).toBe("silver");
    expect(getLevel(50000).id).toBe("gold");
    expect(nextLevel(1000)?.level.id).toBe("silver");
    expect(nextLevel(60000)).toBeNull();
  });

  it("хранит бонусы 365 дней", () => {
    expect(BONUS_RULES.ttlDays).toBe(365);
    expect(BONUS_RULES.welcome).toBe(300);
  });
});
