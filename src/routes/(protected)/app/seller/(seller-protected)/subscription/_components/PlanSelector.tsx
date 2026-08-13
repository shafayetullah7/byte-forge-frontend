import { createSignal, For, Show } from "solid-js";
import { useAction } from "@solidjs/router";
import Card from "~/components/ui/Card";
import Button from "~/components/ui/Button";
import { useI18n } from "~/i18n";
import { createSubscriptionCheckoutAction } from "~/lib/api/endpoints/seller/subscription.actions";
import type { SubscriptionPlan } from "~/lib/api/types/seller/subscription.types";
import { toaster } from "~/components/ui/Toast";
import { formatPlanPrice, planIntervalKey } from "./plan-utils";
import { translateSubscriptionError } from "./subscription-error-messages";

export interface PlanSelectorProps {
  plans: SubscriptionPlan[];
  selectedPlanId: string | null;
  onSelect: (planId: string) => void;
  showExpiredHint?: boolean;
}

export function PlanSelector(props: PlanSelectorProps) {
  const { t, locale } = useI18n();
  const checkoutAction = useAction(createSubscriptionCheckoutAction);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);

  const selectedPlan = () => props.plans.find((plan) => plan.id === props.selectedPlanId) ?? null;

  const handleCheckout = async () => {
    if (!props.selectedPlanId) {
      setError(t("seller.subscription.checkout.selectPlan"));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await checkoutAction({ planId: props.selectedPlanId });
      if (result?.success) {
        window.location.href = result.data.url;
        return;
      }
      const message = translateSubscriptionError(t, result?.error, "checkout");
      setError(message);
      toaster.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={t("seller.subscription.plans.title")}
      description={t("seller.subscription.plans.subtitle")}
    >
      <Show when={props.showExpiredHint}>
        <p class="mb-4 text-sm text-gray-600 dark:text-gray-300 bg-cream-50 dark:bg-forest-900/30 border border-cream-200 dark:border-forest-700 rounded-xl px-4 py-3">
          {t("seller.subscription.plans.expiredHint")}
        </p>
      </Show>

      <Show
        when={props.plans.length > 0}
        fallback={
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {t("seller.subscription.plans.empty")}
          </p>
        }
      >
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
          role="radiogroup"
          aria-label={t("seller.subscription.plans.title")}
        >
          <For each={props.plans}>
            {(plan) => {
              const selected = () => props.selectedPlanId === plan.id;
              return (
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected()}
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
                      aria-hidden="true"
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

        <div class="mt-6 pt-6 border-t border-cream-200 dark:border-forest-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-forest-800 dark:text-cream-50">
              {selectedPlan()
                ? t("seller.subscription.checkout.selectedPlan", selectedPlan()!.name)
                : t("seller.subscription.checkout.selectPlan")}
            </p>
            <Show when={selectedPlan()}>
              {(plan) => (
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {formatPlanPrice(plan().priceBdt, locale())}{" "}
                  {t(`seller.subscription.plans.interval.${planIntervalKey(plan().interval)}`)}
                </p>
              )}
            </Show>
          </div>
          <Button
            type="button"
            variant="primary"
            loading={loading()}
            disabled={!props.selectedPlanId}
            onClick={handleCheckout}
          >
            {selectedPlan()
              ? t(
                  "seller.subscription.checkout.ctaWithPlan",
                  formatPlanPrice(selectedPlan()!.priceBdt, locale()),
                )
              : t("seller.subscription.checkout.cta")}
          </Button>
        </div>

        <Show when={error()}>
          <p class="mt-3 text-sm text-red-600 dark:text-red-400">{error()}</p>
        </Show>
      </Show>
    </Card>
  );
}
