import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { appSettings } from "@/db/schema";
import { IntegrationForm } from "@/components/admin/integration-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Интеграция 1С" };

export default async function IntegrationPage() {
  const db = await getDb();
  const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, "onec")).limit(1);
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">Интеграция</p>
      <h1 className="mt-1 text-2xl font-bold text-ink">1С</h1>
      <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted">
        Настройки подключения и маппинга. Пока 1С не отдаёт API — сохраняем конфигурацию и готовим поля.
        Реальная синхронизация появится после подключения HTTP-сервиса.
      </p>
      <IntegrationForm initial={(setting?.value ?? {}) as Record<string, unknown>} />
    </div>
  );
}
