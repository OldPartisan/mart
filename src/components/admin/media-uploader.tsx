"use client";

import { useState, useTransition } from "react";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

export function MediaUploader({ configured }: { configured: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  const upload = () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("alt", alt);
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/media/upload", { method: "POST", body: form });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Не удалось загрузить");
        setResult(data.media.url);
        setFile(null);
        setAlt("");
        toast.success("Файл загружен");
        window.location.reload();
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <section className="mt-6 rounded-[18px] border border-line bg-white p-5">
      <div className="flex items-center gap-2"><ImagePlus className="h-4 w-4 text-brand-700" /><h2 className="font-display text-lg font-bold">Загрузить изображение</h2></div>
      {!configured && (
        <p className="mt-3 rounded-xl bg-accent-50 px-3 py-2 text-[11px] leading-relaxed text-accent-700">
          S3 не настроен. Добавьте `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION` и при необходимости `S3_ENDPOINT`/`S3_PUBLIC_URL` в переменные окружения. Пока можно указывать URL изображения вручную в блоках.
        </p>
      )}
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="field h-11 py-2 text-[11px]" />
        <input value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="Alt-текст" className="field h-11" />
        <button type="button" onClick={upload} disabled={!file || pending || !configured} className="btn-primary h-11 text-[12px]">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Загрузить</button>
      </div>
      {result && <p className="mt-2 break-all text-[10px] text-muted">URL: {result}</p>}
    </section>
  );
}
