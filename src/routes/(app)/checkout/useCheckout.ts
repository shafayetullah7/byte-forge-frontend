import { createSignal, createMemo, createEffect } from "solid-js";
import { useNavigate, createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { useSession } from "~/lib/auth";
import { getCart } from "~/lib/api/endpoints/buyer/cart.api";
import { getAddresses } from "~/lib/api/endpoints/buyer/address.api";
import { calculatePriceBreakdown, placeOrder } from "~/lib/api/endpoints/buyer/checkout.api";
import { getActivePaymentMethods } from "~/lib/api/endpoints/public/payment-methods.api";
import type { Address } from "~/lib/api/types/address.types";
import type {
  PriceBreakdown,
  PriceBreakdownResponse,
  PaymentMethod,
  CheckoutPaymentMethodOption,
} from "~/lib/api/types/checkout.types";
import { toaster } from "~/components/ui/Toast";

export type CheckoutStep = "address" | "review" | "payment";

export function useCheckout() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const session = useSession();

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
  const [orderNotes, setOrderNotes] = createSignal("");
  const [isPlacingOrder, setIsPlacingOrder] = createSignal(false);
  const [itemsInitialized, setItemsInitialized] = createSignal(false);
  const [addressInitialized, setAddressInitialized] = createSignal(false);

  const activePaymentMethods = createAsync(
    () => getActivePaymentMethods(),
    { deferStream: true }
  );

  const paymentMethods = createMemo<CheckoutPaymentMethodOption[]>(() => {
    const methods = activePaymentMethods();
    if (!methods?.length) return [];
    return methods.map((method) => ({
      key: method.key,
      displayName: method.displayName,
      logoUrl: method.logoUrl,
      description: method.description,
    }));
  });

  createEffect(() => {
    const methods = paymentMethods();
    if (methods.length === 0) return;
    const selected = selectedPaymentMethod();
    if (!methods.some((method) => method.key === selected)) {
      setSelectedPaymentMethod(methods[0].key);
    }
  });

  const cart = createAsync(() => getCart(), { deferStream: true });
  const cartItems = createMemo(() => cart()?.items ?? []);
  const cartLoaded = createMemo(() => cart() !== undefined);

  const [selectedItemIds, setSelectedItemIds] = createSignal<Set<string>>(new Set());

  createEffect(() => {
    const items = cartItems();
    if (items.length > 0 && !itemsInitialized()) {
      setSelectedItemIds(new Set(items.map((item) => item.id)));
      setItemsInitialized(true);
    }
  });

  const selectedItems = createMemo(() =>
    cartItems().filter((item) => selectedItemIds().has(item.id))
  );

  const addresses = createAsync(() => getAddresses({ type: "shipping" }));

  createEffect(() => {
    const addrList = addresses();
    if (addrList && addrList.length > 0 && !selectedAddressId() && !addressInitialized()) {
      const defaultAddr = addrList.find((address: Address) => address.isDefault) ?? addrList[0];
      setSelectedAddressId(defaultAddr.id);
      setAddressInitialized(true);
    }
  });

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

  const breakdown = createMemo(() => priceBreakdown()?.breakdown);

  const canPlaceOrder = createMemo(
    () =>
      selectedAddressId() !== null &&
      selectedItems().length > 0 &&
      paymentMethods().length > 0
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
        notes: orderNotes().trim() || undefined,
      });

      const firstOrderNumber = result.orderGroup.orderNumbers[0] ?? "";
      navigate(
        `/checkout/confirmation?order=${firstOrderNumber}&method=${paymentMethod}&groupId=${result.orderGroup.orderGroupId}`
      );
      toaster.success(t("checkout.orderPlaced"));
    } catch (error) {
      toaster.error(error instanceof Error ? error.message : "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

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
    paymentMethodsLoading: () => activePaymentMethods() === undefined,
    orderNotes,
    setOrderNotes,
  };
}
