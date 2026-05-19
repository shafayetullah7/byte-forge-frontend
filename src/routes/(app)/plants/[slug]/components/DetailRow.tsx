import { Show, type Component } from "solid-js";

const DetailRow: Component<{
  icon: Component<{ class?: string }>;
  label: string;
  value: string | null;
  valueClass?: string;
}> = (props) => {
  return (
    <Show when={props.value}>
      <div class="flex items-start gap-3 py-3 border-b border-cream-100 dark:border-forest-700/50 last:border-b-0">
        <div class="mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0">
          <props.icon class="w-4 h-4" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-gray-500 dark:text-gray-400">{props.label}</p>
          <p class={`text-sm font-medium mt-0.5 ${props.valueClass || "text-forest-800 dark:text-cream-50"}`}>
            {props.value}
          </p>
        </div>
      </div>
    </Show>
  );
};

export default DetailRow;
