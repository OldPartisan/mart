import { NextResponse } from "next/server";
import { processScheduledPages } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  await processScheduledPages();
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
