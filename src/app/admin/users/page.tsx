import { Users } from "lucide-react";
import { getAdminUsers } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Flash } from "@/components/admin/flash";
import { toggleUserBlock, updateUserRole } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; q?: string }>;
}) {
  const { ok, error, q } = await searchParams;
  const [rows, staff] = await Promise.all([getAdminUsers(q), getCurrentUser()]);
  const isAdmin = staff?.role === "ADMIN";

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
