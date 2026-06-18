import { createMemo } from "solid-js";
import { useI18n } from "~/i18n";
import { TruckIcon, CreditCardIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from "~/components/icons";
import { PaymentMethodBadge } from "~/components/orders";
import type { OrderPaymentFields } from "~/lib/api/types/order.types";
import { getPaymentStatusLabel } from "~/lib/orders/order-display.utils";
import { formatCurrency } from "./utils";

function getPaymentStatusInfo(status: string) {
  if (status === "COMPLETED") return { class: "bg-sage-100 text-sage-700 dark:bg-sage-900/40 dark:text-sage-300", icon: <CheckCircleIcon class="w-3 h-3" /> };
  if (status === "REFUNDED") return { class: "bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300", icon: <ArrowPathIcon class="w-3 h-3" /> };
  if (status === "FAILED") return { class: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", icon: <XCircleIcon class="w-3 h-3" /> };
  return { class: "bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300", icon: null };
}

export function OrderSummaryWithPayment(props: {
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  paymentStatus: string;
} & OrderPaymentFields) {
  const { t } = useI18n();

  const paymentInfo = createMemo(() => getPaymentStatusInfo(props.paymentStatus));

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
      <div class="px-5 py-3 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {t("buyer.orders.details.summary")}
        </h3>
      </div>
      <div class="p-5 space-y-2.5">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">
            {t("buyer.orders.details.subtotal")}
          </span>
          <span class="font-medium text-gray-900 dark:text-white">
            {formatCurrency(props.subtotal)}
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <TruckIcon class="w-3.5 h-3.5" />
            {t("buyer.orders.details.shipping")}
          </span>
          <span class="font-medium text-gray-900 dark:text-white">
            {formatCurrency(props.shippingCost)}
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">
            {t("buyer.orders.details.tax")}
          </span>
          <span class="font-medium text-gray-900 dark:text-white">
            {formatCurrency(props.tax)}
          </span>
        </div>
        <div class="pt-2.5 border-t border-gray-200 dark:border-forest-700 flex justify-between">
          <span class="text-sm font-bold text-gray-900 dark:text-white">
            {t("buyer.orders.details.total")}
          </span>
          <span class="text-base font-bold text-forest-600 dark:text-forest-400">
            {formatCurrency(props.total)}
          </span>
        </div>

        <div class="pt-3 border-t border-gray-100 dark:border-forest-700 space-y-2">
          <div class="flex justify-between items-center text-sm gap-3">
            <span class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 shrink-0">
              <CreditCardIcon class="w-3.5 h-3.5" />
              {t("buyer.orders.details.method")}
            </span>
            <PaymentMethodBadge {...props} />
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">
              {t("buyer.orders.details.paymentStatus")}
            </span>
            <span class={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${paymentInfo().class}`}>
              {paymentInfo().icon}
              {getPaymentStatusLabel(props.paymentStatus, t)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
