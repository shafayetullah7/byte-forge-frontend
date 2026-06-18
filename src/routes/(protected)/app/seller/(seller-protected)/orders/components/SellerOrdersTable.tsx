import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { OrderStatusBadge } from "~/components/orders";
import type { SellerOrderSummary } from "~/lib/api/types/seller-orders.types";
import { formatDate, formatPrice } from "./utils";

const COLUMN_COUNT = 5;

export function SellerOrdersTable(props: {
  orders: SellerOrderSummary[];
  getOrderHref: (orderId: string) => string;
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
          </tr>
        </thead>
        <tbody>
          <Show
            when={props.orders.length > 0}
            fallback={
              <tr>
                <td colspan={COLUMN_COUNT} class="px-5 py-16 text-center text-sm text-gray-500">
                  {t("seller.orders.noOrders")}
                </td>
              </tr>
            }
          >
            <For each={props.orders}>
              {(order) => (
                <tr>
                  <td colspan={COLUMN_COUNT} class="p-0 border-b border-gray-100 dark:border-forest-700/50">
                    <A
                      href={props.getOrderHref(order.id)}
                      class="grid grid-cols-5 gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-forest-900/30 transition-colors no-underline text-inherit"
                      aria-label={t("seller.orders.viewOrder", { orderNumber: order.orderNumber })}
                    >
                      <div class="min-w-0">
                        <p class="text-sm font-semibold font-mono">{order.orderNumber}</p>
                        <p class="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-medium">{order.customerName}</p>
                        <p class="text-xs text-gray-400 truncate">{order.customerEmail ?? "—"}</p>
                      </div>
                      <div class="min-w-0">
                        <For each={order.items.slice(0, 2)}>
                          {(item) => (
                            <p class="text-sm truncate">{item.productName} ×{item.quantity}</p>
                          )}
                        </For>
                      </div>
                      <div class="font-bold self-center">{formatPrice(order.total)}</div>
                      <div class="self-center">
                        <OrderStatusBadge
                          status={order.status}
                          paymentMethodKey={order.paymentMethodKey}
                        />
                      </div>
                    </A>
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
