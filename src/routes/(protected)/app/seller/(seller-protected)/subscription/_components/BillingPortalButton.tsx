import { createSignal, Show } from "solid-js";
import { useAction } from "@solidjs/router";
import Button from "~/components/ui/Button";
import { useI18n } from "~/i18n";
import { createSubscriptionBillingPortalAction } from "~/lib/api/endpoints/seller/subscription.actions";
import { toaster } from "~/components/ui/Toast";
import { translateSubscriptionError } from "./subscription-error-messages";

export function BillingPortalButton() {
  const { t } = useI18n();
  const portalAction = useAction(createSubscriptionBillingPortalAction);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const handleOpenPortal = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await portalAction();
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
    <div class="space-y-2">
      <Button
        type="button"
        variant="secondary"
        loading={loading()}
        onClick={handleOpenPortal}
      >
        {t("seller.subscription.portal.cta")}
      </Button>
      <Show when={error()}>
        <p class="text-sm text-red-600 dark:text-red-400">{error()}</p>
      </Show>
    </div>
  );
}
