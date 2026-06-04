import { Component, Show, For } from "solid-js";
import { useI18n } from "~/i18n";
import { formatPrice } from "../../plants/constants";
import {
  LeafIcon,
  TruckIcon,
  ShopIcon,
} from "~/components/icons";

interface ShopItem {
  id: string;
  shopId: string;
  shopName: string;
  productName: string;
  productSlug: string;
  variantTitle: string;
  quantity: number;
  price: number;
  lineTotal: number;
  thumbnailUrl: string | null;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface ShopOrderReviewProps {
  shop: {
    shopId: string;
    shopName: string;
    items: ShopItem[];
    itemsSubtotal: number;
    shippingCost: number;
  };
}

const ShopOrderReview: Component<ShopOrderReviewProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 overflow-hidden">
      {/* Shop header */}
      <div class="flex items-center gap-3 px-5 py-4 bg-cream-50 dark:bg-forest-900/40 border-b border-cream-200 dark:border-forest-700">
        <div class="p-2 bg-forest-100 dark:bg-forest-900/60 rounded-lg">
          <ShopIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-forest-800 dark:text-cream-50 truncate">
            {props.shop.shopName}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {props.shop.items.length} item{props.shop.items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Items */}
      <div class="divide-y divide-cream-100 dark:divide-forest-700/50">
        <For each={props.shop.items}>
          {(item) => (
            <div class="flex items-start gap-4 px-5 py-4">
              {/* Thumbnail */}
              <div class="w-16 h-16 flex-shrink-0 bg-cream-100 dark:bg-forest-900/50 rounded-lg overflow-hidden">
                <Show
                  when={item.thumbnailUrl}
                  fallback={
                    <div class="w-full h-full flex items-center justify-center">
                      <LeafIcon class="w-6 h-6 text-gray-300 dark:text-gray-600" />
                    </div>
                  }
                >
                  {(url) => (
                    <img
                      src={url()}
                      alt={item.productName}
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </Show>
              </div>

              {/* Item details */}
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-forest-800 dark:text-cream-50 truncate">
                  {item.productName}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {item.variantTitle}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity}
                  </span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">× {formatPrice(item.price)}</span>
                </div>
              </div>

              {/* Line total */}
              <p class="text-sm font-semibold text-forest-800 dark:text-cream-50 flex-shrink-0">
                {formatPrice(item.lineTotal)}
              </p>
            </div>
          )}
        </For>
      </div>

      {/* Shop subtotal + shipping */}
      <div class="px-5 py-3 bg-cream-50/50 dark:bg-forest-900/20 border-t border-cream-100 dark:border-forest-700/50 space-y-1.5">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">
            {t("checkout.shopSubtotal")}
          </span>
          <span class="font-medium text-forest-800 dark:text-cream-50">
            {formatPrice(props.shop.itemsSubtotal)}
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <TruckIcon class="w-3.5 h-3.5" />
            {t("checkout.shipping")}
          </span>
          <Show
            when={props.shop.shippingCost > 0}
            fallback={
              <span class="font-medium text-forest-600 dark:text-forest-400 text-xs">
                {t("checkout.freeShipping")}
              </span>
            }
          >
            <span class="font-medium text-forest-800 dark:text-cream-50">
              {formatPrice(props.shop.shippingCost)}
            </span>
          </Show>
        </div>
        <div class="flex justify-between text-sm pt-1 border-t border-cream-200 dark:border-forest-700">
          <span class="font-semibold text-forest-800 dark:text-cream-50">
            {t("checkout.shopTotal")}
          </span>
          <span class="font-bold text-forest-800 dark:text-cream-50">
            {formatPrice(props.shop.itemsSubtotal + props.shop.shippingCost)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShopOrderReview;
