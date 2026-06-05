import { Component, For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import {
  CheckIcon,
  MapPinIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from "~/components/icons";

type CheckoutStep = "address" | "review" | "payment";

interface StepIndicatorProps {
  currentStep: CheckoutStep;
}

const stepIcons: Record<CheckoutStep, any> = {
  address: MapPinIcon,
  review: DocumentTextIcon,
  payment: CreditCardIcon,
};

const stepOrder: CheckoutStep[] = ["address", "review", "payment"];

const CheckoutStepIndicator: Component<StepIndicatorProps> = (props) => {
  const { t } = useI18n();

  const currentStepIndex = () => stepOrder.findIndex((s) => s === props.currentStep);

  return (
    <nav aria-label="Progress">
      <ol class="flex items-center w-full">
        <For each={stepOrder}>
          {(stepKey, index) => {
            const Icon = stepIcons[stepKey];
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
                    {t(`checkout.steps.${stepKey}`)}
                  </span>
                </div>

                {/* Connector line */}
                <Show when={index() < stepOrder.length - 1}>
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
