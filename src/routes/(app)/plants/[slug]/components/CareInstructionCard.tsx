import { Show, type Component } from "solid-js";

const CareInstructionCard: Component<{
  icon: Component<{ class?: string }>;
  title: string;
  description: string | null;
  iconColor: string;
  bgColor: string;
}> = (props) => {
  return (
    <Show when={props.description}>
      <div class={`p-5 rounded-xl ${props.bgColor} border border-cream-200/50 dark:border-forest-700/50`}>
        <div class="flex items-start gap-3">
          <div class={`${props.iconColor} flex-shrink-0 mt-0.5`}>
            <props.icon class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{props.title}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.description}</p>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default CareInstructionCard;
