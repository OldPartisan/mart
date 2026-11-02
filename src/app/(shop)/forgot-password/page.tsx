import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Восстановление пароля",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Забыли пароль?"
      subtitle="Укажите email — пришлём ссылку для сброса. Она действует один час."
      quote="Один аккаунт — все заказы, бонусы и адреса доставки в одном месте."
      author="Ирбис Март"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
