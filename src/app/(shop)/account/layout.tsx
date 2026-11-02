import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { AccountNav } from "@/components/account/account-nav";
import { Logo } from "@/components/ui/logo";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Личный кабинет", template: "%s — Личный кабинет «Ирбис Март»" },
  robots: { index: false, follow: false },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="bg-[#FBF8F1]">
      <div className="container-x py-6 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside>
            <div className="rounded-3xl border border-line/80 bg-white p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-[13px] font-bold text-brand-900">
                  {initials(user.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-ink">{user.name}</p>
                  <p className="truncate text-[11px] text-muted">{user.email}</p>
                </div>
              </div>
              <Link href="/account/bonuses" className="mt-3 flex items-center justify-between rounded-2xl bg-brand-900 px-3.5 py-3 text-cream">
                <span className="flex items-center gap-1.5 text-[11px] text-cream/70">
                  <Sparkles className="h-3.5 w-3.5 text-accent-300" /> Бонусы
                </span>
                <span className="font-display text-lg font-bold">{user.bonusBalance}</span>
              </Link>
            </div>

            <div className="mt-3 rounded-3xl border border-line/80 bg-cream/60 p-2">
              <AccountNav />
            </div>

            <div className="mt-3 hidden rounded-3xl border border-line/80 bg-white p-4 lg:block">
              <Logo compact className="mb-2" />
              <p className="text-[11px] leading-relaxed text-muted">
                Нужна помощь с заказом? Позвоните на стойку самовывоза — ответим в рабочие часы.
              </p>
              <Link href="/contacts" className="mt-2 inline-block text-[11px] font-semibold text-brand-800">
                Контакты →
              </Link>
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
