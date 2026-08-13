import { For, Show } from "solid-js";
import Card from "~/components/ui/Card";
import { useI18n } from "~/i18n";
import type { SubscriptionPlan } from "~/lib/api/types/seller/subscription.types";
import { formatPlanPrice, planIntervalKey } from "./plan-utils";

export interface PlanSelectorProps {
  plans: SubscriptionPlan[];
  selectedPlanId: string | null;
  onSelect: (planId: string) => void;
}

export function PlanSelector(props: PlanSelectorProps) {
  const { t, locale } = useI18n();

  return (
    <Card
      title={t("seller.subscription.plans.title")}
      description={t("seller.subscription.plans.subtitle")}
    >
      <Show
        when={props.plans.length > 0}
        fallback={
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {t("seller.subscription.plans.empty")}
          </p>
        }
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <For each={props.plans}>
            {(plan) => {
              const selected = () => props.selectedPlanId === plan.id;
              return (
                <button
                  type="button"
                  class={`text-left rounded-2xl border-2 p-5 transition-standard ${
                    selected()
                      ? "border-forest-500 bg-forest-50 dark:bg-forest-900/30 shadow-sm"
                      : "border-cream-200 dark:border-forest-700 hover:border-forest-300 dark:hover:border-forest-600"
                  }`}
                  onClick={() => props.onSelect(plan.id)}
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="font-semibold text-forest-800 dark:text-cream-50">{plan.name}</p>
                      <Show when={plan.description}>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
                      </Show>
                    </div>
                    <span
                      class={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        selected()
                          ? "border-forest-600 bg-forest-600"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <Show when={selected()}>
                        <span class="h-2 w-2 rounded-full bg-white" />
                      </Show>
                    </span>
                  </div>
                  <div class="mt-4 flex items-end justify-between gap-3">
                    <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                      {formatPlanPrice(plan.priceBdt, locale())}
                    </p>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t(`seller.subscription.plans.interval.${planIntervalKey(plan.interval)}`)}
                    </p>
                  </div>
                </button>
              );
            }}
          </For>
        </div>
      </Show>
    </Card>
  );
}
