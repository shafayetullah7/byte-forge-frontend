import { Show, For } from "solid-js";

export interface StepInfo {
  number: number;
  title: string;
  isComplete: boolean;
  hasWarning: boolean;
  warningCount: number;
  isCurrent: boolean;
  isOptional: boolean;
}

export function StepIndicator(props: {
  steps: StepInfo[];
  onStepClick: (step: number) => void;
}) {
  return (
    <nav class="flex items-center gap-0 py-4 px-2">
      <For each={props.steps}>
        {(step, idx) => (
          <div class="flex items-center flex-1 last:flex-none">
            {/* Step Circle */}
            <button
              type="button"
              onClick={() => props.onStepClick(step.number)}
              class={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                step.isCurrent
                  ? "bg-forest-600 text-white scale-110 shadow-lg shadow-forest-600/30"
                  : step.isComplete
                  ? "bg-forest-100 text-forest-700 hover:bg-forest-200 cursor-pointer"
                  : step.hasWarning
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer"
                  : step.isOptional
                  ? "bg-cream-100 text-gray-400 hover:bg-cream-200 cursor-pointer"
                  : "bg-cream-200 text-gray-400 hover:bg-cream-300 cursor-pointer"
              }`}
            >
              {step.isComplete ? (
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </button>

            {/* Connector Line */}
            <Show when={idx() < props.steps.length - 1}>
              <div class={`flex-1 h-0.5 mx-2 transition-colors duration-200 ${
                step.isComplete ? "bg-forest-400" : "bg-cream-300"
              }`} />
            </Show>
          </div>
        )}
      </For>
    </nav>
  );
}
