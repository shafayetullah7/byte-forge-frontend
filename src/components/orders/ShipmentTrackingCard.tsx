import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import { TruckIcon } from "~/components/icons";
import {
  getShipmentStatusLabel,
  getShippingMethodLabel,
} from "~/lib/orders/order-display.utils";
import type { OrderShipment } from "~/lib/api/types/order.types";

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ShipmentTrackingCard(props: { shipment: OrderShipment; class?: string }) {
  const { t } = useI18n();

  return (
    <div
      class={`bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm ${props.class ?? ""}`}
    >
      <div class="px-5 py-3 border-b border-gray-100 dark:border-forest-700 flex items-center gap-2">
        <TruckIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {t("buyer.orders.details.shipment")}
        </h3>
      </div>
      <div class="p-5 space-y-2 text-sm">
        <Show when={props.shipment.shippingMethod}>
          <div class="flex justify-between gap-4">
            <span class="text-gray-500 dark:text-gray-400">
              {t("seller.orders.detailPage.shippingMethodLabel")}
            </span>
            <span class="font-medium text-gray-900 dark:text-white">
              {getShippingMethodLabel(props.shipment.shippingMethod, t)}
            </span>
          </div>
        </Show>
        <Show when={props.shipment.carrier}>
          <div class="flex justify-between gap-4">
            <span class="text-gray-500 dark:text-gray-400">{t("buyer.orders.details.carrier")}</span>
            <span class="font-medium text-gray-900 dark:text-white">{props.shipment.carrier ?? "—"}</span>
          </div>
        </Show>
        <Show when={props.shipment.trackingNumber}>
          <div class="flex justify-between gap-4">
            <span class="text-gray-500 dark:text-gray-400">{t("buyer.orders.details.trackingNumber")}</span>
            <span class="font-mono font-medium text-gray-900 dark:text-white">
              {props.shipment.trackingNumber ?? "—"}
            </span>
          </div>
        </Show>
        <div class="flex justify-between gap-4">
          <span class="text-gray-500 dark:text-gray-400">{t("buyer.orders.details.shipmentStatus")}</span>
          <span class="font-medium text-gray-900 dark:text-white">
            {getShipmentStatusLabel(props.shipment.status, t)}
          </span>
        </div>
        <Show when={props.shipment.estimatedDelivery}>
          <div class="flex justify-between gap-4">
            <span class="text-gray-500 dark:text-gray-400">
              {t("buyer.orders.details.estimatedDelivery")}
            </span>
            <span class="font-medium text-gray-900 dark:text-white">
              {formatDate(props.shipment.estimatedDelivery ?? null)}
            </span>
          </div>
        </Show>
        <Show when={props.shipment.shippedAt}>
          {(shippedAt) => (
            <div class="flex justify-between gap-4">
              <span class="text-gray-500 dark:text-gray-400">{t("buyer.orders.details.shippedAt")}</span>
              <span class="font-medium text-gray-900 dark:text-white">{formatDateTime(shippedAt())}</span>
            </div>
          )}
        </Show>
        <Show when={props.shipment.deliveredAt}>
          {(deliveredAt) => (
            <div class="flex justify-between gap-4">
              <span class="text-gray-500 dark:text-gray-400">{t("buyer.orders.details.deliveredAt")}</span>
              <span class="font-medium text-gray-900 dark:text-white">{formatDateTime(deliveredAt())}</span>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
}
