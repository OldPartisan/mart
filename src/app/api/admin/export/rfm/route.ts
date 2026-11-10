import * as XLSX from "xlsx";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { getRfmOrderRows } from "@/lib/rfm-query";
import { buildRfmReport, SEGMENT_META, type RfmSegmentKey } from "@/lib/rfm";

export const runtime = "nodejs";

const headers = [
  "Клиент",
  "Телефон",
  "Email",
  "Сегмент",
  "Давность последнего оплаченного заказа, дней",
  "Количество оплаченных заказов",
  "Сумма покупок, ₽",
  "R-оценка",
  "F-оценка",
  "M-оценка",
  "Последний оплаченный заказ",
];

function cell(value: string | number | null | undefined): string {
  const text = String(value ?? "").replace(/"/g, '""');
  return /[;"\n]/.test(text) ? `"${text}"` : text;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) return new Response("Forbidden", { status: 403 });

  const params = new URL(request.url).searchParams;
  const daysParam = Number(params.get("days") ?? "365");
  const days = Number.isFinite(daysParam) && daysParam > 0 ? daysParam : undefined;
  const format = params.get("format") === "xls" ? "xls" : "csv";
  const segmentParam = params.get("segment");
  const segment = segmentParam && segmentParam in SEGMENT_META ? (segmentParam as RfmSegmentKey) : null;
  const q = (params.get("q") ?? "").trim().toLowerCase();

  const report = buildRfmReport(await getRfmOrderRows(days));
  const customers = report.customers.filter((customer) => {
    const matchesSegment = !segment || customer.segment === segment;
    const matchesQuery = !q || customer.name.toLowerCase().includes(q) || customer.email.toLowerCase().includes(q);
    return matchesSegment && matchesQuery;
  });
  const fileSuffix = [segment ?? "all", new Date().toISOString().slice(0, 10)].join("-");

  if (format === "csv") {
    const body = customers
      .map((customer) =>
        [
          customer.name,
          customer.phone ?? "",
          customer.email,
          SEGMENT_META[customer.segment].label,
          customer.recencyDays,
          customer.frequency,
          customer.monetary,
          customer.r,
          customer.f,
          customer.m,
          customer.lastOrderAt.toISOString().slice(0, 10),
        ].map(cell).join(";"),
      )
      .join("\n");
    return new Response(`\uFEFF${headers.join(";")}\n${body}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="irbis-mart-rfm-${fileSuffix}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const data = [
    headers,
    ...customers.map((customer) => [
      customer.name,
      customer.phone ?? "",
      customer.email,
      SEGMENT_META[customer.segment].label,
      customer.recencyDays,
      customer.frequency,
      customer.monetary,
      customer.r,
      customer.f,
      customer.m,
      customer.lastOrderAt.toISOString().slice(0, 10),
    ]),
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [{ wch: 28 }, { wch: 16 }, { wch: 26 }, { wch: 20 }, { wch: 24 }, { wch: 22 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, ws, "RFM клиенты");

  const segmentRows = [
    ["Сегмент", "Клиентов", "Выручка, ₽", "Доля выручки, %", "Средняя давность, дней", "Средняя частота", "Средний чек, ₽"],
    ...report.segments.map((item) => [item.label, item.count, item.revenue, item.share, item.avgRecency, item.avgFrequency, item.avgMonetary]),
  ];
  const segmentSheet = XLSX.utils.aoa_to_sheet(segmentRows);
  segmentSheet["!cols"] = [{ wch: 22 }, { wch: 12 }, { wch: 16 }, { wch: 18 }, { wch: 24 }, { wch: 18 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, segmentSheet, "Сегменты");

  const buffer = XLSX.write(wb, { bookType: "biff8", type: "buffer" }) as Buffer;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.ms-excel",
      "Content-Disposition": `attachment; filename="irbis-mart-rfm-${fileSuffix}.xls"`,
      "Cache-Control": "no-store",
    },
  });
}
