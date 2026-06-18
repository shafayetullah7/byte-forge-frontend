import { createSignal, createMemo, For, Show, Suspense } from "solid-js";
import { ErrorBoundary } from "solid-js";
import { useParams, createAsync, A } from "@solidjs/router";
import { SectionErrorFallback } from "~/components/seller/SectionErrorFallback";
import { MagnifyingGlassIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { getSellerOrders } from "~/lib/api/endpoints/seller/orders.api";
import type { OrderStatus } from "~/lib/api/types/seller-orders.types";
import { buildSellerOrderHref, filterOrdersByProduct, flattenProductOrderRows } from "~/lib/orders/seller-order.utils";
import { OrderStatusBadge } from "~/components/orders";
import { formatPrice, formatDate } from "../helpers";

const COLUMN_COUNT = 7;

export default function ProductOrdersRoute() {
  const { t } = useI18n();
  const params = useParams();
  const productId = () => params.productId as string;

  const [orderSearchQuery, setOrderSearchQuery] = createSignal("");
  const [orderStatusFilter, setOrderStatusFilter] = createSignal("");

  const ordersResponse = createAsync(
    () =>
      getSellerOrders({
        search: orderSearchQuery() || undefined,
        orderStatus: (orderStatusFilter() || undefined) as OrderStatus | undefined,
        limit: 100,
      }),
    { deferStream: true },
  );

  const productOrders = createMemo(() => {
    const response = ordersResponse();
    if (!response) return [];
    return filterOrdersByProduct(response.data, productId());
  });

  const orderRows = createMemo(() => flattenProductOrderRows(productOrders(), productId()));

  return (
    <ErrorBoundary fallback={(error) => <SectionErrorFallback error={error} title="orders" />}>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
        <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700">
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1 relative">
              <input
                type="text"
                placeholder={t("seller.orders.searchPlaceholder")}
                value={orderSearchQuery()}
                onInput={(e) => setOrderSearchQuery(e.currentTarget.value)}
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 placeholder-gray-400 dark:placeholder-gray-500 transition-standard focus-ring-flat"
              />
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select
              value={orderStatusFilter()}
              onChange={(e) => setOrderStatusFilter(e.currentTarget.value)}
              class="px-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 text-sm"
            >
              <option value="">{t("seller.orders.filters.allStatuses")}</option>
              <option value="DELIVERED">{t("seller.orders.delivered")}</option>
              <option value="SHIPPED">{t("seller.orders.shipped")}</option>
              <option value="PROCESSING">{t("seller.orders.processing")}</option>
              <option value="CANCELLED">{t("seller.orders.cancelled")}</option>
            </select>
          </div>
        </div>

        <Suspense fallback={<div class="p-8 text-center text-sm text-gray-500">{t("seller.orders.loading")}</div>}>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-cream-200 dark:border-forest-700 bg-cream-50 dark:bg-forest-900/50">
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t("seller.orders.table.order")}</th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t("seller.orders.table.customer")}</th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t("seller.products.productOverview.tableName")}</th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t("buyer.orders.details.qty")}</th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t("seller.orders.table.total")}</th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t("seller.orders.table.status")}</th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t("seller.products.productOverview.orderTableDate")}</th>
                </tr>
              </thead>
              <tbody>
                <Show
                  when={orderRows().length > 0}
                  fallback={
                    <tr>
                      <td colspan={COLUMN_COUNT} class="px-4 py-12 text-center text-sm text-gray-500">
                        {t("seller.orders.noOrders")}
                      </td>
                    </tr>
                  }
                >
                  <For each={orderRows()}>
                    {(row) => (
                      <tr>
                        <td colspan={COLUMN_COUNT} class="p-0 border-b border-cream-100 dark:border-forest-700/50">
                          <A
                            href={buildSellerOrderHref(row.orderId)}
                            class="grid grid-cols-7 gap-3 px-4 py-3 hover:bg-cream-50 dark:hover:bg-forest-900/30 transition-colors no-underline text-inherit"
                            aria-label={t("seller.orders.viewOrder", { orderNumber: row.orderNumber })}
                          >
                            <span class="font-mono text-sm text-forest-800 dark:text-cream-50 self-center">{row.orderNumber}</span>
                            <div class="min-w-0 self-center">
                              <p class="text-sm font-medium text-forest-800 dark:text-cream-50">{row.customerName}</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{row.customerEmail ?? "—"}</p>
                            </div>
                            <p class="text-sm text-forest-800 dark:text-cream-50 self-center truncate">{row.variantTitle ?? "—"}</p>
                            <span class="text-sm text-gray-700 dark:text-gray-300 self-center">{row.quantity}</span>
                            <span class="text-sm font-semibold text-forest-800 dark:text-cream-50 self-center">{formatPrice(parseFloat(row.total))}</span>
                            <div class="self-center">
                              <OrderStatusBadge status={row.status} paymentMethodKey={row.paymentMethodKey} />
                            </div>
                            <span class="text-sm text-gray-500 dark:text-gray-400 self-center">{formatDate(row.createdAt)}</span>
                          </A>
                        </td>
                      </tr>
                    )}
                  </For>
                </Show>
              </tbody>
            </table>
          </div>
        </Suspense>

        <div class="px-6 py-4 border-t border-cream-200 dark:border-forest-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {t("seller.orders.resultsCount", {
              showing: orderRows().length,
              total: orderRows().length,
            })}
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
}
