"use client";

type EventParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: EventParams[];
    gtag?: (...args: unknown[]) => void;
    ym?: (id: number, action: string, goal: string, params?: EventParams) => void;
  }
}

/**
 * Единая точка отправки событий: GA4, Яндекс.Метрика и dataLayer.
 * Цели: add_to_cart, begin_checkout, purchase, sign_up, login, promo_apply.
 */
export function track(event: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const payload = { event, ...params, timestamp: new Date().toISOString() };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }

  const ymId = Number(process.env.NEXT_PUBLIC_YM_ID);
  if (ymId && typeof window.ym === "function") {
    const goalMap: Record<string, string> = {
      add_to_cart: "add_to_cart",
      purchase: "order_success",
      sign_up: "registration",
      begin_checkout: "begin_checkout",
      login: "login",
    };
    const goal = goalMap[event];
    if (goal) window.ym(ymId, "reachGoal", goal, params);
  }
}
