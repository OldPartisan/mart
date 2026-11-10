export type RfmSegmentKey =
  | "champions"
  | "loyal"
  | "new"
  | "promising"
  | "cant-lose"
  | "at-risk"
  | "hibernating"
  | "attention";

export type RfmCustomer = {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  lastOrderAt: Date;
  recencyDays: number;
  frequency: number;
  monetary: number;
  r: number;
  f: number;
  m: number;
  segment: RfmSegmentKey;
};

export type RfmSegment = {
  key: RfmSegmentKey;
  label: string;
  description: string;
  tone: string;
  count: number;
  revenue: number;
  share: number;
  avgRecency: number;
  avgFrequency: number;
  avgMonetary: number;
};

export const SEGMENT_META: Record<RfmSegmentKey, { label: string; description: string; tone: string }> = {
  champions: { label: "Чемпионы", description: "Покупают часто, недавно и на высокий чек", tone: "bg-brand-700 text-white" },
  loyal: { label: "Лояльные", description: "Регулярные покупки, хорошая давность", tone: "bg-brand-100 text-brand-900" },
  new: { label: "Новые", description: "Недавно сделали первую покупку", tone: "bg-accent-100 text-accent-700" },
  promising: { label: "Перспективные", description: "Недавно, но пока мало заказов", tone: "bg-cream text-ink" },
  "cant-lose": { label: "Нельзя терять", description: "Много тратят, но давно не возвращались", tone: "bg-red-100 text-red-700" },
  "at-risk": { label: "Под угрозой", description: "Были активны, но давно не покупали", tone: "bg-orange-100 text-orange-700" },
  hibernating: { label: "Спящие", description: "Давно и редко покупают", tone: "bg-line text-muted" },
  attention: { label: "Требуют внимания", description: "Средние показатели — есть куда расти", tone: "bg-white text-ink" },
};

const SEGMENT_ORDER: RfmSegmentKey[] = ["champions", "loyal", "new", "promising", "cant-lose", "at-risk", "attention", "hibernating"];

function recencyScore(days: number): number {
  if (days <= 7) return 5;
  if (days <= 14) return 4;
  if (days <= 30) return 3;
  if (days <= 60) return 2;
  return 1;
}

function frequencyScore(count: number): number {
  if (count >= 10) return 5;
  if (count >= 5) return 4;
  if (count >= 3) return 3;
  if (count >= 2) return 2;
  return 1;
}

function monetaryScore(value: number, values: number[]): number {
  if (!values.length) return 3;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = sorted.filter((item) => item <= value).length / sorted.length;
  return Math.min(5, Math.max(1, Math.ceil(rank * 5)));
}

export function segmentFor(r: number, f: number, m: number): RfmSegmentKey {
  if (r >= 4 && f >= 4 && m >= 4) return "champions";
  if (r >= 3 && f >= 3) return "loyal";
  if (r >= 4 && f <= 1) return "new";
  if (r >= 3 && f <= 2) return "promising";
  if (r <= 2 && f >= 4 && m >= 4) return "cant-lose";
  if (r <= 2 && f >= 3) return "at-risk";
  if (r <= 2 && f <= 2) return "hibernating";
  return "attention";
}

export function buildRfmReport(
  rows: Array<{ userId: string; name: string; email: string; phone?: string | null; createdAt: Date; total: number }>,
  now = new Date(),
): { customers: RfmCustomer[]; segments: RfmSegment[]; totals: { customers: number; revenue: number; avgCheck: number; repeatRate: number; totalOrders: number } } {
  const byUser = new Map<string, { userId: string; name: string; email: string; phone: string | null; lastOrderAt: Date; frequency: number; monetary: number }>();
  for (const row of rows) {
    const current = byUser.get(row.userId);
    if (!current) {
      byUser.set(row.userId, { userId: row.userId, name: row.name, email: row.email, phone: row.phone ?? null, lastOrderAt: row.createdAt, frequency: 1, monetary: row.total });
    } else {
      current.frequency += 1;
      current.monetary += row.total;
      if (row.createdAt > current.lastOrderAt) current.lastOrderAt = row.createdAt;
    }
  }

  const base = [...byUser.values()].map((row) => ({
    ...row,
    recencyDays: Math.max(0, Math.floor((now.getTime() - row.lastOrderAt.getTime()) / 86_400_000)),
  }));
  const monetaries = base.map((row) => row.monetary);

  const customers: RfmCustomer[] = base
    .map((row) => {
      const r = recencyScore(row.recencyDays);
      const f = frequencyScore(row.frequency);
      const m = monetaryScore(row.monetary, monetaries);
      return { ...row, r, f, m, segment: segmentFor(r, f, m) };
    })
    .sort((a, b) => b.monetary - a.monetary || a.recencyDays - b.recencyDays);

  const revenue = customers.reduce((sum, row) => sum + row.monetary, 0);
  const totalOrders = customers.reduce((sum, row) => sum + row.frequency, 0);
  const repeat = customers.filter((row) => row.frequency > 1).length;
  const segments: RfmSegment[] = SEGMENT_ORDER.map((key) => {
    const members = customers.filter((row) => row.segment === key);
    const segmentRevenue = members.reduce((sum, row) => sum + row.monetary, 0);
    return {
      key,
      label: SEGMENT_META[key].label,
      description: SEGMENT_META[key].description,
      tone: SEGMENT_META[key].tone,
      count: members.length,
      revenue: segmentRevenue,
      share: revenue > 0 ? Math.round((segmentRevenue / revenue) * 100) : 0,
      avgRecency: members.length ? Math.round(members.reduce((sum, row) => sum + row.recencyDays, 0) / members.length) : 0,
      avgFrequency: members.length ? Math.round((members.reduce((sum, row) => sum + row.frequency, 0) / members.length) * 10) / 10 : 0,
      avgMonetary: members.length ? Math.round(members.reduce((sum, row) => sum + row.monetary, 0) / members.length) : 0,
    };
  });

  return {
    customers,
    segments,
    totals: {
      customers: customers.length,
      revenue,
      avgCheck: totalOrders ? Math.round(revenue / totalOrders) : 0,
      repeatRate: customers.length ? Math.round((repeat / customers.length) * 100) : 0,
      totalOrders,
    },
  };
}
