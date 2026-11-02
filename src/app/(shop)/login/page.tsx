import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Вход в личный кабинет",
  description: "Войдите в личный кабинет «Ирбис Март»: история заказов, бонусы и персональные предложения.",
  robots: { index: false, follow: true },
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/account");
  return (
    <AuthShell
      title="С возвращением"
      subtitle="Войдите, чтобы проверить бонусы и повторить любимый заказ."
      quote="Заказываю комбо на ужин и забираю по пути домой. Быстро, свежо и без очереди."
      author="Дмитрий · Новая Тура"
    >
      <Suspense fallback={<div className="text-sm text-muted">Загружаем форму…</div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
