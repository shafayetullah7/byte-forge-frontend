import { For, Show, createMemo } from "solid-js";
import { useI18n } from "~/i18n";
import Badge from "~/components/ui/Badge";
import Button from "~/components/ui/Button";
import { PaymentMethodBadge, OrderStatusBadge, ShipmentTrackingCard } from "~/components/orders";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "~/components/icons";
import { OrderTimeline } from "~/routes/(protected)/app/(buyer)/orders/[id]/components/OrderTimeline";
import { buildTimelineFromHistory } from "~/routes/(protected)/app/(buyer)/orders/[id]/components/utils";
import { getOrderStatusLabel, getPaymentStatusLabel } from "~/lib/orders/order-display.utils";
import type { SellerOrderDetail } from "~/lib/api/types/seller-orders.types";
import { formatDateTime, formatPrice } from "./utils";
import { ShipOrderForm } from "./ShipOrderForm";

export function SellerOrderDetailModal(props: {
  order: SellerOrderDetail;
  isActionLoading: boolean;
  shipCarrier: string;
  shipTracking: string;
  shipEstimatedDelivery: string;
  cancelReason: string;
  onShipCarrierChange: (value: string) => void;
  onShipTrackingChange: (value: string) => void;
  onShipEstimatedDeliveryChange: (value: string) => void;
  onCancelReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  onStartProcessing: () => void;
  onShip: () => void;
  onMarkDelivered: () => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();

  const timelineEvents = createMemo(() =>
    buildTimelineFromHistory(props.order.statusHistory, (status) =>
      getOrderStatusLabel(status, t, props.order.paymentMethodKey),
    ),
  );

  const shipmentForCard = () => {
    const s = props.order.shipment;
    if (!s) return null;
    return {
      carrier: s.carrier,
      trackingNumber: s.trackingNumber,
      status: s.status,
      shippedAt: s.shippedAt,
      deliveredAt: s.deliveredAt,
    };
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" onClick={props.onClose} />
      <div class="relative bg-white dark:bg-forest-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-forest-700">
        <div class="sticky top-0 bg-white dark:bg-forest-800 border-b px-6 py-5 flex justify-between z-10">
          <div>
            <h2 class="text-lg font-bold">{props.order.orderNumber}</h2>
            <p class="text-sm text-gray-500">{formatDateTime(props.order.createdAt)}</p>
          </div>
          <button
            onClick={props.onClose}
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700"
            aria-label={t("seller.orders.detail.close")}
          >
            <XCircleIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 space-y-5">
          <div class="flex flex-wrap gap-2 items-center">
            <OrderStatusBadge
              status={props.order.status}
              paymentMethodKey={props.order.paymentMethodKey}
            />
            <Badge variant="default">
              {getPaymentStatusLabel(props.order.paymentStatus, t)}
            </Badge>
            <PaymentMethodBadge
              paymentMethod={props.order.paymentMethod}
              paymentMethodId={props.order.paymentMethodId}
              paymentMethodKey={props.order.paymentMethodKey}
              paymentMethodDisplayName={props.order.paymentMethodDisplayName}
              paymentMethodLogoUrl={props.order.paymentMethodLogoUrl}
            />
          </div>

          <Show when={props.order.statusHistory.length > 0}>
            <OrderTimeline events={timelineEvents()} currentStatus={props.order.status} />
          </Show>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="rounded-xl bg-gray-50 dark:bg-forest-900/30 p-4">
              <h3 class="text-xs font-semibold uppercase text-gray-500 mb-2">
                {t("seller.orders.detail.customer")}
              </h3>
              <p class="text-sm font-medium">{props.order.customerName}</p>
              <p class="text-sm">{props.order.customerEmail ?? "—"}</p>
              <p class="text-sm">{props.order.customerPhone}</p>
            </div>
            <Show when={props.order.address}>
              {(address) => (
                <div class="rounded-xl bg-gray-50 dark:bg-forest-900/30 p-4">
                  <h3 class="text-xs font-semibold uppercase text-gray-500 mb-2">
                    {t("seller.orders.detail.shipping")}
                  </h3>
                  <p class="text-sm">{address().recipientName}</p>
                  <p class="text-sm">{address().addressLine1}</p>
                  <p class="text-sm">
                    {address().city}, {address().country}
                  </p>
                </div>
              )}
            </Show>
          </div>

          <div class="space-y-3">
            <For each={props.order.items}>
              {(item) => (
                <div class="flex justify-between gap-4 border rounded-xl p-4 border-gray-200 dark:border-forest-700">
                  <div>
                    <p class="font-medium">{item.productName}</p>
                    <p class="text-xs text-gray-500">
                      {item.variantTitle ?? "—"} · ×{item.quantity}
                    </p>
                  </div>
                  <p class="font-semibold">{formatPrice(item.subtotal)}</p>
                </div>
              )}
            </For>
          </div>

          <div class="rounded-xl bg-gray-50 dark:bg-forest-900/30 p-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span>{t("seller.orders.detail.subtotal")}</span>
              <span>{formatPrice(props.order.subtotal)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>{t("seller.orders.detail.shippingCost")}</span>
              <span>{formatPrice(props.order.shippingCost)}</span>
            </div>
            <div class="flex justify-between font-bold">
              <span>{t("seller.orders.detail.total")}</span>
              <span>{formatPrice(props.order.total)}</span>
            </div>
          </div>

          <Show when={shipmentForCard()}>
            {(shipment) => <ShipmentTrackingCard shipment={shipment()} />}
          </Show>

          <Show when={props.order.status === "PROCESSING"}>
            <ShipOrderForm
              carrier={props.shipCarrier}
              trackingNumber={props.shipTracking}
              estimatedDelivery={props.shipEstimatedDelivery}
              loading={props.isActionLoading}
              onCarrierChange={props.onShipCarrierChange}
              onTrackingChange={props.onShipTrackingChange}
              onEstimatedDeliveryChange={props.onShipEstimatedDeliveryChange}
              onSubmit={props.onShip}
            />
          </Show>

          <Show when={["PENDING_PAYMENT", "CONFIRMED", "PROCESSING"].includes(props.order.status)}>
            <div class="space-y-2 border rounded-xl p-4 border-gray-200 dark:border-forest-700">
              <h3 class="text-sm font-semibold">{t("seller.orders.detail.cancelOrder")}</h3>
              <textarea
                placeholder={t("seller.orders.detail.cancelReasonPlaceholder")}
                value={props.cancelReason}
                onInput={(e) => props.onCancelReasonChange(e.currentTarget.value)}
                class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm min-h-20"
              />
              <Button variant="outline" loading={props.isActionLoading} onClick={props.onCancel}>
                {t("seller.orders.detail.cancelOrder")}
              </Button>
            </div>
          </Show>
        </div>

        <div class="sticky bottom-0 border-t px-6 py-4 flex flex-wrap gap-2 justify-end bg-white dark:bg-forest-800">
          <Show when={props.order.status === "PENDING_PAYMENT"}>
            <Button loading={props.isActionLoading} onClick={props.onConfirm}>
              <CheckCircleIcon class="w-4 h-4" />
              {t("seller.orders.detail.confirm")}
            </Button>
          </Show>
          <Show when={props.order.status === "CONFIRMED"}>
            <Button loading={props.isActionLoading} onClick={props.onStartProcessing}>
              <ClockIcon class="w-4 h-4" />
              {t("seller.orders.detail.startProcessing")}
            </Button>
          </Show>
          <Show when={props.order.status === "SHIPPED"}>
            <Button loading={props.isActionLoading} onClick={props.onMarkDelivered}>
              <CheckCircleIcon class="w-4 h-4" />
              {t("seller.orders.detail.markDelivered")}
            </Button>
          </Show>
          <Button variant="outline" onClick={props.onClose}>
            {t("seller.orders.detail.close")}
          </Button>
        </div>
      </div>
    </div>
  );
}
