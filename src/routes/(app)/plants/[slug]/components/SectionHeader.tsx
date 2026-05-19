import { A } from "@solidjs/router";
import { ChevronRightIcon } from "~/components/icons";
import type { Component } from "solid-js";

const SectionHeader: Component<{
  icon?: Component<{ class?: string }>;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
}> = (props) => {
  return (
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-2">
          {props.icon && <props.icon class="w-5 h-5 text-forest-600 dark:text-forest-400" />}
          <h2 class="text-xl font-bold text-forest-800 dark:text-cream-50">{props.title}</h2>
        </div>
        {props.subtitle && (
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{props.subtitle}</p>
        )}
      </div>
      {props.action && (
        <A
          href={props.action.href}
          class="inline-flex items-center gap-1 text-sm font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
        >
          {props.action.label}
          <ChevronRightIcon class="w-4 h-4" />
        </A>
      )}
    </div>
  );
};

export default SectionHeader;
