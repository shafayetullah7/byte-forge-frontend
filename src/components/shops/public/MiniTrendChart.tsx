import { For } from "solid-js";
import type { Component } from "solid-js";
import type { PublicShopStatisticsPoint } from "~/lib/types/public/shops.types";

export const MiniTrendChart: Component<{
  data: PublicShopStatisticsPoint[];
  label: string;
  valuePrefix?: string;
  valueSuffix?: string;
}> = (props) => {
  const max = () => Math.max(...props.data.map((d) => d.value), 1);

  return (
    <div class="rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 p-4">
      <p class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-3">{props.label}</p>
      <div class="flex items-end gap-1.5 h-20" role="img" aria-label={props.label}>
        <For each={props.data}>
          {(point) => (
            <div class="flex-1 flex flex-col items-center gap-1">
              <div
                class="w-full rounded-t bg-forest-400 dark:bg-forest-500 transition-all min-h-[4px]"
                style={{ height: `${(point.value / max()) * 100}%` }}
                title={`${point.label}: ${props.valuePrefix ?? ""}${point.value}${props.valueSuffix ?? ""}`}
              />
              <span class="text-[10px] text-gray-400 dark:text-gray-500">{point.label}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
