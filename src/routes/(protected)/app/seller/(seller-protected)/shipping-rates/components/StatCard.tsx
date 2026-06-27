import type { Component } from "solid-js";

interface StatCardProps {
  icon: Component<{ class?: string }>;
  label: string;
  value: string | number;
  color: "forest" | "terracotta" | "cream";
}

const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
  forest: { bg: "bg-forest-100 dark:bg-forest-900/40", icon: "text-forest-600 dark:text-forest-400", text: "text-forest-800 dark:text-cream-50" },
  terracotta: { bg: "bg-terracotta-100 dark:bg-terracotta-900/40", icon: "text-terracotta-600 dark:text-terracotta-400", text: "text-terracotta-800 dark:text-cream-50" },
  cream: { bg: "bg-cream-200 dark:bg-cream-800/40", icon: "text-cream-700 dark:text-cream-300", text: "text-cream-800 dark:text-cream-100" },
};

export const StatCard: Component<StatCardProps> = (props) => {
  const c = colorClasses[props.color] || colorClasses.forest;
  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-4 shadow-sm">
      <div class="flex items-center gap-3">
        <div class={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <props.icon class={`w-4 h-4 ${c.icon}`} />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{props.label}</p>
          <p class={`text-lg font-bold ${c.text} truncate`}>{props.value}</p>
        </div>
      </div>
    </div>
  );
};
