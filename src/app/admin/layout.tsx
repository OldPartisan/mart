import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/ui/logo";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Админ-панель", template: "%s — Админ-панель «Ирбис Март»" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!isStaff(user)) redirect("/account");

  return (
    <div className="min-h-screen bg-[#F4F1E8] lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="bg-brand-950 text-cream lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center justify-between p-4 lg:block">
          <Logo inverted />
          <div className="flex items-center gap-2.5 rounded-2xl bg-white/5 p-2.5 lg:mt-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/15 text-[11px] font-bold">
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-bold">{user.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-cream/45">{user.role === "ADMIN" ? "администратор" : user.role === "MANAGER" ? "менеджер" : user.role === "MARKETER" ? "маркетолог" : user.role === "EDITOR" ? "редактор" : "сотрудник"}</p>
            </div>
          </div>
        </div>
        <AdminNav role={user.role} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
