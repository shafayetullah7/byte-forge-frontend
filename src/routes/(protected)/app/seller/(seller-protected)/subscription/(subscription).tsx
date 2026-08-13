import { createAsync, type RouteDefinition } from "@solidjs/router";
import { createSignal, createMemo, createEffect, Show, Suspense } from "solid-js";
import { BankIcon } from "~/components/icons";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { useI18n } from "~/i18n";
import { getSellerSubscription, getSellerSubscriptionInvoices } from "~/lib/api/endpoints/seller/subscription.api";
import type { SellerSubscription } from "~/lib/api/types/seller/subscription.types";
import { SubscriptionStatusCard } from "./_components/SubscriptionStatusCard";
import { CouponRedeemForm } from "./_components/CouponRedeemForm";
import { PlanSelector } from "./_components/PlanSelector";
import { BillingPortalCard } from "./_components/BillingPortalCard";
import { CheckoutReturnBanner } from "./_components/CheckoutReturnBanner";
import { StripeCheckoutPendingBanner } from "./_components/StripeCheckoutPendingBanner";
import { SubscriptionInvoicesTable } from "./_components/SubscriptionInvoicesTable";
import { getPurchasablePlans } from "./_components/plan-utils";

export const route = {
  preload: () =>
    Promise.all([
      getSellerSubscription(),
      getSellerSubscriptionInvoices({ page: 1, limit: 10 }),
    ]),
} satisfies RouteDefinition;

export default function SellerSubscriptionPage() {
  const { t } = useI18n();
  const subscriptionQuery = createAsync(() => getSellerSubscription(), { deferStream: true });
  const [subscriptionOverride, setSubscriptionOverride] = createSignal<SellerSubscription | null>(
    null,
  );
  const subscription = createMemo(() => subscriptionOverride() ?? subscriptionQuery());
  const [selectedPlanId, setSelectedPlanId] = createSignal<string | null>(null);

  const purchasablePlans = createMemo(() => {
    const data = subscription();
    if (!data) return [];
    return getPurchasablePlans(data.availablePlans);
  });

  createEffect(() => {
    const plans = purchasablePlans();
    const current = selectedPlanId();
    if (plans.length === 0) {
      setSelectedPlanId(null);
      return;
    }
    if (!current || !plans.some((plan) => plan.id === current)) {
      setSelectedPlanId(plans[0].id);
    }
  });

  return (
    <div class="mx-auto max-w-4xl p-6 space-y-6">
      <CheckoutReturnBanner />

      <div class="flex items-start gap-4">
        <div class="p-3 rounded-2xl bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-200">
          <BankIcon class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
            {t("seller.subscription.title")}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("seller.subscription.subtitle")}
          </p>
        </div>
      </div>

      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback
            error={error}
            reset={reset}
            label={t("seller.subscription.title")}
          />
        )}
      >
        <Suspense
          fallback={
            <div class="space-y-6 animate-pulse">
              <div class="h-48 rounded-2xl bg-cream-100 dark:bg-forest-800" />
              <div class="h-40 rounded-2xl bg-cream-100 dark:bg-forest-800" />
            </div>
          }
        >
          <Show when={subscription()}>
            {(data) => (
              <div class="space-y-6">
                <StripeCheckoutPendingBanner
                  isActive={data().active}
                  onActivated={setSubscriptionOverride}
                />
                <SubscriptionStatusCard subscription={data()} />
                <CouponRedeemForm
                  disabled={data().active}
                  onRedeemed={setSubscriptionOverride}
                />

                <Show when={data().billingProvider === "STRIPE"}>
                  <BillingPortalCard />
                </Show>

                <Show when={!data().active}>
                  <PlanSelector
                    plans={purchasablePlans()}
                    selectedPlanId={selectedPlanId()}
                    onSelect={setSelectedPlanId}
                    showExpiredHint={data().status === "EXPIRED"}
                  />
                </Show>

                <SubscriptionInvoicesTable />
              </div>
            )}
          </Show>
        </Suspense>
      </SafeErrorBoundary>
    </div>
  );
}
