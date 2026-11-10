import { Download, Upload, Users } from "lucide-react";
import { count, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { customerImportBatches, marketingContacts } from "@/db/schema";
import { importCustomers } from "@/app/admin/users/import-action";
import { formatPrice } from "@/lib/money";
import { getAdminUsers } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Flash } from "@/components/admin/flash";
import { toggleUserBlock, updateUserRole } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; q?: string; imported?: string; updated?: string; skipped?: string; importError?: string }>;
}) {
  const { ok, error, q, imported, updated, skipped, importError } = await searchParams;
  const [rows, staff] = await Promise.all([getAdminUsers(q), getCurrentUser()]);
  const isAdmin = staff?.role === "ADMIN";
  const db = await getDb();
  const [[contactCount], contacts, [lastBatch]] = await Promise.all([
    db.select({ value: count() }).from(marketingContacts),
    db.select().from(marketingContacts).orderBy(desc(marketingContacts.createdAt)).limit(20),
    db.select().from(customerImportBatches).orderBy(desc(customerImportBatches.createdAt)).limit(1),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Клиенты</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Пользователи</h1>
          <p className="mt-1 text-[12px] text-muted">{rows.length} аккаунтов · управление ролями и блокировкой</p>
        </div>
        <form method="get" className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="Имя, email, телефон" className="field h-9 w-56 rounded-full text-[11px]" />
          <button type="submit" className="btn-secondary btn-sm">Найти</button>
        </form>
      </div>

      <Flash ok={ok} error={error} />
      {importError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[12px] text-red-700">{importError}</p>}
      {imported !== undefined && (
        <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-[12px] text-brand-900">
          Импорт завершён: добавлено <strong>{imported}</strong>, обновлено <strong>{updated ?? 0}</strong>, пропущено <strong>{skipped ?? 0}</strong>.
        </p>
      )}

      <section className="mt-5 rounded-2xl border border-line/70 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">Импорт клиентов АЗС</h2>
            <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-muted">
              Контакты загружаются отдельно от аккаунтов: пароли не создаются, согласия сохраняются. Существующие пользователи связываются по телефону или email.
            </p>
          </div>
          <a href="/api/admin/export/customers-template" className="btn-secondary btn-sm"><Download className="h-3.5 w-3.5" /> Шаблон CSV</a>
        </div>
        <form action={importCustomers} encType="multipart/form-data" className="mt-3 flex flex-wrap items-center gap-2">
          <input type="file" name="file" accept=".csv,text/csv" required className="min-w-0 flex-1 text-[11px] text-muted file:mr-2 file:rounded-full file:border-0 file:bg-cream file:px-3 file:py-1.5 file:text-[10px] file:font-semibold" />
          <button type="submit" className="btn-primary btn-sm"><Upload className="h-3.5 w-3.5" /> Импортировать</button>
        </form>
        <p className="mt-2 text-[10px] text-muted">CSV до 5 МБ, разделитель ; или ,. Обязательно phone или email. Колонки согласий — consent_email и consent_sms.</p>
        {lastBatch && (
          <p className="mt-2 text-[10px] text-muted">
            Последний импорт: {lastBatch.fileName} · {lastBatch.totalRows} строк · добавлено {lastBatch.importedRows}, обновлено {lastBatch.updatedRows}, ошибок {lastBatch.skippedRows}
          </p>
        )}
      </section>

      <section className="mt-4 overflow-hidden rounded-2xl border border-line/70 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <h2 className="font-display text-lg font-bold">Импортированные контакты</h2>
            <p className="text-[10px] text-muted">{contactCount?.value ?? 0} профилей из сети АЗС</p>
          </div>
          <span className="badge-green">AZS</span>
        </div>
        {contacts.length === 0 ? (
          <p className="p-5 text-[12px] text-muted">Пока нет импортированных контактов.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[11px]">
              <thead className="border-b border-line bg-cream/50 text-[9px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Клиент</th>
                  <th className="px-4 py-2.5 font-semibold">Контакты</th>
                  <th className="px-4 py-2.5 font-semibold">Согласия</th>
                  <th className="px-4 py-2.5 font-semibold">Последний визит</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Визиты</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Топливо</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Магазин</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Бонусы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-4 py-2.5"><p className="font-semibold">{contact.name ?? "Без имени"}</p><p className="text-[9px] text-muted">{contact.userId ? "связан с аккаунтом" : "без аккаунта"}</p></td>
                    <td className="px-4 py-2.5 text-muted">{contact.phone ?? "—"}<br />{contact.email ?? "—"}</td>
                    <td className="px-4 py-2.5">{contact.consentEmail ? <span className="badge-green">email</span> : null}{contact.consentSms ? <span className="badge-orange ml-1">SMS</span> : null}{!contact.consentEmail && !contact.consentSms && <span className="text-muted">нет</span>}</td>
                    <td className="px-4 py-2.5 text-muted">{contact.lastVisitAt ? contact.lastVisitAt.toLocaleDateString("ru-RU") : "—"}</td>
                    <td className="px-4 py-2.5 text-right">{contact.visitsCount}</td>
                    <td className="px-4 py-2.5 text-right">{formatPrice(contact.fuelSpend)}</td>
                    <td className="px-4 py-2.5 text-right">{formatPrice(contact.shopSpend)}</td>
                    <td className="px-4 py-2.5 text-right">{contact.bonusBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {!isAdmin && (
        <p className="mt-4 rounded-xl bg-accent-50 px-4 py-3 text-[11.5px] text-accent-700">
          Вы вошли как менеджер: просмотр доступен, блокировка и смена ролей — только администратор.
        </p>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-line/70 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[12px]">
            <thead className="border-b border-line bg-cream/50 text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Пользователь</th>
                <th className="px-4 py-3 font-semibold">Контакты</th>
                <th className="px-4 py-3 font-semibold">Бонусы</th>
                <th className="px-4 py-3 font-semibold">Роль</th>
                <th className="px-4 py-3 font-semibold">Регистрация</th>
                <th className="px-4 py-3 font-semibold">Доступ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {rows.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2.5">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-[10px] text-muted">{user.email}</p>
                  </td>
                  <td className="px-4 py-2.5 text-muted">{user.phone ?? "—"}</td>
                  <td className="px-4 py-2.5">{user.bonusBalance}</td>
                  <td className="px-4 py-2.5">
                    {isAdmin ? (
                      <form action={updateUserRole} className="flex items-center gap-1.5">
                        <input type="hidden" name="id" value={user.id} />
                        <select name="role" defaultValue={user.role} className="h-7 rounded-lg border border-line bg-white px-1.5 text-[10px]">
                          <option value="CUSTOMER">Клиент</option>
                          <option value="MANAGER">Менеджер</option>
                          <option value="ADMIN">Админ</option>
                          <option value="MARKETER">Маркетолог</option>
                          <option value="EDITOR">Редактор</option>
                        </select>
                        <button type="submit" className="text-[10px] font-semibold text-brand-900">OK</button>
                      </form>
                    ) : (
                      <span className="badge-outline">{user.role}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-2.5">
                    <form action={toggleUserBlock}>
                      <input type="hidden" name="id" value={user.id} />
                      <button type="submit" disabled={!isAdmin} className={`badge ${user.isBlocked ? "bg-red-50 text-red-700" : "bg-brand-100 text-brand-900"} disabled:opacity-50`}>
                        {user.isBlocked ? "заблокирован" : "активен"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[10px] text-muted"><Users className="h-3 w-3" /> Пароли хранятся в виде bcrypt-хешей и недоступны администратору.</p>
    </div>
  );
}
