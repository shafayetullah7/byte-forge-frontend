import { Component, Show, For, createMemo, createEffect, createSignal, Suspense } from "solid-js";
import { createAsync, useParams, A, useAction, useSubmission } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { OrderStatusBadge, ShipmentTrackingCard } from "~/components/orders";
import { getOrderStatusLabel } from "~/lib/orders/order-display.utils";
import { getOrderGroup } from "~/lib/api/endpoints/buyer/orders.api";
import type { OrderDetail } from "~/lib/api/types/order.types";
import { toaster } from "~/components/ui/Toast";
import { ConfirmDialog } from "~/components/ui/ConfirmDialog";
import Button from "~/components/ui/Button";
import {
  ChevronLeftIcon,
  PackageIcon,
  XCircleIcon,
  PrinterIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
} from "~/components/icons";
import {
  OrderTimeline,
  OrderItemsSection,
  OrderSummaryWithPayment,
  ShopInfoCard,
  ShippingAddressCompact,
  formatFullDate,
  formatTime,
  buildTimelineFromHistory,
  formatCurrency,
} from "./components";
import { cancelOrderAction, confirmDeliveryAction } from "./actions";

function OrderStatusBanner(props: { order: OrderDetail }) {
  const { t } = useI18n();
  const isCod = () => props.order.paymentMethodKey === "COD";

  const bannerKey = () => {
    switch (props.order.status) {
      case "PENDING_PAYMENT":
        return "awaitingSellerBanner";
      case "PROCESSING":
        return "orderAcceptedBanner";
      case "CONFIRMED":
        return "packedBanner";
      case "SHIPPED":
        return "shippedBanner";
      case "DELIVERED":
        return "deliveredBanner";
      case "COMPLETED":
        return "completedBanner";
      case "CANCELLED":
        return props.order.cancelledReason
          ? "cancelledBySeller"
          : "orderCancelled";
      case "EXPIRED":
        return "expiredBanner";
      default:
        return null;
    }
  };

  const key = bannerKey();
  if (!key) return null;

  return (
    <div class="rounded-xl border border-cream-200 dark:border-cream-800 bg-cream-50 dark:bg-cream-900/20 p-4 mb-4">
      <p class="text-sm text-cream-800 dark:text-cream-200">
        {t(`buyer.orders.details.${key}`)}
      </p>
      <Show when={isCod() && (props.order.status === "SHIPPED" || props.order.status === "DELIVERED")}>
        <p class="text-sm font-medium text-cream-900 dark:text-cream-100 mt-2">
          {t("buyer.orders.details.codReadyReminder", { amount: props.order.total })}
        </p>
      </Show>
      <Show when={props.order.buyerDeliveryConfirmedAt}>
        {(date) => (
          <p class="text-xs text-forest-700 dark:text-forest-300 mt-2">
            {t("buyer.orders.details.deliveryConfirmedBy")} · {formatFullDate(date())}
          </p>
        )}
      </Show>
    </div>
  );
}

function OrderCard(props: { order: OrderDetail; groupId: string }) {
  const { t } = useI18n();
  const order = props.order;
  const [isCancelModalOpen, setIsCancelModalOpen] = createSignal(false);
  const [isConfirmReceiptOpen, setIsConfirmReceiptOpen] = createSignal(false);
  const [cancelReason, setCancelReason] = createSignal("");

  const canCancel =
    order.status === "PENDING_PAYMENT" || order.status === "PROCESSING";
  const canConfirmReceipt = order.status === "SHIPPED";
  const isCancelled = order.status === "CANCELLED" || order.status === "EXPIRED";
  const isCod = order.paymentMethodKey === "COD";

  const timelineEvents = createMemo(() =>
    buildTimelineFromHistory(order.statusHistory, (status) =>
      getOrderStatusLabel(status, t, order.paymentMethodKey),
    ),
  );

  const cancelTrigger = useAction(cancelOrderAction);
  const confirmDeliveryTrigger = useAction(confirmDeliveryAction);
  const cancelSubmission = useSubmission(cancelOrderAction);
  const confirmDeliverySubmission = useSubmission(confirmDeliveryAction);

  createEffect(() => {
    const result = cancelSubmission.result;
    if (!result) return;

    if (result.success === true) {
      toaster.success(t("buyer.orders.details.cancelSuccess"));
      setCancelReason("");
      setIsCancelModalOpen(false);
    } else if (result.success === false && result.error) {
      toaster.error(result.error.message || t("buyer.orders.details.cancelFailed"));
    }
  });

  createEffect(() => {
    const result = confirmDeliverySubmission.result;
    if (!result) return;

    if (result.success === true) {
      toaster.success(t("buyer.orders.details.confirmReceiptSuccess"));
      setIsConfirmReceiptOpen(false);
    } else if (result.success === false && result.error) {
      toaster.error(result.error.message || t("buyer.orders.details.confirmReceiptFailed"));
    }
  });

  const executeCancel = () => {
    cancelTrigger({
      orderId: order.id,
      groupId: props.groupId,
      reason: cancelReason().trim() || undefined,
    });
  };

  const executeConfirmReceipt = () => {
    confirmDeliveryTrigger({
      orderId: order.id,
      groupId: props.groupId,
    });
  };

  const isCancelling = createMemo(() => cancelSubmission.pending === true);
  const isConfirming = createMemo(() => confirmDeliverySubmission.pending === true);

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-3 flex-wrap">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {order.orderNumber}
        </h2>
        <OrderStatusBadge status={order.status} paymentMethodKey={order.paymentMethodKey} />
      </div>

      <OrderStatusBanner order={order} />

      <Show when={isCod && order.status !== "COMPLETED" && order.status !== "CANCELLED" && order.status !== "EXPIRED"}>
        <div class="rounded-xl border border-forest-200 dark:border-forest-700 bg-forest-50 dark:bg-forest-900/20 px-4 py-3 text-sm text-forest-800 dark:text-forest-200">
          {t("buyer.orders.details.payOnDeliveryAmount", { amount: order.total })}
        </div>
      </Show>

      <Show when={order.notes}>
        {(notes) => (
          <div class="bg-cream-50 dark:bg-cream-900/20 border border-cream-200 dark:border-cream-800 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <PackageIcon class="w-4 h-4 text-cream-600 dark:text-cream-400 flex-shrink-0 mt-0.5" />
              <p class="text-sm text-cream-700 dark:text-cream-300">
                {notes()}
              </p>
            </div>
          </div>
        )}
      </Show>

      <Show when={isCancelled}>
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <XCircleIcon class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-semibold text-red-800 dark:text-red-300">
                {t("buyer.orders.details.orderCancelled")}
              </p>
              <Show when={order.cancelledReason}>
                {(reason) => (
                  <p class="text-sm text-red-600 dark:text-red-400 mt-1">
                    {reason()}
                  </p>
                )}
              </Show>
              <Show when={order.cancelledAt}>
                {(date) => (
                  <p class="text-xs text-red-500 dark:text-red-400 mt-1">
                    {t("buyer.orders.details.cancelledOn")} {formatFullDate(date())}
                  </p>
                )}
              </Show>
            </div>
          </div>
        </div>
      </Show>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <OrderItemsSection items={order.items} />
          <Show when={order.shipment}>
            {(shipment) => <ShipmentTrackingCard shipment={shipment()} />}
          </Show>
          <OrderTimeline events={timelineEvents()} currentStatus={order.status} />
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-4 space-y-6">
            <OrderSummaryWithPayment
              subtotal={order.subtotal}
              shippingCost={order.shippingCost}
              tax={order.tax}
              total={order.total}
              paymentMethod={order.paymentMethod}
              paymentMethodId={order.paymentMethodId}
              paymentMethodKey={order.paymentMethodKey}
              paymentMethodDisplayName={order.paymentMethodDisplayName}
              paymentMethodLogoUrl={order.paymentMethodLogoUrl}
              paymentStatus={order.paymentStatus}
            />

            <ShopInfoCard shopName={order.shopName} shopLogo={order.shopLogo} shopId={order.shopId} />

            <Show when={order.address}>
              {(addr) => <ShippingAddressCompact address={addr()} />}
            </Show>

            <div class="space-y-2.5">
              <Show when={canConfirmReceipt}>
                <Button
                  variant="primary"
                  class="w-full"
                  loading={isConfirming()}
                  disabled={isConfirming()}
                  onClick={() => setIsConfirmReceiptOpen(true)}
                >
                  <CheckCircleIcon class="w-4 h-4" />
                  {t("buyer.orders.details.confirmReceiptButton")}
                </Button>
              </Show>

              <Show when={canCancel}>
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  disabled={isCancelling()}
                  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                >
                  <XCircleIcon class="w-4 h-4" />
                  {isCancelling() ? t("buyer.orders.details.cancelling") : t("buyer.orders.details.cancelOrder")}
                </button>
              </Show>

              <Show when={order.status === "COMPLETED"}>
                <A
                  href="/app/products"
                  class="block w-full text-center px-4 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                >
                  {t("buyer.orders.details.orderAgain")}
                </A>
              </Show>

              <A
                href="/app/products"
                class="block w-full text-center px-4 py-2.5 border border-gray-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-700 rounded-xl font-semibold text-sm transition-colors"
              >
                {t("buyer.orders.details.continueShopping")}
              </A>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isCancelModalOpen()}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={executeCancel}
        title={t("buyer.orders.details.cancelOrder")}
        description={t("buyer.orders.details.confirmCancel")}
        confirmLabel={t("buyer.orders.details.cancelOrder")}
        cancelLabel={t("common.cancel")}
        variant="danger"
      >
        <div class="w-full mb-4 text-left">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t("buyer.orders.details.cancelReasonLabel")}
          </label>
          <textarea
            value={cancelReason()}
            onInput={(e) => setCancelReason(e.currentTarget.value)}
            placeholder={t("buyer.orders.details.cancelReasonPlaceholder")}
            class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm min-h-20"
          />
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        isOpen={isConfirmReceiptOpen()}
        onClose={() => setIsConfirmReceiptOpen(false)}
        onConfirm={executeConfirmReceipt}
        title={t("buyer.orders.details.confirmReceiptDialogTitle")}
        description={t("buyer.orders.details.confirmReceiptDialogBody", {
          shopName: order.shopName,
        })}
        confirmLabel={t("buyer.orders.details.confirmReceiptButton")}
        cancelLabel={t("common.cancel")}
      />
    </div>
  );
}

const OrderDetails: Component = () => {
  const params = useParams<{ id: string }>();
  const { t } = useI18n();
  const group = createAsync(() => getOrderGroup(params.id).then((res) => res.data));

  const groupItemCount = createMemo(() =>
    group()?.orders.reduce((sum, o) => sum + o.items.length, 0) ?? 0
  );

  return (
    <SafeErrorBoundary
      fallback={(error, reset) => (
        <InlineErrorFallback error={error} reset={reset} label={t("buyer.orders.details.title")} />
      )}
    >
      <Suspense
        fallback={
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin w-8 h-8 border-4 border-forest-600 border-t-transparent rounded-full" />
            <span class="ml-3 text-gray-500 dark:text-gray-400">
              {t("buyer.orders.details.loading")}
            </span>
          </div>
        }
      >
        <Show
          when={group()}
          fallback={
            <div class="mx-auto max-w-lg text-center py-16">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("buyer.orders.details.notFound")}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t("buyer.orders.details.notFoundDescription")}
              </p>
              <A
                href="/app/orders"
                class="inline-flex px-4 py-2 rounded-xl bg-forest-600 text-white text-sm font-semibold"
              >
                {t("buyer.orders.details.backToOrders")}
              </A>
            </div>
          }
        >
          {(g) => (
            <div class="mx-auto max-w-[1400px]">
              <div class="mb-8">
                <div class="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => window.history.back()}
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors"
                    aria-label={t("common.back")}
                  >
                    <ChevronLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 flex-wrap">
                      <div class="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
                        <ShoppingBagIcon class="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                          {t("buyer.orders.details.title")}
                        </h1>
                        <p class="text-base text-gray-500 dark:text-gray-400">
                          {t("buyer.orders.details.placedOn")} {formatFullDate(g().createdAt)} {t("common.at")} {formatTime(g().createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    class="p-2.5 rounded-lg border border-gray-200 dark:border-forest-700 hover:bg-gray-50 dark:hover:bg-forest-700 transition-colors"
                    aria-label={t("buyer.orders.details.print")}
                  >
                    <PrinterIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm p-4">
                  <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-6">
                      <div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {t("buyer.orders.details.orders")}
                        </p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{g().orders.length}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {t("buyer.orders.details.items")}
                        </p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{groupItemCount()}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t("buyer.orders.details.groupTotal")}
                      </p>
                      <p class="text-lg font-bold text-forest-600 dark:text-forest-400">
                        {formatCurrency(g().totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <For each={g().orders}>
                {(order, i) => (
                  <div class={`mb-8 last:mb-0 ${i() > 0 ? "pt-6 border-t border-gray-200 dark:border-forest-700" : ""}`}>
                    <OrderCard order={order} groupId={g().id} />
                  </div>
                )}
              </For>
            </div>
          )}
        </Show>
      </Suspense>
    </SafeErrorBoundary>
  );
};

export default OrderDetails;
