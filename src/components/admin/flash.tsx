export function Flash({ ok, error }: { ok?: string; error?: string }) {
  if (!ok && !error) return null;
  return (
    <div className={`mt-4 rounded-xl px-4 py-3 text-[12px] font-medium ${error ? "bg-red-50 text-red-700" : "bg-brand-50 text-brand-900"}`}>
      {error ?? ok}
    </div>
  );
}
