import { Show, For } from "solid-js";
import { useI18n } from "~/i18n";
import type { OrderItemDetail } from "~/lib/api/types/order.types";
import { CheckCircleIcon, PackageIcon } from "~/components/icons";
import { formatCurrency } from "./utils";

export function OrderItemsSection(props: {
  items: OrderItemDetail[];
  onReview?: (item: OrderItemDetail) => void;
}) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm overflow-hidden">
      <div class="px-5 py-3 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {t("buyer.orders.details.items")} ({props.items.length})
        </h3>
      </div>

      <div class="divide-y divide-gray-100 dark:divide-forest-700">
        <For each={props.items}>
          {(item) => (
            <div class="px-5 py-3 flex items-center gap-3">
              <div class="w-14 h-14 bg-gray-100 dark:bg-forest-700 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.thumbnail?.url ? (
                  <img
                    src={item.thumbnail.url}
                    alt={item.productName}
                    class="w-full h-full object-cover"
                  />
                ) : (
                  <PackageIcon class="w-5 h-5 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.productName}
                </h4>
                <Show when={item.variantTitle}>
                  {(variant) => (
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {variant()}
                    </p>
                  )}
                </Show>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {t("buyer.orders.details.qty")} × {item.quantity}
                </p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(item.subtotal)}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500">
                  {formatCurrency(item.unitPrice)} each
                </p>
                <Show
                  when={item.canReview}
                  fallback={
                    <Show when={item.reviewStatus}>
                      {(status) => (
                        <span class="mt-2 inline-flex items-center gap-1 rounded-full bg-forest-50 dark:bg-forest-900/30 px-2 py-1 text-[11px] font-medium text-forest-700 dark:text-forest-300">
                          <CheckCircleIcon class="w-3 h-3" />
                          {status() === "PENDING"
                            ? "Review pending"
                            : status() === "APPROVED"
                              ? "Reviewed"
                              : "Review rejected"}
                        </span>
                      )}
                    </Show>
                  }
                >
                  <button
                    type="button"
                    onClick={() => props.onReview?.(item)}
                    class="mt-2 rounded-lg border border-forest-200 dark:border-forest-700 px-2.5 py-1 text-xs font-semibold text-forest-700 dark:text-forest-300 hover:bg-forest-50 dark:hover:bg-forest-900/30 transition-colors"
                  >
                    Write review
                  </button>
                </Show>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
