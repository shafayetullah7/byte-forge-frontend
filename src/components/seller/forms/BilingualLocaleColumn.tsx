import { Show, type JSX } from "solid-js";
import { CheckCircleIcon } from "~/components/icons";

export function BilingualLocaleColumn(props: {
  locale: "en" | "bn";
  title: string;
  subtitle: string;
  isComplete: boolean;
  optional?: boolean;
  optionalLabel?: string;
  children: JSX.Element;
}) {
  const badgeClass =
    props.locale === "en"
      ? "bg-gradient-to-br from-forest-500 to-forest-600"
      : "bg-gradient-to-br from-terracotta-500 to-terracotta-600";

  return (
    <div class="space-y-4">
      <div class="flex items-center gap-2 mb-2">
        <div
          class={`flex items-center justify-center w-8 h-8 rounded-lg text-white text-sm font-bold shrink-0 ${badgeClass}`}
        >
          {props.locale === "en" ? "EN" : "বা"}
        </div>
        <div class="min-w-0">
          <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200">{props.title}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">{props.subtitle}</p>
        </div>
        <Show when={props.optional}>
          <span class="text-xs text-gray-400 dark:text-gray-500 shrink-0">
            ({props.optionalLabel ?? "optional"})
          </span>
        </Show>
        <div class="ml-auto shrink-0">
          <Show when={props.isComplete}>
            <CheckCircleIcon class="w-5 h-5 text-forest-500" />
          </Show>
          <Show when={!props.isComplete}>
            <div class="w-5 h-5 rounded-full border-2 border-cream-300 dark:border-forest-600" />
          </Show>
        </div>
      </div>
      {props.children}
    </div>
  );
}
