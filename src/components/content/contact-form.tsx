"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", consent: false });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const update = (key: keyof typeof form, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
    if (process.env.NEXT_PUBLIC_STATIC_DEMO === "1") {
      setStatus("done");
      return;
    }
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось отправить сообщение");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-3xl bg-brand-50 p-6 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-white"><Check className="h-5 w-5" /></span>
        <p className="mt-3 font-display text-lg font-bold text-brand-900">Сообщение отправлено</p>
        <p className="mt-1 text-[12px] text-brand-900/80">Ответим в течение рабочего дня. Спасибо!</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="label">Имя</label>
          <input id="contact-name" required value={form.name} onChange={(event) => update("name", event.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="contact-phone" className="label">Телефон</label>
          <input id="contact-phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} className="field" inputMode="tel" placeholder="+7 (917) 000-00-00" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-email" className="label">Email</label>
        <input id="contact-email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="field" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="contact-message" className="label">Сообщение</label>
        <textarea id="contact-message" required value={form.message} onChange={(event) => update("message", event.target.value)} className="field-area min-h-[120px]" placeholder="Вопрос, отзыв или предложение" />
      </div>
      <label className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-snug text-muted">
        <input type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#2E7D32]" />
        Согласен с обработкой персональных данных
      </label>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
      <button type="submit" disabled={status === "loading" || !form.consent} className="btn-primary w-full">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Отправить
      </button>
    </form>
  );
}
