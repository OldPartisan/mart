import { describe, expect, it } from "vitest";
import { DELIVERY_ZONES, formatPickupDate, getPickupDays, quoteDelivery } from "@/lib/delivery";

describe("доставка", () => {
  it("считает стоимость и бесплатную доставку по зоне", () => {
    const zone = DELIVERY_ZONES[0];
    expect(quoteDelivery(500, zone.id).error).toContain("Минимальная сумма");
    expect(quoteDelivery(1000, zone.id)).toMatchObject({ fee: zone.fee, free: false });
    expect(quoteDelivery(zone.freeFrom, zone.id)).toMatchObject({ fee: 0, free: true });
  });

  it("требует зону", () => {
    expect(quoteDelivery(2000, null).error).toBeDefined();
  });

  it("формирует интервалы самовывоза на 5 дней вперёд", () => {
    const days = getPickupDays(5, new Date("2026-11-02T10:00:00"));
    expect(days).toHaveLength(5);
    expect(days[0].date).toBe("2026-11-03");
    expect(days[0].slots).toContain("18:00–20:00");
    expect(formatPickupDate(days[0].date)).toContain("ноября");
  });
});
