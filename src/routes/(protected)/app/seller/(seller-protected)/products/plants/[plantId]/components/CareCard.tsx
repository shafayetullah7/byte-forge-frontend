import type { JSX } from "solid-js";

export function CareCard(props: {
  icon: JSX.Element;
  titleEn: string;
  titleBn: string;
  badge: { text: string; bg: string; textColor: string };
  description: string;
}) {
  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 p-5 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-3">
        <div class="w-10 h-10 rounded-lg bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center">
          {props.icon}
        </div>
        <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${props.badge.bg} ${props.badge.textColor}`}>
          {props.badge.text}
        </span>
      </div>
      <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{props.titleEn}</h4>
      <p class="text-sm font-medium text-forest-600 dark:text-forest-400 mb-1">{props.titleBn}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.description}</p>
    </div>
  );
}
