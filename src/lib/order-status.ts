export const ORDER_STATUSES = {
  NEW: { label: "Новый", tone: "bg-accent-100 text-accent-700", step: 0 },
  PROCESSING: { label: "Собирается", tone: "bg-brand-100 text-brand-900", step: 1 },
  READY: { label: "Готов к выдаче", tone: "bg-brand-800 text-cream", step: 2 },
  DELIVERING: { label: "В доставке", tone: "bg-brand-800 text-cream", step: 2 },
  COMPLETED: { label: "Выполнен", tone: "bg-brand-50 text-brand-800", step: 3 },
  CANCELLED: { label: "Отменён", tone: "bg-red-50 text-red-700", step: -1 },
} as const;

export const PAYMENT_STATUSES = {
  PENDING: { label: "Ожидает оплаты", tone: "bg-accent-100 text-accent-700" },
  PAID: { label: "Оплачен", tone: "bg-brand-100 text-brand-900" },
  CANCELLED: { label: "Отменён", tone: "bg-red-50 text-red-700" },
  REFUNDED: { label: "Возврат", tone: "bg-cream-dark text-ink-soft" },
} as const;

export function statusLabel(status: keyof typeof ORDER_STATUSES): string {
  return ORDER_STATUSES[status]?.label ?? status;
}
