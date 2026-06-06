import { XCircleIcon } from "~/components/icons";

export function FilterChip(props: {
  label: string;
  onRemove: () => void;
  colorClass?: string;
}) {
  return (
    <span class={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${props.colorClass || "bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300"}`}>
      {props.label}
      <button onClick={props.onRemove} class="ml-0.5 hover:text-forest-900 dark:hover:text-forest-100">
        <XCircleIcon class="w-3 h-3" />
      </button>
    </span>
  );
}
