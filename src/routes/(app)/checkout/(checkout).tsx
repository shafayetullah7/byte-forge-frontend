import { ErrorBoundary, Suspense, Show, Switch, Match, createEffect } from "solid-js";
import { useNavigate, A, Navigate } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { requireAuth } from "~/lib/auth/guards";
import { ApiError } from "~/lib/api";
import {
  ExclamationCircleIcon,
  SpinnerIcon,
} from "~/components/icons";
import CheckoutStepIndicator from "./components/CheckoutStepIndicator";
import AddressStepContent from "./components/AddressStepContent";
import ReviewStepContent from "./components/ReviewStepContent";
import PaymentStepContent from "./components/PaymentStepContent";
import PriceBreakdownSidebar from "./components/PriceBreakdownSidebar";
import { useCheckout } from "./useCheckout";

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

export default function CheckoutPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const checkout = useCheckout();

  // Redirect to cart if cart is empty (e.g., after order placement + refresh)
  let hasRedirected = false;
  createEffect(() => {
    if (hasRedirected) return;
    const items = checkout.cartItems();
    const isLoaded = checkout.cartLoaded();
    if (isLoaded && items.length === 0) {
      hasRedirected = true;
      navigate("/cart", { replace: true });
    }
  });

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
                onClick={() => window.location.reload()}
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
        <Show when={checkout.cartLoaded() && checkout.cartItems().length > 0}>
          <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Breadcrumb */}
              <nav class="flex items-center gap-2 text-sm mb-6">
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
                  {t("checkout.title")}
                </span>
              </nav>

              {/* Step indicator */}
              <div class="mb-8">
                <CheckoutStepIndicator currentStep={checkout.currentStep()} />
              </div>

              {/* Page title */}
              <div class="mb-8">
                <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                  {t("checkout.title")}
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("checkout.subtitle")}
                </p>
              </div>

              {/* Main content */}
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Steps */}
                <div class="lg:col-span-2">
                  <Switch>
                    <Match when={checkout.currentStep() === "address"}>
                      <AddressStepContent
                        addresses={checkout.addresses() ?? []}
                        selectedAddressId={checkout.selectedAddressId()}
                        canPlaceOrder={checkout.canPlaceOrder()}
                        onSelectAddress={checkout.setSelectedAddressId}
                        onContinue={() => checkout.setCurrentStep("review")}
                      />
                    </Match>
                    <Match when={checkout.currentStep() === "review"}>
                      <ReviewStepContent
                        selectedAddressId={checkout.selectedAddressId()}
                        addresses={checkout.addresses() ?? []}
                        canPlaceOrder={checkout.canPlaceOrder()}
                        priceBreakdown={checkout.breakdown()}
                        onBack={() => checkout.setCurrentStep("address")}
                        onContinue={() => checkout.setCurrentStep("payment")}
                      />
                    </Match>
                    <Match when={checkout.currentStep() === "payment"}>
                      <PaymentStepContent
                        selectedPaymentMethod={checkout.selectedPaymentMethod()}
                        paymentMethods={checkout.paymentMethods}
                        onSelectPaymentMethod={checkout.setSelectedPaymentMethod}
                        onBack={() => checkout.setCurrentStep("review")}
                        onPlaceOrder={checkout.handlePlaceOrder}
                        canPlaceOrder={checkout.canPlaceOrder()}
                        isPlacingOrder={checkout.isPlacingOrder()}
                      />
                    </Match>
                  </Switch>
                </div>

                {/* Right: Price breakdown */}
                <div>
                  <PriceBreakdownSidebar
                    breakdown={checkout.breakdown()}
                    paymentMethod={checkout.selectedPaymentMethod()}
                  />
                </div>
              </div>
            </div>
          </div>
        </Show>
      </Suspense>
    </ErrorBoundary>
  );
}
