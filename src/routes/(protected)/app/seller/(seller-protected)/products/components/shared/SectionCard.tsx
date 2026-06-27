import type { JSX } from "solid-js";

export function SectionCard(props: {
  title: string;
  icon?: JSX.Element;
  action?: JSX.Element;
  children: JSX.Element;
}) {
  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
      <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
          {props.icon}
          <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">{props.title}</h3>
        </div>
        {props.action}
      </div>
      <div class="p-6">
        {props.children}
      </div>
    </div>
  );
}
