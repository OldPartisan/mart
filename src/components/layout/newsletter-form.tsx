"use client";

import { useState } from "react";
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
      <div className="flex items-center gap-2 rounded-2xl border border-cream/20 bg-cream/10 px-4 py-3 text-[13px] text-cream">
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
          className="h-12 flex-1 rounded-full border border-cream/25 bg-cream/10 px-5 text-sm text-cream placeholder:text-cream/50 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/20"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent-500 px-5 text-sm font-bold text-white transition hover:bg-accent-600 disabled:opacity-60 sm:w-auto w-full"
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Подписаться
        </button>
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-cream/45">
        Нажимая «Подписаться», вы соглашаетесь с{" "}
        <a href="/legal/privacy" className="underline decoration-cream/30 underline-offset-2 hover:text-cream">
          политикой конфиденциальности
        </a>
        . Отписаться можно в один клик.
      </p>
      {status === "error" && <p className="mt-2 text-[11px] text-accent-300">{error}</p>}
    </form>
  );
}
