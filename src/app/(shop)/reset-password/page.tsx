import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Новый пароль",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <AuthShell
      title="Новый пароль"
      subtitle="Придумайте пароль минимум из 8 символов с буквами и цифрами."
      quote="Бонусы, история заказов и сохранённые адреса останутся с вами."
      author="Ирбис Март"
    >
      {token ? <ResetPasswordForm token={token} /> : <p className="text-[13px] text-red-600">Ссылка недействительна. Запросите новую.</p>}
    </AuthShell>
  );
}
