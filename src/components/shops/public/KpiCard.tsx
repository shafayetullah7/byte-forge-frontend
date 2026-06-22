import type { Component, JSX } from "solid-js";

export const KpiCard: Component<{
  label: string;
  value: string | number;
  suffix?: string;
  icon?: JSX.Element;
}> = (props) => (
  <div class="rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 p-4">
    <div class="flex items-start justify-between gap-2">
      <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {props.label}
      </p>
      {props.icon}
    </div>
    <p class="mt-2 text-2xl font-bold text-forest-800 dark:text-cream-50">
      {props.value}
      {props.suffix && (
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
          {props.suffix}
        </span>
      )}
    </p>
  </div>
);
