/**
 * Зоны доставки вокруг магазина в с. Новая Тура.
 * Данные о расстояниях взяты из исследования зон (zones.json): радиус 2–12 км.
 * По ТЗ приоритет — самовывоз; доставка работает как пилотный сервис.
 */

export type DeliveryZone = {
  id: string;
  name: string;
  areas: string[];
  fee: number;
  freeFrom: number;
  minOrder: number;
  eta: string;
};

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "turanova",
    name: "Новая Тура и ЖК «ТураНова»",
    areas: ["Новая Тура", "ТураНова", "Дубровка"],
    fee: 149,
    freeFrom: 1500,
    minOrder: 800,
    eta: "2–3 часа",
  },
  {
    id: "near",
    name: "Красницкий, Новопольский, Урняк",
    areas: ["Красницкий", "Новопольский", "Урняк"],
    fee: 249,
    freeFrom: 2500,
    minOrder: 1200,
    eta: "3–4 часа",
  },
  {
    id: "far",
    name: "Грузинский, Новочувашский, Осиново",
    areas: ["Грузинский", "Новочувашский", "Осиново", "Залесный"],
    fee: 349,
    freeFrom: 3500,
    minOrder: 1500,
    eta: "4–5 часов",
  },
];

export const PICKUP_INFO = {
  address: "с. Новая Тура, ул. Совхозная, 1",
  storage: "24 часа",
  fee: 0,
};

export const DELIVERY_ENABLED = process.env.NEXT_PUBLIC_DELIVERY_ENABLED !== "false";

export function getZone(zoneId: string | null | undefined): DeliveryZone | undefined {
  return DELIVERY_ZONES.find((zone) => zone.id === zoneId);
}

export type DeliveryQuote = {
  fee: number;
  free: boolean;
  minOrder: number;
  eta: string;
  error?: string;
};

export function quoteDelivery(subtotal: number, zoneId: string | null | undefined): DeliveryQuote {
  const zone = getZone(zoneId);
  if (!zone) {
    return { fee: 0, free: false, minOrder: 0, eta: "", error: "Выберите зону доставки" };
  }
  if (subtotal < zone.minOrder) {
    return {
      fee: zone.fee,
      free: false,
      minOrder: zone.minOrder,
      eta: zone.eta,
      error: `Минимальная сумма заказа для этой зоны — ${zone.minOrder} ₽`,
    };
  }
  const free = subtotal >= zone.freeFrom;
  return { fee: free ? 0 : zone.fee, free, minOrder: zone.minOrder, eta: zone.eta };
}

export type PickupSlot = { date: string; label: string; slots: string[] };

const SLOTS = ["10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–18:00", "18:00–20:00", "20:00–22:00"];

/** Ближайшие 5 дней, начиная с завтрашнего (заказ собираем минимум за 2 часа). */
export function getPickupDays(count = 5, from = new Date()): PickupSlot[] {
  const days: PickupSlot[] = [];
  const weekdays = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  for (let i = 1; i <= count; i += 1) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      label: `${d.getDate()} ${months[d.getMonth()]}, ${weekdays[d.getDay()]}`,
      slots: SLOTS,
    });
  }
  return days;
}

export function formatPickupDate(date: string | null | undefined): string {
  if (!date) return "";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "short" });
}
