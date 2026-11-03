"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
    if (process.env.NEXT_PUBLIC_STATIC_DEMO === "1") {
      setStatus("done");
      return;
    }
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Не получилось подписаться");
      }
      setStatus("done");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  };

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-[12px] text-brand-900">
        <Check className="h-4 w-4 text-accent-300" /> Готово — акции и новинки будут приходить на почту.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className={compact ? "flex flex-col gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        <label htmlFor={compact ? "newsletter-compact" : "newsletter"} className="sr-only">
          Email для рассылки
        </label>
        <input
          id={compact ? "newsletter-compact" : "newsletter"}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Ваш email"
          className="h-10 flex-1 rounded-lg border border-line bg-white px-3 text-[12px] text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/10"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-900 px-4 text-[12px] font-semibold text-white transition hover:bg-brand-950 disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Подписаться
        </button>
      </div>
      <p className="mt-2 text-[9.5px] leading-relaxed text-muted">
        Нажимая «Подписаться», вы соглашаетесь с{" "}
        <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-ink">
          политикой конфиденциальности
        </Link>
        . Отписаться можно в один клик.
      </p>
      {status === "error" && <p className="mt-2 text-[11px] text-accent-600">{error}</p>}
    </form>
  );
}
