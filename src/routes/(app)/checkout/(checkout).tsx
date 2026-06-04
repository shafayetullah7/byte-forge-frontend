import {
  createSignal,
  createMemo,
  ErrorBoundary,
  Suspense,
  Show,
  For,
  createUniqueId,
} from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import {
  ExclamationCircleIcon,
  SpinnerIcon,
  ChevronLeftIcon,
  LeafIcon,
  CheckCircleIcon,
} from "~/components/icons";
import { Button } from "~/components/ui";
import { toaster } from "~/components/ui/Toast";
import CheckoutStepIndicator from "./components/CheckoutStepIndicator";
import AddressSelector from "./components/AddressSelector";
import ShopOrderReview from "./components/ShopOrderReview";
import PriceBreakdownSidebar from "./components/PriceBreakdownSidebar";
import {
  mockCartItems,
  mockAddresses,
  mockShippingRatesDhaka,
  mockShippingRatesChittagong,
  computePriceBreakdown,
} from "./mock-data";
import type { MockCartItem } from "./mock-data";

type CheckoutStep = "address" | "review" | "confirmation";

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

function AddressStepContent(props: {
  selectedAddressId: string | null;
  canPlaceOrder: boolean;
  onSelectAddress: (id: string) => void;
  onContinue: () => void;
}) {
  const { t } = useI18n();
  return (
    <div class="space-y-6">
      <AddressSelector
        addresses={mockAddresses}
        selectedAddressId={props.selectedAddressId}
        onSelect={props.onSelectAddress}
      />

      <div class="flex justify-between items-center pt-4">
        <A
          href="/cart"
          class="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 font-medium transition-colors"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          {t("checkout.backToCart")}
        </A>
        <Button
          variant="primary"
          size="lg"
          disabled={!props.canPlaceOrder}
          onClick={props.onContinue}
        >
          {t("checkout.continueToReview")}
        </Button>
      </div>
    </div>
  );
}

function ReviewStepContent(props: {
  selectedAddressId: string | null;
  canPlaceOrder: boolean;
  priceBreakdown: ReturnType<typeof computePriceBreakdown>;
  onBack: () => void;
  onPlaceOrder: () => void;
}) {
  const { t } = useI18n();
  const selectedAddress = createMemo(() =>
    mockAddresses.find((a) => a.id === props.selectedAddressId)
  );

  return (
    <div class="space-y-6">
      {/* Selected address summary */}
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-forest-100 dark:bg-forest-900/40 rounded-lg">
              <LeafIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t("checkout.deliverTo")}
              </p>
              <Show when={selectedAddress()}>
                {(addr) => (
                  <>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {addr().addressLine1}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {addr().city}
                    </p>
                  </>
                )}
              </Show>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={props.onBack}
          >
            {t("checkout.change")}
          </Button>
        </div>
      </div>

      {/* Shop order reviews */}
      <div class="space-y-4">
        <For each={props.priceBreakdown.shopBreakdowns}>
          {(shop) => <ShopOrderReview shop={shop} />}
        </For>
      </div>

      {/* Navigation */}
      <div class="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={props.onBack}
        >
          {t("checkout.back")}
        </Button>
        <Button
          variant="primary"
          size="lg"
          disabled={!props.canPlaceOrder}
          onClick={props.onPlaceOrder}
        >
          {t("checkout.placeOrderNow")}
        </Button>
      </div>
    </div>
  );
}

function ConfirmationStepContent(props: {
  navigate: (path: string) => void;
}) {
  const { t } = useI18n();
  return (
    <div class="max-w-lg mx-auto text-center py-12">
      <div class="w-20 h-20 rounded-full bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon class="w-12 h-12 text-forest-600 dark:text-forest-400" />
      </div>
      <h2 class="text-2xl font-bold text-forest-800 dark:text-cream-50 mb-2">
        {t("checkout.orderPlaced")}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-2">
        {t("checkout.orderNumber")}: #BF-2026-0042
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
        {t("checkout.orderConfirmationMessage")}
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="primary"
          onClick={() => props.navigate("/app/orders")}
        >
          {t("checkout.viewOrders")}
        </Button>
        <Button
          variant="outline"
          onClick={() => props.navigate("/plants")}
        >
          {t("checkout.continueShopping")}
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = createSignal<CheckoutStep>("address");
  const [selectedAddressId, setSelectedAddressId] = createSignal<string | null>(
    mockAddresses.find((a) => a.isDefault)?.id ?? null
  );
  const [isPlacingOrder, setIsPlacingOrder] = createSignal(false);

  const selectedItems = createMemo<MockCartItem[]>(() => mockCartItems);

  const selectedDistrictId = createMemo(() => {
    const address = mockAddresses.find((a) => a.id === selectedAddressId());
    return address?.districtId ?? "district-dhaka";
  });

  const shippingRates = createMemo(() => {
    const districtId = selectedDistrictId();
    if (districtId === "district-chittagong") {
      return mockShippingRatesChittagong;
    }
    return mockShippingRatesDhaka;
  });

  const priceBreakdown = createMemo(() =>
    computePriceBreakdown(selectedItems(), selectedDistrictId(), shippingRates())
  );

  const canPlaceOrder = createMemo(
    () => selectedAddressId() !== null && selectedItems().length > 0
  );

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      setCurrentStep("confirmation");
      toaster.success(t("checkout.orderPlaced"));
    }, 2000);
  };

  // Use a single memoized step to avoid hydration mismatches from multiple Show components
  const stepContent = createMemo(() => {
    const step = currentStep();
    if (step === "address") {
      return (
        <AddressStepContent
          selectedAddressId={selectedAddressId()}
          canPlaceOrder={canPlaceOrder()}
          onSelectAddress={setSelectedAddressId}
          onContinue={() => setCurrentStep("review")}
        />
      );
    }
    if (step === "review") {
      return (
        <ReviewStepContent
          selectedAddressId={selectedAddressId()}
          canPlaceOrder={canPlaceOrder()}
          priceBreakdown={priceBreakdown()}
          onBack={() => setCurrentStep("address")}
          onPlaceOrder={() => setCurrentStep("confirmation")}
        />
      );
    }
    return <ConfirmationStepContent navigate={navigate} />;
  });

  const showStepIndicator = createMemo(() => currentStep() !== "confirmation");
  const showPriceSidebar = createMemo(() => currentStep() !== "confirmation");

  return (
    <ErrorBoundary
      fallback={(error) => (
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
      )}
    >
      <Suspense fallback={<LoadingFallback />}>
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
            <Show when={showStepIndicator()}>
              <div class="mb-8">
                <CheckoutStepIndicator currentStep={currentStep()} />
              </div>
            </Show>

            {/* Page title */}
            <Show when={showStepIndicator()}>
              <div class="mb-8">
                <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                  {t("checkout.title")}
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("checkout.subtitle")}
                </p>
              </div>
            </Show>

            {/* Main content */}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Steps */}
              <div class="lg:col-span-2">
                {stepContent()}
              </div>

              {/* Right: Price breakdown */}
              <Show when={showPriceSidebar()}>
                <div>
                  <PriceBreakdownSidebar
                    breakdown={priceBreakdown()}
                    onPlaceOrder={handlePlaceOrder}
                    isPlacingOrder={isPlacingOrder()}
                    canPlaceOrder={canPlaceOrder()}
                  />
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
