const labels: Record<string, string> = {
  DRAFT: "Черновик",
  IN_REVIEW: "На согласовании",
  PUBLISHED: "Опубликовано",
  SCHEDULED: "Запланировано",
  ARCHIVED: "Архив",
};

const classes: Record<string, string> = {
  DRAFT: "bg-[#F3F3F3] text-ink-soft",
  IN_REVIEW: "bg-accent-100 text-accent-700",
  PUBLISHED: "bg-brand-100 text-brand-900",
  SCHEDULED: "bg-accent-100 text-accent-700",
  ARCHIVED: "bg-line text-muted",
};

export function ContentStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex w-fit rounded-full px-2 py-1 text-[10px] font-semibold ${classes[status] ?? classes.DRAFT}`}>
      {labels[status] ?? status}
    </span>
  );
}
