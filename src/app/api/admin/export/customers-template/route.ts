import { getCurrentUser, isStaff } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) return new Response("Forbidden", { status: 403 });
  const header = "external_id;phone;email;name;consent_email;consent_sms;consent_at;consent_source;last_visit_at;visits_count;fuel_spend;shop_spend;bonus_balance;status";
  const example = "AZS-0001;+79990000000;client@example.com;Иван Иванов;1;0;2026-01-01;site;2026-10-01;3;15000;2500;120;ACTIVE";
  return new Response(`\uFEFF${header}\n${example}\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="irbis-mart-customers-template.csv"',
      "Cache-Control": "no-store",
    },
  });
}
