import {
  createSignal,
  createMemo,
  ErrorBoundary,
  Suspense,
  Show,
  For,
  Switch,
  Match,
  createEffect,
} from "solid-js";
import { useNavigate, A, createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { getCart } from "~/lib/api/endpoints/buyer/cart.api";
import { getAddresses } from "~/lib/api/endpoints/buyer/address.api";
import { calculatePriceBreakdown } from "~/lib/api/endpoints/buyer/checkout.api";
import type { Address } from "~/lib/api/types/address.types";
import type { PriceBreakdown, PriceBreakdownResponse } from "~/lib/api/types/checkout.types";
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

function mapShopBreakdownToShopOrderReview(breakdown: PriceBreakdown["shopBreakdowns"][number]) {
  return {
    shopId: breakdown.shopId,
    shopName: breakdown.shopName,
    items: breakdown.items.map((item) => ({
      id: item.id,
      shopId: item.shopId,
      shopName: item.shopName,
      productName: item.productName,
      productSlug: item.productSlug,
      variantTitle: item.variantTitle ?? "",
      quantity: item.quantity,
      price: parseFloat(item.price),
      lineTotal: parseFloat(item.lineTotal),
      thumbnailUrl: item.thumbnail?.url ?? null,
      stockStatus: item.stockStatus as 'in_stock' | 'low_stock' | 'out_of_stock',
    })),
    itemsSubtotal: parseFloat(breakdown.itemsSubtotal),
    shippingCost: parseFloat(breakdown.shippingCost),
    districtId: "",
    districtName: "",
  };
}

function AddressStepContent(props: {
  addresses: Address[];
  selectedAddressId: string | null;
  canPlaceOrder: boolean;
  onSelectAddress: (id: string) => void;
  onContinue: () => void;
}) {
  const { t } = useI18n();
  return (
    <div class="space-y-6">
      <AddressSelector
        addresses={props.addresses}
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
  addresses: Address[];
  canPlaceOrder: boolean;
  priceBreakdown: PriceBreakdown | undefined;
  onBack: () => void;
  onPlaceOrder: () => void;
}) {
  const { t } = useI18n();
  const selectedAddress = createMemo(() =>
    props.addresses.find((a) => a.id === props.selectedAddressId)
  );

  const shopBreakdowns = createMemo(() => {
    if (!props.priceBreakdown) return [];
    return props.priceBreakdown.shopBreakdowns.map(mapShopBreakdownToShopOrderReview);
  });

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
      <Show when={shopBreakdowns().length > 0}>
        <div class="space-y-4">
          <For each={shopBreakdowns()}>
            {(shop) => <ShopOrderReview shop={shop} />}
          </For>
        </div>
      </Show>

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
  const [selectedAddressId, setSelectedAddressId] = createSignal<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = createSignal(false);

  // Fetch cart data
  const cart = createAsync(() => getCart());
  const cartItems = createMemo(() => cart()?.items ?? []);

  // Track selected item IDs (default to all items)
  const [selectedItemIds, setSelectedItemIds] = createSignal<Set<string>>(new Set());

  // Auto-select all items when cart loads
  createEffect(() => {
    const items = cartItems();
    if (items.length > 0 && selectedItemIds().size === 0) {
      setSelectedItemIds(new Set(items.map((item) => item.id)));
    }
  });

  // Get selected items
  const selectedItems = createMemo(() =>
    cartItems().filter((item) => selectedItemIds().has(item.id))
  );

  // Fetch addresses
  const addresses = createAsync(() => getAddresses({ type: "shipping" }));

  // Set default address when addresses load (createEffect for side effects)
  createEffect(() => {
    const addrList = addresses();
    if (addrList && addrList.length > 0 && !selectedAddressId()) {
      const defaultAddr = addrList.find((address: Address) => address.isDefault) ?? addrList[0];
      setSelectedAddressId(defaultAddr.id);
    }
  });

  // Calculate price breakdown using createAsync + query() for SSR/caching
  const priceBreakdown = createAsync<PriceBreakdownResponse | undefined>(
    () => {
      const addressId = selectedAddressId();
      const items = selectedItems();
      if (!addressId || items.length === 0) {
        return Promise.resolve(undefined);
      }
      return calculatePriceBreakdown({
        addressId,
        itemIds: items.map((item) => item.id),
      });
    },
    { deferStream: true }
  );

  // Flatten the breakdown from the response wrapper
  const breakdown = createMemo(() => priceBreakdown()?.breakdown);

  const canPlaceOrder = createMemo(
    () => selectedAddressId() !== null && selectedItems().length > 0
  );

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    // TODO: Replace with actual order placement API call
    setTimeout(() => {
      setIsPlacingOrder(false);
      setCurrentStep("confirmation");
      toaster.success(t("checkout.orderPlaced"));
    }, 2000);
  };

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
              {/* Left: Steps - rendered directly with Switch/Match instead of createMemo returning JSX */}
              <div class="lg:col-span-2">
                <Switch>
                  <Match when={currentStep() === "address"}>
                    <AddressStepContent
                      addresses={addresses() ?? []}
                      selectedAddressId={selectedAddressId()}
                      canPlaceOrder={canPlaceOrder()}
                      onSelectAddress={setSelectedAddressId}
                      onContinue={() => setCurrentStep("review")}
                    />
                  </Match>
                  <Match when={currentStep() === "review"}>
                    <ReviewStepContent
                      selectedAddressId={selectedAddressId()}
                      addresses={addresses() ?? []}
                      canPlaceOrder={canPlaceOrder()}
                      priceBreakdown={breakdown()}
                      onBack={() => setCurrentStep("address")}
                      onPlaceOrder={handlePlaceOrder}
                    />
                  </Match>
                  <Match when={currentStep() === "confirmation"}>
                    <ConfirmationStepContent navigate={navigate} />
                  </Match>
                </Switch>
              </div>

              {/* Right: Price breakdown */}
              <Show when={showPriceSidebar()}>
                <div>
                  <PriceBreakdownSidebar
                    breakdown={breakdown()}
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
