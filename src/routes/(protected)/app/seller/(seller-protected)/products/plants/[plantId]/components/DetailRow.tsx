import { Show, type JSX } from "solid-js";

export function DetailRow(props: { label: string; value: string | number | any; icon?: () => JSX.Element }) {
  return (
    <div class="flex items-start gap-3 py-3 border-b border-cream-100 dark:border-forest-700/50 last:border-b-0">
      <Show when={props?.icon!==undefined}>
        {(icon) => (
          <div class="mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0">{icon()}</div>
        )}
      </Show>
      <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-500 dark:text-gray-400">{props.label}</p>
        <p class="text-sm font-medium text-forest-800 dark:text-cream-50 mt-0.5">
          {typeof props.value === "string" || typeof props.value === "number" ? props.value : props.value}
        </p>
      </div>
    </div>
  );
}
