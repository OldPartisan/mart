import { SecurityForm } from "@/components/admin/security-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Безопасность" };

export default function SecurityPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">Аккаунт</p>
      <h1 className="mt-1 text-2xl font-bold text-ink">Безопасность</h1>
      <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted">
        Смена пароля администратора или менеджера. После смены старый пароль перестанет работать.
      </p>
      <SecurityForm />
    </div>
  );
}
