const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  APPROVED: "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  ARCHIVED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function ModerationStatusBadge(props: { status: string; label: string }) {
  const style = () => STATUS_STYLES[props.status] ?? STATUS_STYLES.DRAFT;
  return (
    <span class={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${style()}`}>
      {props.label}
    </span>
  );
}
