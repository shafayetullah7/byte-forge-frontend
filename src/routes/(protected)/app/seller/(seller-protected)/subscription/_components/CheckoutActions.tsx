import { createSignal, Show } from "solid-js";
import { useAction } from "@solidjs/router";
import Card from "~/components/ui/Card";
import Button from "~/components/ui/Button";
import { useI18n } from "~/i18n";
import { createSubscriptionCheckoutAction } from "~/lib/api/endpoints/seller/subscription.actions";
import { toaster } from "~/components/ui/Toast";
import { translateSubscriptionError } from "./subscription-error-messages";

export interface CheckoutActionsProps {
  selectedPlanId: string | null;
  disabled?: boolean;
}

export function CheckoutActions(props: CheckoutActionsProps) {
  const { t } = useI18n();
  const checkoutAction = useAction(createSubscriptionCheckoutAction);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);

  const handleCheckout = async () => {
    if (props.disabled || !props.selectedPlanId) {
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
      const message = translateSubscriptionError(t, result?.error?.message);
      setError(message);
      toaster.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card class="border-forest-100 dark:border-forest-800 bg-forest-50/40 dark:bg-forest-900/20">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">
            {t("seller.subscription.checkout.title")}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {t("seller.subscription.checkout.description")}
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          loading={loading()}
          disabled={props.disabled || !props.selectedPlanId}
          onClick={handleCheckout}
        >
          {t("seller.subscription.checkout.cta")}
        </Button>
      </div>
      <Show when={error()}>
        <p class="mt-3 text-sm text-red-600 dark:text-red-400">{error()}</p>
      </Show>
    </Card>
  );
}
