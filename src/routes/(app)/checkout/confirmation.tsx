import { ErrorBoundary, Suspense, Show, createMemo } from "solid-js";
import { useNavigate, A, useSearchParams, Navigate, createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { requireAuth } from "~/lib/auth/guards";
import { ApiError } from "~/lib/api";
import { getActivePaymentMethods } from "~/lib/api/endpoints/public/payment-methods.api";
import {
  ExclamationCircleIcon,
  SpinnerIcon,
} from "~/components/icons";
import { Button } from "~/components/ui";
import type { PaymentMethod } from "~/lib/api/types/checkout.types";
import { PaymentMethodBadge } from "~/components/orders";

export const route = {
  load: () => requireAuth(),
};

function LoadingFallback() {
  const { t } = useI18n();
  return (
    <div class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <SpinnerIcon class="w-10 h-10 text-forest-600 dark:text-forest-400 animate-spin" />
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {t("common.loading")}
        </p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentMethods = createAsync(() => getActivePaymentMethods());

  const orderNumber = () => (searchParams.order as string) ?? "";
  const paymentMethod = () => (searchParams.method as PaymentMethod) ?? null;
  const groupId = () => (searchParams.groupId as string) ?? "";

  const selectedMethod = createMemo(() => {
    const method = paymentMethod();
    const methods = paymentMethods();
    if (!method || !methods) return null;
    return methods.find((entry) => entry.key === method) ?? null;
  });

  if (!orderNumber()) {
    return <Navigate href="/cart" />;
  }

  return (
    <ErrorBoundary
      fallback={(error) => {
        if (error instanceof Response) throw error;
        if (error instanceof ApiError && error.statusCode === 401) {
          return <Navigate href="/login" />;
        }
        return (
          <div class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center p-6">
            <div class="bg-white dark:bg-forest-800 rounded-2xl border border-red-200 dark:border-red-800 p-8 max-w-md w-full">
              <div class="flex items-center gap-3 mb-4">
                <ExclamationCircleIcon class="w-8 h-8 text-red-600 dark:text-red-400" />
                <h2 class="text-lg font-semibold text-red-900 dark:text-red-300">
                  {t("checkout.loadError")}
                </h2>
              </div>
              <p class="text-sm text-red-700 dark:text-red-400 mb-4">
                {error.message}
              </p>
              <button
                onClick={() => navigate("/cart", { replace: true })}
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {t("common.retry")}
              </button>
            </div>
          </div>
        );
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
          <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <nav class="flex items-center gap-2 text-sm mb-10">
              <A
                href="/"
                class="text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
              >
                {t("common.home")}
              </A>
              <span class="text-gray-300 dark:text-gray-600">/</span>
              <A
                href="/cart"
                class="text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
              >
                {t("common.cart")}
              </A>
              <span class="text-gray-300 dark:text-gray-600">/</span>
              <span class="text-forest-800 dark:text-cream-50 font-medium">
                {t("checkout.steps.confirmation")}
              </span>
            </nav>

            <div class="text-center">
              <div class="w-24 h-24 rounded-full bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center mx-auto mb-8">
                <svg class="w-14 h-14 text-forest-600 dark:text-forest-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50 mb-2">
                {t("checkout.orderPlaced")}
              </h1>
              <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">
                {t("checkout.orderNumber")}: <span class="font-mono font-semibold text-forest-800 dark:text-cream-50">{orderNumber()}</span>
              </p>

              <Show when={paymentMethod()}>
                <div class="inline-flex items-center gap-2 px-5 py-2.5 bg-cream-50 dark:bg-forest-800 rounded-lg border border-cream-200 dark:border-forest-700 mb-8">
                  <Show
                    when={selectedMethod()}
                    fallback={
                      <span class="text-sm font-medium text-forest-800 dark:text-cream-50">
                        {t("checkout.paymentMethod")}: {paymentMethod()}
                      </span>
                    }
                  >
                    {(method) => (
                      <>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          {t("checkout.paymentMethod")}:
                        </span>
                        <PaymentMethodBadge
                          paymentMethod={method().key}
                          paymentMethodKey={method().key}
                          paymentMethodDisplayName={method().displayName}
                          paymentMethodLogoUrl={method().logoUrl}
                        />
                      </>
                    )}
                  </Show>
                </div>
              </Show>

              <p class="text-sm text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto">
                {t("checkout.orderConfirmationMessage")}
              </p>

              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate(groupId() ? `/app/orders/${groupId()}` : "/app/orders")
                  }
                >
                  {t("checkout.viewOrders")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/plants")}
                >
                  {t("checkout.continueShopping")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
