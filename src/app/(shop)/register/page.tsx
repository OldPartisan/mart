import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Регистрация — 300 бонусов",
  description: "Создайте аккаунт «Ирбис Март» и получите 300 приветственных бонусов. 1 бонус = 1 ₽.",
  robots: { index: false, follow: true },
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/account");
  return (
    <AuthShell
      title="Создать аккаунт"
      subtitle="300 бонусов сразу, история заказов и повтор покупки в один клик."
      image="/images/farmer.jpg"
      quote="Мы привозим мёд через день после откачки. Нам важно, чтобы на полке стоял свежий продукт."
      author="Рашид Гимадиев · пасека в Осиново"
    >
      <Suspense fallback={<div className="text-sm text-muted">Загружаем форму…</div>}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
