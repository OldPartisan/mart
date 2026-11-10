import { getCurrentUser, isStaff } from "@/lib/auth";
import { getRfmOrderRows } from "@/lib/rfm-query";
import { buildRfmReport, SEGMENT_META } from "@/lib/rfm";

export const runtime = "nodejs";

function cell(value: string | number | null | undefined): string {
  const text = String(value ?? "").replace(/"/g, '""');
  return /[;"\n]/.test(text) ? `"${text}"` : text;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) return new Response("Forbidden", { status: 403 });

  const daysParam = Number(new URL(request.url).searchParams.get("days") ?? "365");
  const days = Number.isFinite(daysParam) && daysParam > 0 ? daysParam : undefined;
  const rows = await getRfmOrderRows(days);
  const report = buildRfmReport(rows);

  const header = "name;email;segment;r;f;m;recency_days;frequency;monetary;last_order_at";
  const body = report.customers
    .map((customer) =>
      [
        customer.name,
        customer.email,
        SEGMENT_META[customer.segment].label,
        customer.r,
        customer.f,
        customer.m,
        customer.recencyDays,
        customer.frequency,
        customer.monetary,
        customer.lastOrderAt.toISOString(),
      ].map(cell).join(";"),
    )
    .join("\n");

  return new Response(`\uFEFF${header}\n${body}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="irbis-mart-rfm-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
