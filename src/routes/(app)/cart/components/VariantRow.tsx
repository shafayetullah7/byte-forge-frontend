import type { Component } from "solid-js";
import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import type { CartItem } from "~/lib/api/types/cart.types";
import { formatPrice } from "../../plants/constants";
import { toaster } from "~/components/ui/Toast";
import { LeafIcon, TrashIcon, CheckIcon } from "~/components/icons";
import { getStockStatusLabel } from "../cart.helpers";

const VariantRow: Component<{
  item: CartItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}> = (props) => {
  const { t } = useI18n();
  const stockInfo = getStockStatusLabel(
    props.item.stockStatus,
    props.item.availableQuantity,
    t,
  );

  return (
    <div class="flex items-start gap-4 p-4 bg-cream-50 dark:bg-forest-900/50 rounded-xl border border-cream-200 dark:border-forest-700/50">
      {/* Checkbox */}
      <div class="flex items-center justify-center pt-0.5">
        <label class="flex items-center gap-3 cursor-pointer">
          <div class="relative">
            <input
              type="checkbox"
              checked={props.isSelected}
              onChange={() => props.onToggle(props.item.id)}
              class="peer sr-only"
            />
            <div class="w-5 h-5 rounded-md border-2 border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-900 flex items-center justify-center transition-all duration-150 peer-hover:border-forest-400 dark:peer-hover:border-forest-500 peer-checked:border-forest-600 dark:peer-checked:border-forest-500 peer-checked:bg-forest-600 dark:peer-checked:bg-forest-500 peer-focus-visible:ring-2 peer-focus-visible:ring-forest-500/30 peer-focus-visible:ring-offset-1">
              <Show when={props.isSelected}>
                <CheckIcon class="w-3 h-3 text-white" />
              </Show>
            </div>
          </div>
        </label>
      </div>

      {/* Image */}
      <A
        href={`/plants/${props.item.productSlug}`}
        class="w-20 h-20 flex-shrink-0 bg-cream-100 dark:bg-forest-900/50 rounded-lg overflow-hidden"
      >
        <Show
          when={props.item.thumbnail}
          fallback={
            <div class="w-full h-full flex items-center justify-center">
              <LeafIcon class="w-6 h-6 text-gray-300 dark:text-gray-600" />
            </div>
          }
        >
          {(thumb) => (
            <img
              src={thumb().url}
              alt={props.item.productName}
              class="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </Show>
      </A>

      {/* Details */}
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-3 mb-1">
          <div class="min-w-0">
            <p class="text-sm font-medium text-forest-800 dark:text-cream-50">
              {props.item.variantTitle || props.item.sku || "Standard"}
            </p>
            <Show when={props.item.sku}>
              {(s) => (
                <p class="text-xs font-mono text-gray-400 dark:text-gray-500">
                  SKU: {s()}
                </p>
              )}
            </Show>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="font-semibold text-sm text-forest-800 dark:text-cream-50">
              {formatPrice(props.item.lineTotal)}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500">
              {formatPrice(props.item.price)} {t("cart.each")}
            </p>
          </div>
        </div>

        {/* Stock Status + Actions */}
        <div class="flex items-center justify-between">
          <span class={`inline-flex items-center gap-1.5 text-xs font-medium ${stockInfo.color}`}>
            <span
              class={`w-1.5 h-1.5 rounded-full ${
                props.item.stockStatus === "in_stock"
                  ? "bg-forest-500"
                  : props.item.stockStatus === "low_stock"
                  ? "bg-cream-500"
                  : "bg-terracotta-500"
              }`}
            />
            {stockInfo.label}
          </span>

          <div class="flex items-center gap-2">
            {/* Quantity Controls */}
            <div class="flex items-center border border-cream-200 dark:border-forest-700 rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  props.onUpdateQuantity(
                    props.item.id,
                    Math.max(1, props.item.quantity - 1),
                  )
                }
                disabled={props.item.quantity <= 1}
                class="px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span class="px-2.5 py-1 text-xs font-semibold text-forest-800 dark:text-cream-50 min-w-[2rem] text-center border-x border-cream-200 dark:border-forest-700">
                {props.item.quantity}
              </span>
              <button
                onClick={() =>
                  props.onUpdateQuantity(
                    props.item.id,
                    Math.min(props.item.maxQuantity, props.item.quantity + 1),
                  )
                }
                disabled={props.item.quantity >= (props.item.maxQuantity || 999)}
                class="px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => {
                props.onRemove(props.item.id);
                toaster.success(t("cart.itemRemoved"));
              }}
              class="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-colors"
              aria-label={t("cart.removeItem")}
            >
              <TrashIcon class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantRow;
