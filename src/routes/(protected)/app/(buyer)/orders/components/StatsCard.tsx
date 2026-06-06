import { For } from "solid-js";

export function StatsLoading() {
  return (
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <For each={Array.from({ length: 5 })}>
        {() => (
          <div class="h-24 bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 animate-pulse" />
        )}
      </For>
    </div>
  );
}
