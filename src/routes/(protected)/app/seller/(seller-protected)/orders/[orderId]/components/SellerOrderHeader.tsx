import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { ChevronLeftIcon, PrinterIcon } from "~/components/icons";
import { OrderStatusBadge, PaymentMethodBadge } from "~/components/orders";
import Badge from "~/components/ui/Badge";
import {
  getOrderStage,
  getPaymentStatusLabel,
  getSellerOrderStatusLabel,
} from "~/lib/orders/order-display.utils";
import type { SellerOrderDetail } from "~/lib/api/types/seller-orders.types";
import { buildSellerOrdersListHref } from "~/lib/orders/seller-order.utils";
import { formatDateTime, formatFullDate, formatTime } from "./utils";

export function SellerOrderHeader(props: {
  order: SellerOrderDetail;
  returnTo?: string | null;
}) {
  const { t } = useI18n();
  const backHref = buildSellerOrdersListHref(props.returnTo);
  const stage = () => getOrderStage(props.order.status);

  return (
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-4">
        <A
          href={backHref}
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors"
          aria-label={t("common.back")}
        >
          <ChevronLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </A>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {t("seller.orders.detailPage.breadcrumb")}
          </p>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-mono">
            {props.order.orderNumber}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("seller.orders.detailPage.placedOn")} {formatFullDate(props.order.createdAt)}{" "}
            {t("common.at")} {formatTime(props.order.createdAt)}
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {t("seller.orders.detailPage.lastUpdated")} {formatDateTime(props.order.updatedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          class="p-2.5 rounded-lg border border-gray-200 dark:border-forest-700 hover:bg-gray-50 dark:hover:bg-forest-700 transition-colors print:hidden"
          aria-label={t("seller.orders.detailPage.print")}
        >
          <PrinterIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div class="flex flex-wrap gap-2 items-center">
        <OrderStatusBadge
          status={props.order.status}
          paymentMethodKey={props.order.paymentMethodKey}
          labelOverride={getSellerOrderStatusLabel(props.order.status, t)}
        />
        <Badge variant="default">{getPaymentStatusLabel(props.order.paymentStatus, t)}</Badge>
        <PaymentMethodBadge
          paymentMethod={props.order.paymentMethod}
          paymentMethodId={props.order.paymentMethodId}
          paymentMethodKey={props.order.paymentMethodKey}
          paymentMethodDisplayName={props.order.paymentMethodDisplayName}
          paymentMethodLogoUrl={props.order.paymentMethodLogoUrl}
        />
        <Show when={stage()}>
          {(s) => (
            <Badge variant="default">
              {t("seller.orders.detailPage.stage", {
                current: s().current,
                total: s().total,
              })}
            </Badge>
          )}
        </Show>
      </div>

      <Show when={props.order.payment.collectOnDelivery}>
        <div class="mt-4 rounded-xl border border-cream-300 dark:border-cream-700 bg-cream-50 dark:bg-cream-900/20 px-4 py-3 text-sm text-cream-800 dark:text-cream-200">
          {t("seller.orders.detailPage.codPaymentCallout", { amount: props.order.total })}
        </div>
      </Show>

      <Show when={props.order.status === "COMPLETED"}>
        <div class="mt-4 rounded-xl border border-forest-300 dark:border-forest-700 bg-forest-50 dark:bg-forest-900/20 px-4 py-3 text-sm text-forest-800 dark:text-forest-200">
          {t("seller.orders.detailPage.completedBanner")}
        </div>
      </Show>

      <Show when={props.order.status === "SHIPPED" && !props.order.buyerDeliveryConfirmedAt}>
        <div class="mt-4 rounded-xl border border-cream-300 dark:border-cream-700 bg-cream-50 dark:bg-cream-900/20 px-4 py-3 text-sm text-cream-800 dark:text-cream-200">
          {t("seller.orders.detailPage.waitingForBuyerConfirmation")}
        </div>
      </Show>

      <Show when={props.order.buyerDeliveryConfirmedAt}>
        {(date) => (
          <div class="mt-4 rounded-xl border border-forest-200 dark:border-forest-700 bg-forest-50 dark:bg-forest-900/20 px-4 py-3 text-sm text-forest-800 dark:text-forest-200">
            {t("seller.orders.detailPage.buyerConfirmedDelivery", {
              date: formatFullDate(date()),
            })}
          </div>
        )}
      </Show>
    </div>
  );
}
