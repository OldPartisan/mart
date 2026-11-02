import type { Metadata } from "next";
import { Gift } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getUserAddresses } from "@/lib/queries";
import { ProfileForm } from "@/components/account/profile-form";
import { AddressManager } from "@/components/account/address-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Профиль и адреса" };

export default async function ProfilePage() {
  const user = (await getCurrentUser())!;
  const addresses = await getUserAddresses(user.id);

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Аккаунт</p>
        <h1 className="mt-2 text-h1 font-bold text-ink">Профиль</h1>
        <p className="mt-1.5 text-[13px] text-muted">Контакты, адреса доставки и настройки рассылки.</p>
      </div>

      <ProfileForm user={{ name: user.name, email: user.email, phone: user.phone, marketingOptIn: user.marketingOptIn }} />
      <AddressManager addresses={addresses.map((address) => ({ ...address }))} />

      <div className="rounded-3xl border border-line/80 bg-brand-50 p-5">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand-800">
          <Gift className="h-3.5 w-3.5" /> Код друга
        </p>
        <p className="mt-2 font-display text-lg font-extrabold tracking-wider text-brand-900">{user.referralCode}</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-brand-800/80">
          Поделитесь кодом: другу — 300 бонусов за регистрацию, вам — 300 бонусов за приглашение.
        </p>
      </div>
    </div>
  );
}
