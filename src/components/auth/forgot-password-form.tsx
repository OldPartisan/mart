"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось отправить письмо");
      setMessage(data.message);
      if (data.demoResetUrl) setDemoUrl(data.demoResetUrl);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return (
      <div>
        <div className="rounded-2xl bg-brand-50 p-4 text-[12.5px] text-brand-900">
          <Mail className="mb-2 h-4 w-4" />
          {message}
        </div>
        {demoUrl && (
          <div className="mt-3 rounded-2xl border border-dashed border-line bg-cream p-3 text-[11px]">
            <p className="font-semibold text-ink">Демо-режим (SMTP не настроен):</p>
            <Link href={demoUrl} className="mt-1 block break-all text-brand-900 underline underline-offset-2">
              {demoUrl}
            </Link>
          </div>
        )}
        <Link href="/login" className="btn-secondary mt-4 w-full">
          <ArrowLeft className="h-4 w-4" /> Вернуться ко входу
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">Email аккаунта</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        Отправить ссылку
      </button>
      <Link href="/login" className="flex items-center justify-center gap-1 text-[12px] font-semibold text-muted hover:text-brand-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Назад
      </Link>
    </form>
  );
}
