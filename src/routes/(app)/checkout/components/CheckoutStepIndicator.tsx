import { Component, For, Show } from "solid-js";
import {
  CheckIcon,
  MapPinIcon,
  DocumentTextIcon,
} from "~/components/icons";

type CheckoutStep = "address" | "review" | "confirmation";

interface StepIndicatorProps {
  currentStep: CheckoutStep;
}

const steps: { key: CheckoutStep; number: number; label: string; icon: any }[] = [
  { key: "address", number: 1, label: "Shipping Address", icon: MapPinIcon },
  { key: "review", number: 2, label: "Review Order", icon: DocumentTextIcon },
  { key: "confirmation", number: 3, label: "Confirmation", icon: CheckIcon },
];

const CheckoutStepIndicator: Component<StepIndicatorProps> = (props) => {
  const currentStepIndex = () => steps.findIndex((s) => s.key === props.currentStep);

  return (
    <nav aria-label="Progress">
      <ol class="flex items-center w-full">
        <For each={steps}>
          {(step, index) => {
            const Icon = step.icon;
            const isCompleted = index() < currentStepIndex();
            const isCurrent = index() === currentStepIndex();

            return (
              <li class="flex items-center">
                {/* Step circle */}
                <div class="flex items-center">
                  <Show
                    when={isCompleted}
                    fallback={
                      <div
                        class={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                          isCurrent
                            ? "border-forest-600 bg-forest-600 text-white"
                            : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        <Icon class="w-5 h-5" />
                      </div>
                    }
                  >
                    <div class="flex items-center justify-center w-10 h-10 rounded-full bg-forest-600 text-white">
                      <CheckIcon class="w-5 h-5" />
                    </div>
                  </Show>
                </div>

                {/* Step label */}
                <div class="ml-3">
                  <span
                    class={`text-sm font-medium ${
                      isCurrent
                        ? "text-forest-800 dark:text-cream-50"
                        : isCompleted
                        ? "text-forest-600 dark:text-forest-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                <Show when={index() < steps.length - 1}>
                  <div
                    class={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? "bg-forest-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                </Show>
              </li>
            );
          }}
        </For>
      </ol>
    </nav>
  );
};

export default CheckoutStepIndicator;
