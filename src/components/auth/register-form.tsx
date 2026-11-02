"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Gift, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { registerSchema } from "@/lib/validation";
import { track } from "@/lib/analytics";
import type { z } from "zod";

type RegisterValues = z.input<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const referral = params.get("ref") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      consent: false as unknown as true,
      marketingOptIn: true,
      referral,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось зарегистрироваться");
      track("sign_up", { method: "email" });
      toast.success("Аккаунт создан", { description: data.message });
      router.push("/account");
      router.refresh();
    } catch (error) {
      setServerError((error as Error).message);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3.5" noValidate>
      <div className="flex items-center gap-2 rounded-2xl bg-accent-50 px-3.5 py-2.5 text-[11px] font-semibold text-accent-700">
        <Gift className="h-4 w-4" /> Начислим 300 бонусов сразу после регистрации
      </div>

      <div>
        <label htmlFor="name" className="label">Имя</label>
        <input id="name" {...register("name")} className="field" placeholder="Алия" autoComplete="name" />
        {errors.name && <p className="mt-1 text-[11px] text-red-600">{errors.name.message}</p>}
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" {...register("email")} className="field" placeholder="you@example.com" autoComplete="email" />
          {errors.email && <p className="mt-1 text-[11px] text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="label">Телефон</label>
          <input id="phone" {...register("phone")} className="field" placeholder="+7 (917) 000-00-00" autoComplete="tel" inputMode="tel" />
          {errors.phone && <p className="mt-1 text-[11px] text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="label">Пароль</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="field pr-11"
            placeholder="Минимум 8 символов, буквы и цифры"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-ink/5"
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-[11px] text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="referral" className="label">Код друга <span className="font-normal text-muted">(необязательно)</span></label>
        <input id="referral" {...register("referral")} className="field" placeholder="IRBIS-XXXXXX" />
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-snug text-muted">
        <input type="checkbox" {...register("consent")} className="mt-0.5 h-4 w-4 accent-[#2E7D32]" />
        <span>
          Согласен с{" "}
          <Link href="/legal/terms" className="underline underline-offset-2 hover:text-ink">условиями</Link> и{" "}
          <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-ink">политикой обработки данных</Link>
        </span>
      </label>
      {errors.consent && <p className="text-[11px] text-red-600">{errors.consent.message}</p>}

      <label className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-snug text-muted">
        <input type="checkbox" {...register("marketingOptIn")} className="mt-0.5 h-4 w-4 accent-[#2E7D32]" />
        <span>Присылать акции и новинки на почту. Можно отписаться в один клик.</span>
      </label>

      {serverError && <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700">{serverError}</p>}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        Создать аккаунт
      </button>

      <p className="text-center text-[12px] text-muted">
        Уже с нами?{" "}
        <Link href="/login" className="font-semibold text-brand-800 hover:text-accent-600">
          Войти
        </Link>
      </p>
    </form>
  );
}
