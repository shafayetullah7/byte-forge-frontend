import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import type { OrderGroup } from "~/lib/api/types/order.types";
import { PackageIcon } from "~/components/icons";
import { StatusBadge } from "~/components/ui/StatusBadge";
import { mapStatus, getStatusColor, formatTotal, formatDate, getOrderItemsPreview } from "./utils";

export function OrdersTable(props: {
  groups: OrderGroup[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}) {
  const { t } = useI18n();

  return (
    <Show
      when={props.groups.length > 0}
      fallback={
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm p-12 text-center">
          <PackageIcon class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {props.hasActiveFilters ? t("buyer.orders.noOrdersFound") : t("buyer.orders.empty.title")}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
            {props.hasActiveFilters
              ? t("buyer.orders.noOrdersAdjustFilters")
              : t("buyer.orders.empty.description")}
          </p>
          <Show when={props.hasActiveFilters}>
            <button
              onClick={props.onClearFilters}
              class="inline-flex items-center px-5 py-2.5 bg-forest-600 dark:bg-sage-600 hover:bg-forest-700 dark:hover:bg-sage-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              {t("buyer.orders.clearFilters")}
            </button>
          </Show>
        </div>
      }
    >
      <div class="space-y-4">
        <For each={props.groups}>
          {(group) => (
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm overflow-hidden">
              <div class="px-5 py-3 border-b border-gray-100 dark:border-forest-700 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(group.createdAt)}
                  </span>
                  {group.orders.length > 1 && (
                    <span class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-forest-700 text-gray-600 dark:text-gray-400 rounded-full font-medium">
                      {group.orders.length} {t("buyer.orders.shops")}
                    </span>
                  )}
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-xs text-gray-400 dark:text-gray-500">
                    {group.orders.reduce((sum, o) => sum + o.items.length, 0)} {t("buyer.orders.items")}
                  </span>
                  <span class="text-base font-bold text-forest-600 dark:text-forest-400">
                    {formatTotal(group.totalAmount)}
                  </span>
                </div>
              </div>

              <div class="divide-y divide-gray-100 dark:divide-forest-700">
                <For each={group.orders}>
                  {(order) => (
                    <A
                      href={`/app/orders/${group.id}`}
                      class={`block px-5 py-3 border-l-4 ${getStatusColor(order.status)} hover:bg-gray-50 dark:hover:bg-forest-700/50 transition-colors`}
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2 min-w-0">
                          <div class="w-7 h-7 rounded-lg bg-gray-50 dark:bg-forest-900/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {order.shopLogo ? (
                              <img src={order.shopLogo} alt={order.shopName} class="w-full h-full object-cover" />
                            ) : (
                              <span class="text-xs font-bold text-gray-500 dark:text-gray-400">
                                {order.shopName?.charAt(0) ?? "?"}
                              </span>
                            )}
                          </div>
                          <div class="min-w-0">
                            <span class="text-sm font-medium text-gray-900 dark:text-white truncate block">
                              {order.shopName}
                            </span>
                            <span class="text-[11px] text-gray-400 dark:text-gray-500">
                              {order.orderNumber}
                            </span>
                          </div>
                        </div>
                        <div class="flex items-center gap-2 flex-shrink-0">
                          <StatusBadge status={mapStatus(order.status)} />
                        </div>
                      </div>

                      <div class="flex items-center gap-2 pl-9">
                        <div class="flex -space-x-1.5">
                          <For each={order.items.slice(0, 3)}>
                            {(item) => (
                              <div class="w-8 h-8 rounded-md bg-gray-100 dark:bg-forest-700 border-2 border-white dark:border-forest-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {item.thumbnail ? (
                                  <img src={item.thumbnail.url} alt={item.productName} class="w-full h-full object-cover" />
                                ) : (
                                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </div>
                            )}
                          </For>
                          {order.items.length > 3 && (
                            <div class="w-8 h-8 rounded-md bg-gray-200 dark:bg-forest-600 border-2 border-white dark:border-forest-800 flex items-center justify-center flex-shrink-0">
                              <span class="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                                +{order.items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {getOrderItemsPreview(order.items)}
                        </span>
                        <span class="text-xs font-medium text-gray-900 dark:text-white ml-auto flex-shrink-0">
                          {formatTotal(order.total)}
                        </span>
                      </div>
                    </A>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
