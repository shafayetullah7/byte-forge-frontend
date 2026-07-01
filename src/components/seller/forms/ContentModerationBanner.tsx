import { Show } from "solid-js";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  APPROVED: "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  ARCHIVED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function ContentModerationBanner(props: {
  moderationStatus: string;
  rejectedReason?: string | null;
  moderationLabels: {
    draft: string;
    pending: string;
    approved: string;
    rejected: string;
    archived: string;
    draftHint: string;
    pendingHint?: string;
    approvedHint?: string;
    archivedHint?: string;
    rejectedHint: string;
  };
}) {
  const statusLabel = () => {
    const key = props.moderationStatus.toLowerCase() as
      | "draft"
      | "pending"
      | "approved"
      | "rejected"
      | "archived";
    return props.moderationLabels[key] ?? props.moderationStatus;
  };

  const badgeStyle = () =>
    STATUS_STYLES[props.moderationStatus] ?? STATUS_STYLES.DRAFT;

  return (
    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-3">
        <span class={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyle()}`}>
          {statusLabel()}
        </span>
        <Show when={props.moderationStatus === "DRAFT"}>
          <p class="text-sm text-gray-500 dark:text-gray-400">{props.moderationLabels.draftHint}</p>
        </Show>
        <Show when={props.moderationStatus === "PENDING" && props.moderationLabels.pendingHint}>
          <p class="text-sm text-amber-700 dark:text-amber-300">{props.moderationLabels.pendingHint}</p>
        </Show>
        <Show when={props.moderationStatus === "APPROVED" && props.moderationLabels.approvedHint}>
          <p class="text-sm text-forest-700 dark:text-forest-300">{props.moderationLabels.approvedHint}</p>
        </Show>
        <Show when={props.moderationStatus === "ARCHIVED" && props.moderationLabels.archivedHint}>
          <p class="text-sm text-gray-500 dark:text-gray-400">{props.moderationLabels.archivedHint}</p>
        </Show>
      </div>
      <Show when={props.moderationStatus === "REJECTED" && props.rejectedReason}>
        <div class="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3">
          <p class="text-sm font-medium text-red-800 dark:text-red-200">
            {props.moderationLabels.rejectedHint}
          </p>
          <p class="mt-1 text-sm text-red-700 dark:text-red-300">{props.rejectedReason}</p>
        </div>
      </Show>
    </div>
  );
}
