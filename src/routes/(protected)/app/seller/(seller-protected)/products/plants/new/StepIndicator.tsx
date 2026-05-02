import { Show, For } from "solid-js";

export interface StepInfo {
  number: number;
  title: string;
  isComplete: boolean;
  hasWarning: boolean;
  isCurrent: boolean;
  isPreview: boolean;
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
                  : step.isPreview
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"
                  : "bg-cream-200 text-gray-400 hover:bg-cream-300 cursor-pointer"
              }`}
            >
              {step.isComplete ? (
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              ) : step.isPreview ? (
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
