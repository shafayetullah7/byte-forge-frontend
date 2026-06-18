import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import Button from "~/components/ui/Button";
import { OrderStatusBadge } from "~/components/orders";
import { EyeIcon } from "~/components/icons";
import type { SellerOrderSummary } from "~/lib/api/types/seller-orders.types";
import { formatDate, formatPrice } from "./utils";

export function SellerOrdersTable(props: {
  orders: SellerOrderSummary[];
  onView: (order: SellerOrderSummary) => void;
}) {
  const { t } = useI18n();

  return (
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-forest-700 bg-gray-50 dark:bg-forest-900/50">
            <th class="text-left px-5 py-3 text-xs font-semibold uppercase">{t("seller.orders.table.order")}</th>
            <th class="text-left px-5 py-3 text-xs font-semibold uppercase">{t("seller.orders.table.customer")}</th>
            <th class="text-left px-5 py-3 text-xs font-semibold uppercase">{t("seller.orders.table.items")}</th>
            <th class="text-left px-5 py-3 text-xs font-semibold uppercase">{t("seller.orders.table.total")}</th>
            <th class="text-left px-5 py-3 text-xs font-semibold uppercase">{t("seller.orders.table.status")}</th>
            <th class="text-right px-5 py-3 text-xs font-semibold uppercase">{t("seller.orders.table.action")}</th>
          </tr>
        </thead>
        <tbody>
          <Show
            when={props.orders.length > 0}
            fallback={
              <tr>
                <td colspan="6" class="px-5 py-16 text-center text-sm text-gray-500">
                  {t("seller.orders.noOrders")}
                </td>
              </tr>
            }
          >
            <For each={props.orders}>
              {(order) => (
                <tr class="border-b border-gray-100 dark:border-forest-700/50 hover:bg-gray-50 dark:hover:bg-forest-900/30">
                  <td class="px-5 py-4">
                    <p class="text-sm font-semibold font-mono">{order.orderNumber}</p>
                    <p class="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                  </td>
                  <td class="px-5 py-4">
                    <p class="text-sm font-medium">{order.customerName}</p>
                    <p class="text-xs text-gray-400">{order.customerEmail ?? "—"}</p>
                  </td>
                  <td class="px-5 py-4">
                    <For each={order.items.slice(0, 2)}>
                      {(item) => (
                        <p class="text-sm truncate">{item.productName} ×{item.quantity}</p>
                      )}
                    </For>
                  </td>
                  <td class="px-5 py-4 font-bold">{formatPrice(order.total)}</td>
                  <td class="px-5 py-4">
                    <OrderStatusBadge
                      status={order.status}
                      paymentMethodKey={order.paymentMethodKey}
                    />
                  </td>
                  <td class="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => props.onView(order)}>
                      <EyeIcon class="w-4 h-4" />
                      {t("seller.orders.view")}
                    </Button>
                  </td>
                </tr>
              )}
            </For>
          </Show>
        </tbody>
      </table>
    </div>
  );
}
