"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validation";
import { track } from "@/lib/analytics";
import type { z } from "zod";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const requestedNext = params.get("next");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось войти");
      track("login", { method: "email" });
      toast.success(`С возвращением, ${data.user.name.split(" ")[0]}!`);
      const role = data.user.role as "CUSTOMER" | "MANAGER" | "ADMIN" | "MARKETER" | "EDITOR";
      const fallback = role === "CUSTOMER" ? "/account" : role === "ADMIN" || role === "MANAGER" ? "/admin" : "/admin/content";
      router.push(requestedNext ?? fallback);
      router.refresh();
    } catch (error) {
      setServerError((error as Error).message);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" type="email" {...register("email")} className="field" placeholder="you@example.com" autoComplete="email" />
        {errors.email && <p className="mt-1 text-[11px] text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="label">Пароль</label>
          <Link href="/forgot-password" className="mb-1 text-[11px] font-semibold text-brand-900 hover:text-accent-600">
            Забыли?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="field pr-11"
            placeholder="••••••••"
            autoComplete="current-password"
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

      {serverError && <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700">{serverError}</p>}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        Войти
      </button>

      <p className="text-center text-[12px] text-muted">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-semibold text-brand-900 hover:text-accent-600">
          Зарегистрироваться
        </Link>
      </p>

      {process.env.NODE_ENV !== "production" && (
      <div className="rounded-2xl border border-dashed border-line bg-cream/60 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Демо-доступ</p>
          <button
            type="button"
            onClick={() => {
              setValue("email", "client@irbis-mart.ru");
              setValue("password", "Client123!");
            }}
            className="mt-1.5 w-full text-left text-[11px] text-ink-soft hover:text-brand-900"
          >
            Покупатель: client@irbis-mart.ru · Client123!
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("email", "admin@irbis-mart.ru");
              setValue("password", "Admin123!");
            }}
            className="mt-1 w-full text-left text-[11px] text-ink-soft hover:text-brand-900"
          >
            Администратор: admin@irbis-mart.ru · Admin123!
          </button>
        </div>
        )}
    </form>
  );
}
