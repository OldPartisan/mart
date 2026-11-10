"use client";

import { useState, useTransition } from "react";
import { Check, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { changeAdminPassword } from "@/app/admin/security/actions";

export function SecurityForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [pending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (next !== confirm) {
      toast.error("Пароли не совпадают");
      return;
    }
    startTransition(async () => {
      try {
        await changeAdminPassword({ current, next });
        setCurrent("");
        setNext("");
        setConfirm("");
        toast.success("Пароль изменён");
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <form onSubmit={submit} className="mt-6 max-w-xl rounded-[18px] border border-line bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-900"><LockKeyhole className="h-4 w-4" /></span>
        <div>
          <h2 className="font-display text-lg font-bold">Смена пароля</h2>
          <p className="text-[11px] text-muted">Минимум 10 символов, буквы и цифры</p>
        </div>
      </div>

      <label className="mt-5 block text-[11px] font-semibold text-muted">Текущий пароль
        <div className="relative mt-1">
          <input type={show ? "text" : "password"} value={current} onChange={(event) => setCurrent(event.target.value)} className="field pr-11" autoComplete="current-password" required />
          <button type="button" onClick={() => setShow((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-label={show ? "Скрыть пароль" : "Показать пароль"}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </label>

      <label className="mt-4 block text-[11px] font-semibold text-muted">Новый пароль
        <input type={show ? "text" : "password"} value={next} onChange={(event) => setNext(event.target.value)} className="field mt-1" autoComplete="new-password" required minLength={10} />
      </label>
      <label className="mt-4 block text-[11px] font-semibold text-muted">Повторите новый пароль
        <input type={show ? "text" : "password"} value={confirm} onChange={(event) => setConfirm(event.target.value)} className="field mt-1" autoComplete="new-password" required minLength={10} />
      </label>

      <button type="submit" disabled={pending} className="btn-primary mt-5 w-full">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {pending ? "Сохраняем…" : "Изменить пароль"}
      </button>
      <p className="mt-2 text-center text-[10px] text-muted">Пароль хранится в виде bcrypt-хеша и не выводится в интерфейс.</p>
    </form>
  );
}
