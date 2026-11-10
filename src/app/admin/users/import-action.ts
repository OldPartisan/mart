"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { customerImportBatches, marketingContacts, users, type MarketingContact } from "@/db/schema";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { normalizePhone, parseCustomerCsv } from "@/lib/customer-import";

export async function importCustomers(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !isStaff(user) || (user.role !== "ADMIN" && user.role !== "MANAGER")) throw new Error("Импорт доступен администратору и менеджеру");

  const file = formData.get("file");
  if (!(file instanceof File)) redirect("/admin/users?importError=Выберите+CSV-файл");
  if (file.size > 5 * 1024 * 1024) redirect("/admin/users?importError=Файл+больше+5+МБ");

  const text = await file.text();
  const { rows, errors } = parseCustomerCsv(text);
  if (!rows.length && !errors.length) redirect("/admin/users?importError=В+файле+нет+строк");

  const db = await getDb();
  const [batch] = await db
    .insert(customerImportBatches)
    .values({ source: "AZS", fileName: file.name, totalRows: rows.length + errors.length, createdBy: user.id })
    .returning();

  const [contacts, userRows] = await Promise.all([
    db.select().from(marketingContacts),
    db.select({ id: users.id, phone: users.phone, email: users.email }).from(users),
  ]);

  const byExternal = new Map<string, MarketingContact>();
  const byPhone = new Map<string, MarketingContact>();
  const byEmail = new Map<string, MarketingContact>();
  for (const contact of contacts) {
    if (contact.externalId) byExternal.set(contact.externalId, contact);
    if (contact.phone) byPhone.set(contact.phone, contact);
    if (contact.email) byEmail.set(contact.email.toLowerCase(), contact);
  }
  const userByPhone = new Map<string, string>();
  const userByEmail = new Map<string, string>();
  for (const row of userRows) {
    const phone = row.phone ? normalizePhone(row.phone) : null;
    if (phone) userByPhone.set(phone, row.id);
    if (row.email) userByEmail.set(row.email.toLowerCase(), row.id);
  }

  let imported = 0;
  let updated = 0;
  const allErrors = [...errors];

  for (const row of rows) {
    try {
      const existing = (row.externalId ? byExternal.get(row.externalId) : undefined) ?? (row.phone ? byPhone.get(row.phone) : undefined) ?? (row.email ? byEmail.get(row.email) : undefined);
      const linkedUserId = existing?.userId ?? (row.phone ? userByPhone.get(row.phone) : undefined) ?? (row.email ? userByEmail.get(row.email) : undefined) ?? null;
      const values = {
        source: "AZS",
        externalId: row.externalId,
        userId: linkedUserId,
        name: row.name ?? existing?.name ?? null,
        phone: row.phone,
        email: row.email,
        consentEmail: row.consentEmail || existing?.consentEmail || false,
        consentSms: row.consentSms || existing?.consentSms || false,
        consentAt: row.consentAt ?? existing?.consentAt ?? null,
        consentSource: row.consentSource ?? existing?.consentSource ?? "AZS",
        lastVisitAt: row.lastVisitAt ?? existing?.lastVisitAt ?? null,
        visitsCount: row.visitsCount || existing?.visitsCount || 0,
        fuelSpend: row.fuelSpend || existing?.fuelSpend || 0,
        shopSpend: row.shopSpend || existing?.shopSpend || 0,
        bonusBalance: row.bonusBalance || existing?.bonusBalance || 0,
        status: row.status || existing?.status || "ACTIVE",
        updatedAt: new Date(),
      };

      let saved: MarketingContact;
      if (existing) {
        const [result] = await db.update(marketingContacts).set(values).where(eq(marketingContacts.id, existing.id)).returning();
        saved = result;
        updated += 1;
      } else {
        const [result] = await db.insert(marketingContacts).values(values).returning();
        saved = result;
        imported += 1;
      }
      if (saved.externalId) byExternal.set(saved.externalId, saved);
      if (saved.phone) byPhone.set(saved.phone, saved);
      if (saved.email) byEmail.set(saved.email.toLowerCase(), saved);
    } catch (error) {
      allErrors.push({ row: row.row, message: (error as Error).message });
    }
  }

  await db
    .update(customerImportBatches)
    .set({ importedRows: imported, updatedRows: updated, skippedRows: allErrors.length, errors: allErrors.slice(0, 100) })
    .where(eq(customerImportBatches.id, batch.id));

  revalidatePath("/admin/users");
  redirect(`/admin/users?imported=${imported}&updated=${updated}&skipped=${allErrors.length}`);
}
