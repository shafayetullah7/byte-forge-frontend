import { XIcon } from "~/components/icons";

export function FilterChip(props: { label: string; onRemove: () => void }) {
  return (
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 border border-forest-200 dark:border-forest-800">
      {props.label}
      <button
        onClick={props.onRemove}
        class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-800 transition-colors"
      >
        <XIcon class="w-3 h-3" />
      </button>
    </span>
  );
}
