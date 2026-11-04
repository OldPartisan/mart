"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (password.length < 8 || !/\d/.test(password)) {
      setError("Пароль: минимум 8 символов и хотя бы одна цифра");
      return;
    }
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось обновить пароль");
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl bg-brand-50 p-5 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white">
          <Check className="h-5 w-5" />
        </span>
        <p className="mt-3 text-[13px] font-semibold text-brand-900">Пароль обновлён</p>
        <Link href="/login" className="btn-primary mt-4 w-full">Войти с новым паролем</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="password" className="label">Новый пароль</label>
        <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="field" autoComplete="new-password" required />
      </div>
      <div>
        <label htmlFor="confirm" className="label">Повторите пароль</label>
        <input id="confirm" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="field" autoComplete="new-password" required />
      </div>
      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Сохранить пароль
      </button>
    </form>
  );
}
