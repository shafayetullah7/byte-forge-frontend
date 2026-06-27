import { Show, type JSX } from "solid-js";

export function InstructionRow(props: {
  icon: JSX.Element;
  iconColor: string;
  bgColor: string;
  titleEn: string;
  titleBn: string;
  descEn: string | null | undefined;
  descBn: string | null | undefined;
  compact?: boolean;
}) {
  const gap = () => (props.compact ? "gap-3" : "gap-4");
  const padding = () => (props.compact ? "p-3" : "p-4");

  return (
    <Show when={props.descEn || props.descBn}>
      <div class="space-y-3">
        <Show when={props.descEn}>
          <div class={`flex ${gap()} ${padding()} rounded-lg ${props.bgColor}`}>
            <div class={`${props.iconColor} flex-shrink-0 mt-0.5`}>{props.icon}</div>
            <div>
              <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{props.titleEn}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.descEn}</p>
            </div>
          </div>
        </Show>
        <Show when={props.descBn}>
          <div class={`flex ${gap()} ${padding()} rounded-lg bg-forest-50 dark:bg-forest-900/20 border-l-2 border-forest-300 dark:border-forest-600`}>
            <div class={`${props.iconColor} flex-shrink-0 mt-0.5 opacity-60`}>{props.icon}</div>
            <div>
              <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{props.titleBn}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.descBn}</p>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
}
