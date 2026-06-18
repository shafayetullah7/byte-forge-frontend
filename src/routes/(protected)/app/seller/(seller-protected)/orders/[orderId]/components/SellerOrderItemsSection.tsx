import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import type { SellerOrderItem } from "~/lib/api/types/seller-orders.types";
import { formatPrice } from "./utils";

export function SellerOrderItemsSection(props: { items: SellerOrderItem[] }) {
  const { t } = useI18n();

  return (
    <section class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-forest-700">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
          {t("seller.orders.detailPage.items")}
        </h2>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-forest-700">
        <For each={props.items}>
          {(item) => (
            <div class="p-5 flex gap-4">
              <Show when={item.imageUrl}>
                {(url) => (
                  <img
                    src={url()}
                    alt={item.productName}
                    class="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-forest-700"
                  />
                )}
              </Show>
              <div class="flex-1 min-w-0">
                <A
                  href={`/app/seller/products/${item.productId}`}
                  class="font-medium text-gray-900 dark:text-white hover:text-forest-600 dark:hover:text-forest-400"
                >
                  {item.productName}
                </A>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {item.variantTitle ?? "—"}
                  {item.sku ? ` · SKU ${item.sku}` : ""}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t("seller.orders.detailPage.qty")} {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
              </div>
              <p class="font-semibold text-gray-900 dark:text-white">{formatPrice(item.subtotal)}</p>
            </div>
          )}
        </For>
      </div>
    </section>
  );
}
