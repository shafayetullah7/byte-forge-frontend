import { createSignal, createMemo, createEffect } from "solid-js";
import { useNavigate, createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { useSession } from "~/lib/auth";
import { getCart } from "~/lib/api/endpoints/buyer/cart.api";
import { getAddresses } from "~/lib/api/endpoints/buyer/address.api";
import { calculatePriceBreakdown, placeOrder } from "~/lib/api/endpoints/buyer/checkout.api";
import type { Address } from "~/lib/api/types/address.types";
import type { PriceBreakdown, PriceBreakdownResponse, PaymentMethod } from "~/lib/api/types/checkout.types";
import { toaster } from "~/components/ui/Toast";

export type CheckoutStep = "address" | "review" | "payment";

const PAYMENT_METHODS: PaymentMethod[] = ["COD", "CARD", "BKASH", "NAGAD", "SSLCOMMERCE"];

interface OrderConfirmationState {
  orderNumber: string;
  paymentMethod: PaymentMethod;
}

export function useCheckout() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const session = useSession();

  // Client-side backup guard: redirect to login if session expires
  createEffect(() => {
    const user = session();
    if (user === undefined) return;
    if (user === null) {
      navigate("/login", { replace: true });
    }
  });

  const [currentStep, setCurrentStep] = createSignal<CheckoutStep>("address");
  const [selectedAddressId, setSelectedAddressId] = createSignal<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = createSignal<PaymentMethod>("COD");
  const [isPlacingOrder, setIsPlacingOrder] = createSignal(false);
  const [itemsInitialized, setItemsInitialized] = createSignal(false);
  const [addressInitialized, setAddressInitialized] = createSignal(false);

  // Fetch cart data
  const cart = createAsync(() => getCart(), { deferStream: true });
  const cartItems = createMemo(() => cart()?.items ?? []);
  const cartLoaded = createMemo(() => cart() !== undefined);

  // Track selected item IDs (default to all items)
  const [selectedItemIds, setSelectedItemIds] = createSignal<Set<string>>(new Set());

  // Auto-select all items when cart loads (runs once)
  createEffect(() => {
    const items = cartItems();
    if (items.length > 0 && !itemsInitialized()) {
      setSelectedItemIds(new Set(items.map((item) => item.id)));
      setItemsInitialized(true);
    }
  });

  // Get selected items
  const selectedItems = createMemo(() =>
    cartItems().filter((item) => selectedItemIds().has(item.id))
  );

  // Fetch addresses
  const addresses = createAsync(() => getAddresses({ type: "shipping" }));

  // Set default address when addresses load (runs once)
  createEffect(() => {
    const addrList = addresses();
    if (addrList && addrList.length > 0 && !selectedAddressId() && !addressInitialized()) {
      const defaultAddr = addrList.find((address: Address) => address.isDefault) ?? addrList[0];
      setSelectedAddressId(defaultAddr.id);
      setAddressInitialized(true);
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

  const handlePlaceOrder = async () => {
    const addressId = selectedAddressId();
    const items = selectedItems();
    const paymentMethod = selectedPaymentMethod();
    if (!addressId || items.length === 0) return;

    setIsPlacingOrder(true);
    try {
      const result = await placeOrder({
        addressId,
        itemIds: items.map((item) => item.id),
        paymentMethod,
      });

      const firstOrderNumber = result.orderGroup.orderNumbers[0] ?? "";
      const state: OrderConfirmationState = {
        orderNumber: firstOrderNumber,
        paymentMethod,
      };
      navigate("/checkout/confirmation", { state });
      toaster.success(t("checkout.orderPlaced"));
    } catch (error) {
      toaster.error(error instanceof Error ? error.message : "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const paymentMethods = PAYMENT_METHODS;

  return {
    currentStep,
    setCurrentStep,
    selectedAddressId,
    setSelectedAddressId,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    isPlacingOrder,
    addresses,
    breakdown,
    canPlaceOrder,
    handlePlaceOrder,
    cartItems,
    cartLoaded,
    paymentMethods,
  };
}
