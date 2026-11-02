"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export function ProfileForm({
  user,
}: {
  user: { name: string; email: string; phone: string | null; marketingOptIn: boolean };
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [marketing, setMarketing] = useState(user.marketingOptIn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, marketingOptIn: marketing }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось сохранить");
      toast.success("Профиль обновлён");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-line/80 bg-white p-5">
      <h2 className="font-display text-lg font-bold">Личные данные</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="profile-name" className="label">Имя и фамилия</label>
          <input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} className="field" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="profile-phone" className="label">Телефон</label>
          <input id="profile-phone" value={phone} onChange={(event) => setPhone(event.target.value)} className="field" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="profile-email" className="label">Email</label>
          <input id="profile-email" value={user.email} readOnly className="field bg-cream/60 text-muted" />
        </div>
      </div>
      <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[11.5px] leading-snug text-muted">
        <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#2E7D32]" />
        Получать акции и новинки на email
      </label>
      {error && <p className="mt-3 text-[11px] text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary btn-sm mt-4">
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
        Сохранить
      </button>
    </form>
  );
}
