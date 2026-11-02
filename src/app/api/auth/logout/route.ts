import { clearAuthCookies } from "@/lib/auth";
import { apiOk } from "@/lib/api";

export const runtime = "nodejs";

export async function POST() {
  await clearAuthCookies();
  return apiOk({ ok: true });
}
