import type { Component } from "solid-js";

const CareBadge: Component<{
  icon: Component<{ class?: string }>;
  title: string;
  value: string;
  color: string;
  bgColor: string;
}> = (props) => {
  return (
    <div class="flex flex-col items-center gap-2 p-4 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 hover:shadow-md transition-shadow">
      <div class={`w-12 h-12 rounded-xl ${props.bgColor} flex items-center justify-center`}>
        <props.icon class={`w-6 h-6 ${props.color}`} />
      </div>
      <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{props.title}</span>
      <span class="text-sm font-semibold text-forest-800 dark:text-cream-50">{props.value}</span>
    </div>
  );
};

export default CareBadge;
