import {
  Component,
  Show,
  Suspense,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import {
  A,
  createAsync,
  useAction,
  useParams,
  useSearchParams,
  useSubmission,
} from "@solidjs/router";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { ShipmentTrackingCard } from "~/components/orders";
import { ConfirmDialog } from "~/components/ui/ConfirmDialog";
import { toaster } from "~/components/ui/Toast";
import { PackageIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { getSellerOrder } from "~/lib/api/endpoints/seller/orders.api";
import { getOrderStatusLabel } from "~/lib/orders/order-display.utils";
import { buildSellerOrdersListHref } from "~/lib/orders/seller-order.utils";
import type { SellerOrderActionDescriptor } from "~/lib/api/types/seller-orders.types";
import { OrderTimeline } from "~/routes/(protected)/app/(buyer)/orders/[id]/components/OrderTimeline";
import { buildTimelineFromHistory } from "~/routes/(protected)/app/(buyer)/orders/[id]/components/utils";
import {
  cancelSellerOrderAction,
  shipSellerOrderAction,
  updateSellerOrderStatusAction,
} from "./actions";
import { SellerOrderActionBar } from "./components/SellerOrderActionBar";
import { SellerOrderCancelledBanner } from "./components/SellerOrderCancelledBanner";
import { SellerOrderHeader } from "./components/SellerOrderHeader";
import { SellerOrderItemsSection } from "./components/SellerOrderItemsSection";
import { SellerOrderPackingSlip } from "./components/SellerOrderPackingSlip";
import { SellerOrderCancelPanel, SellerOrderShipPanel } from "./components/SellerOrderPanels";
import {
  SellerOrderCustomerCard,
  SellerOrderShippingCard,
  SellerOrderSummaryCard,
} from "./components/SellerOrderSidebarCards";

const SellerOrderDetailPage: Component = () => {
  const params = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();

  const returnTo = () => {
    const value = searchParams.returnTo;
    return typeof value === "string" ? value : null;
  };

  const order = createAsync(() => getSellerOrder(params.orderId));

  const [shipCarrier, setShipCarrier] = createSignal("");
  const [shipTracking, setShipTracking] = createSignal("");
  const [shipEstimatedDelivery, setShipEstimatedDelivery] = createSignal("");
  const [cancelReason, setCancelReason] = createSignal("");
  const [confirmAction, setConfirmAction] = createSignal<SellerOrderActionDescriptor | null>(
    null,
  );

  const updateStatusTrigger = useAction(updateSellerOrderStatusAction);
  const shipTrigger = useAction(shipSellerOrderAction);
  const cancelTrigger = useAction(cancelSellerOrderAction);

  const updateStatusSubmission = useSubmission(updateSellerOrderStatusAction);
  const shipSubmission = useSubmission(shipSellerOrderAction);
  const cancelSubmission = useSubmission(cancelSellerOrderAction);

  const isPending = createMemo(
    () =>
      updateStatusSubmission.pending ||
      shipSubmission.pending ||
      cancelSubmission.pending,
  );

  const timelineEvents = createMemo(() => {
    const current = order();
    if (!current) return [];
    return buildTimelineFromHistory(current.statusHistory, (status) =>
      getOrderStatusLabel(status, t, current.paymentMethodKey),
    );
  });

  const handleMutationResult = (
    result: { success: boolean; stale?: boolean; error?: { message: string } } | undefined,
    successMessage: string,
  ) => {
    if (!result) return;
    if (result.success) {
      toaster.success(successMessage);
      setConfirmAction(null);
      setCancelReason("");
      setShipCarrier("");
      setShipTracking("");
      setShipEstimatedDelivery("");
      return;
    }
    if (result.stale) {
      toaster.warning(t("seller.orders.detailPage.staleConflict"));
      return;
    }
    toaster.error(result.error?.message ?? t("seller.orders.actionFailed"));
  };

  createEffect(() => {
    handleMutationResult(updateStatusSubmission.result, t("seller.orders.toast.updated"));
  });

  createEffect(() => {
    handleMutationResult(shipSubmission.result, t("seller.orders.toast.shipped"));
  });

  createEffect(() => {
    handleMutationResult(cancelSubmission.result, t("seller.orders.toast.cancelled"));
  });

  const runStatusAction = (action: SellerOrderActionDescriptor) => {
    const current = order();
    if (!current?.updatedAt || !action.targetStatus) return;
    updateStatusTrigger({
      orderId: current.id,
      status: action.targetStatus,
      expectedUpdatedAt: current.updatedAt,
    });
  };

  const runShip = () => {
    const current = order();
    if (!current?.updatedAt) return;
    shipTrigger({
      orderId: current.id,
      carrier: shipCarrier(),
      trackingNumber: shipTracking(),
      estimatedDelivery: shipEstimatedDelivery() || undefined,
      expectedUpdatedAt: current.updatedAt,
    });
  };

  const runCancel = () => {
    const current = order();
    if (!current?.updatedAt || !cancelReason().trim()) return;
    cancelTrigger({
      orderId: current.id,
      reason: cancelReason().trim(),
      expectedUpdatedAt: current.updatedAt,
    });
  };

  const handleAction = (action: SellerOrderActionDescriptor) => {
    if (action.disabled) {
      if (action.disabledReason) {
        toaster.error(action.disabledReason);
      }
      return;
    }

    if (action.key === "CANCEL") {
      if (!cancelReason().trim()) {
        toaster.error(t("seller.orders.detailPage.cancelReasonRequired"));
        return;
      }
    }

    if (action.requiresConfirmation) {
      setConfirmAction(action);
      return;
    }

    if (action.key === "SHIP") {
      runShip();
      return;
    }

    if (action.endpoint === "status") {
      runStatusAction(action);
    }
  };

  const confirmPendingAction = () => {
    const action = confirmAction();
    if (!action) return;

    if (action.key === "CANCEL") {
      runCancel();
      return;
    }

    runStatusAction(action);
  };

  const confirmDescription = createMemo(() => {
    const action = confirmAction();
    const current = order();
    if (!action || !current) return "";

    if (action.key === "CANCEL") {
      return t("seller.orders.detailPage.confirmCancel");
    }

    if (action.key === "MARK_DELIVERED" && current.payment.completesOnDeliver) {
      return t("seller.orders.detailPage.confirmCodDeliver");
    }

    return t("seller.orders.detailPage.confirmAction");
  });

  return (
    <SafeErrorBoundary
      fallback={(error, reset) => (
        <InlineErrorFallback
          error={error}
          reset={reset}
          label={t("seller.orders.detailPage.title")}
        />
      )}
    >
      <Suspense
        fallback={
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin w-8 h-8 border-4 border-forest-600 border-t-transparent rounded-full" />
            <span class="ml-3 text-gray-500 dark:text-gray-400">
              {t("seller.orders.detailPage.loading")}
            </span>
          </div>
        }
      >
        <Show
          when={order()}
          fallback={
            <div class="mx-auto max-w-lg text-center py-16">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("seller.orders.detailPage.notFound")}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t("seller.orders.detailPage.notFoundDescription")}
              </p>
              <A
                href={buildSellerOrdersListHref(returnTo())}
                class="inline-flex px-4 py-2 rounded-xl bg-forest-600 text-white text-sm font-semibold"
              >
                {t("seller.orders.detailPage.backToOrders")}
              </A>
            </div>
          }
        >
          {(currentOrder) => (
            <div class="mx-auto max-w-[1400px]">
              <SellerOrderHeader order={currentOrder()} returnTo={returnTo()} />

              <Show when={currentOrder().shop.status !== "ACTIVE"}>
                <div class="rounded-xl border border-cream-300 dark:border-cream-700 bg-cream-50 dark:bg-cream-900/20 px-4 py-3 text-sm text-cream-800 dark:text-cream-200 mb-6">
                  {t("seller.orders.shopNotActiveBanner")}
                </div>
              </Show>

              <SellerOrderCancelledBanner
                status={currentOrder().status}
                cancelledReason={currentOrder().cancelledReason}
                cancelledAt={currentOrder().cancelledAt}
              />

              <Show when={!currentOrder().isReadOnly}>
                <SellerOrderActionBar
                  actions={currentOrder().availableActions}
                  pending={isPending()}
                  onAction={handleAction}
                />
              </Show>

              <Show when={currentOrder().notes}>
                {(notes) => (
                  <div class="bg-cream-50 dark:bg-cream-900/20 border border-cream-200 dark:border-cream-800 rounded-xl p-4 mb-6">
                    <div class="flex items-start gap-3">
                      <PackageIcon class="w-4 h-4 text-cream-600 dark:text-cream-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p class="text-xs font-semibold uppercase text-cream-700 dark:text-cream-300 mb-1">
                          {t("seller.orders.detailPage.buyerNotes")}
                        </p>
                        <p class="text-sm text-cream-700 dark:text-cream-300">{notes()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Show>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                  <Show when={currentOrder().statusHistory.length > 0}>
                    <section class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm p-5">
                      <OrderTimeline
                        events={timelineEvents()}
                        currentStatus={currentOrder().status}
                      />
                    </section>
                  </Show>

                  <SellerOrderItemsSection items={currentOrder().items} />

                  <SellerOrderShipPanel
                    order={currentOrder()}
                    pending={isPending()}
                    carrier={shipCarrier()}
                    trackingNumber={shipTracking()}
                    estimatedDelivery={shipEstimatedDelivery()}
                    onCarrierChange={setShipCarrier}
                    onTrackingChange={setShipTracking}
                    onEstimatedDeliveryChange={setShipEstimatedDelivery}
                    onSubmit={runShip}
                  />

                  <SellerOrderCancelPanel
                    order={currentOrder()}
                    pending={isPending()}
                    reason={cancelReason()}
                    onReasonChange={setCancelReason}
                    onSubmit={() => {
                      const cancelAction = currentOrder().availableActions.find(
                        (action) => action.key === "CANCEL",
                      );
                      if (cancelAction) handleAction(cancelAction);
                    }}
                  />
                </div>

                <div class="lg:col-span-1 space-y-6">
                  <div class="sticky top-4 space-y-6">
                    <SellerOrderCustomerCard
                      customerName={currentOrder().customerName}
                      customerEmail={currentOrder().customerEmail}
                      customerPhone={currentOrder().customerPhone}
                    />
                    <SellerOrderShippingCard address={currentOrder().address} />
                    <SellerOrderSummaryCard
                      subtotal={currentOrder().subtotal}
                      shippingCost={currentOrder().shippingCost}
                      tax={currentOrder().tax}
                      total={currentOrder().total}
                    />
                    <Show when={currentOrder().shipment}>
                      {(shipment) => (
                        <ShipmentTrackingCard
                          shipment={{
                            carrier: shipment().carrier,
                            trackingNumber: shipment().trackingNumber,
                            status: shipment().status,
                            shippedAt: shipment().shippedAt,
                            deliveredAt: shipment().deliveredAt,
                          }}
                        />
                      )}
                    </Show>
                  </div>
                </div>
              </div>

              <SellerOrderPackingSlip order={currentOrder()} />

              <ConfirmDialog
                isOpen={confirmAction() !== null}
                onClose={() => setConfirmAction(null)}
                onConfirm={confirmPendingAction}
                title={t("seller.orders.detailPage.confirmTitle")}
                description={confirmDescription()}
                confirmLabel={t("seller.orders.detailPage.confirmButton")}
                cancelLabel={t("common.cancel")}
                variant={confirmAction()?.key === "CANCEL" ? "danger" : "default"}
              />
            </div>
          )}
        </Show>
      </Suspense>
    </SafeErrorBoundary>
  );
};

export default SellerOrderDetailPage;
