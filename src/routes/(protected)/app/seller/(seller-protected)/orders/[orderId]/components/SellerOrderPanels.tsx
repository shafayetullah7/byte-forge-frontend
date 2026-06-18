import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import Button from "~/components/ui/Button";
import { ShipOrderForm } from "../../components/ShipOrderForm";
import { getSellerOrderAction } from "~/lib/orders/seller-order.utils";
import type { SellerOrderActionDescriptor, SellerOrderDetail } from "~/lib/api/types/seller-orders.types";

export function SellerOrderShipPanel(props: {
  order: SellerOrderDetail;
  pending: boolean;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  onCarrierChange: (value: string) => void;
  onTrackingChange: (value: string) => void;
  onEstimatedDeliveryChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const shipAction = () => getSellerOrderAction(props.order.availableActions, "SHIP");

  return (
    <Show when={shipAction()}>
      {(action) => (
        <div class="print:hidden">
          <ShipOrderForm
            carrier={props.carrier}
            trackingNumber={props.trackingNumber}
            estimatedDelivery={props.estimatedDelivery}
            loading={props.pending}
            disabled={action().disabled}
            disabledReason={action().disabledReason}
            onCarrierChange={props.onCarrierChange}
            onTrackingChange={props.onTrackingChange}
            onEstimatedDeliveryChange={props.onEstimatedDeliveryChange}
            onSubmit={props.onSubmit}
          />
        </div>
      )}
    </Show>
  );
}

export function SellerOrderCancelPanel(props: {
  order: SellerOrderDetail;
  pending: boolean;
  reason: string;
  onReasonChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const { t } = useI18n();
  const cancelAction = () => getSellerOrderAction(props.order.availableActions, "CANCEL");

  return (
    <Show when={cancelAction()}>
      {(action) => (
        <div class="space-y-2 border rounded-xl p-4 border-gray-200 dark:border-forest-700 print:hidden">
          <h3 class="text-sm font-semibold">{t("seller.orders.detail.cancelOrder")}</h3>
          <textarea
            placeholder={t("seller.orders.detail.cancelReasonPlaceholder")}
            value={props.reason}
            onInput={(e) => props.onReasonChange(e.currentTarget.value)}
            class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm min-h-20"
          />
          <Button
            variant="outline"
            loading={props.pending}
            disabled={props.pending || action().disabled || !props.reason.trim()}
            title={action().disabled ? action().disabledReason ?? undefined : undefined}
            onClick={props.onSubmit}
          >
            {t("seller.orders.detail.cancelOrder")}
          </Button>
        </div>
      )}
    </Show>
  );
}

export type { SellerOrderActionDescriptor };
