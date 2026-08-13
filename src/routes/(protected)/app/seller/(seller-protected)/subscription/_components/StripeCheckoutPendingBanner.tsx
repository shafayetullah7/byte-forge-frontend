import { createSignal, createEffect, onCleanup, Show } from "solid-js";
import { useI18n } from "~/i18n";
import {
  getSellerSubscription,
  invalidateSellerSubscription,
} from "~/lib/api/endpoints/seller/subscription.api";
import type { SellerSubscription } from "~/lib/api/types/seller/subscription.types";
import {
  clearStripeCheckoutPending,
  isStripeCheckoutPending,
} from "~/lib/subscription/stripe-checkout-pending";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 45000;

export interface StripeCheckoutPendingBannerProps {
  isActive: boolean;
  onActivated?: (subscription: SellerSubscription) => void;
}

export function StripeCheckoutPendingBanner(props: StripeCheckoutPendingBannerProps) {
  const { t } = useI18n();
  const [pending, setPending] = createSignal(false);
  const [timedOut, setTimedOut] = createSignal(false);

  createEffect(() => {
    if (props.isActive) {
      if (isStripeCheckoutPending()) {
        clearStripeCheckoutPending();
      }
      setPending(false);
      setTimedOut(false);
      return;
    }

    if (!isStripeCheckoutPending()) {
      setPending(false);
      return;
    }

    setPending(true);
    setTimedOut(false);

    const startedAt = Date.now();
    let cancelled = false;

    const poll = async () => {
      if (cancelled || props.isActive) return;

      invalidateSellerSubscription();
      try {
        const subscription = await getSellerSubscription();
        if (subscription.active) {
          clearStripeCheckoutPending();
          props.onActivated?.(subscription);
          setPending(false);
          setTimedOut(false);
          return;
        }
      } catch {
        // Keep polling until timeout.
      }

      if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
        setTimedOut(true);
        return;
      }

      window.setTimeout(poll, POLL_INTERVAL_MS);
    };

    void poll();

    onCleanup(() => {
      cancelled = true;
    });
  });

  return (
    <Show when={pending()}>
      <div
        class={`rounded-xl border px-4 py-3 text-sm ${
          timedOut()
            ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-100"
            : "border-forest-200 bg-forest-50 text-forest-800 dark:border-forest-700 dark:bg-forest-900/30 dark:text-cream-50"
        }`}
        role="status"
      >
        {timedOut()
          ? t("seller.subscription.checkout.pendingTimeout")
          : t("seller.subscription.checkout.pending")}
      </div>
    </Show>
  );
}
