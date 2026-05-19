import type { Component } from "solid-js";
import { For, Show, createMemo } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import type { CartItem } from "~/lib/api/types/cart.types";
import { formatPrice } from "../../plants/constants";
import { LeafIcon, CheckIcon } from "~/components/icons";
import VariantRow from "./VariantRow";

const ProductGroup: Component<{
  slug: string;
  name: string;
  thumbnail: { id: string; url: string } | null;
  variants: CartItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: (slug: string) => void;
  onDeselectAll: (slug: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}> = (props) => {
  const { t } = useI18n();

  const allSelected = createMemo(
    () => props.variants.every((v) => props.selectedIds.has(v.id))
  );
  const someSelected = createMemo(
    () => props.variants.some((v) => props.selectedIds.has(v.id)) && !allSelected()
  );
  const groupLineTotal = createMemo(() =>
    props.variants.reduce((sum, v) => sum + parseFloat(v.lineTotal), 0)
  );

  const checkboxClasses = createMemo(() => {
    const base = "w-5 h-5 rounded-md border-2 bg-white dark:bg-forest-900 flex items-center justify-center transition-all duration-150";
    if (allSelected()) {
      return `${base} border-forest-600 dark:border-forest-500 bg-forest-600 dark:bg-forest-500`;
    }
    if (someSelected()) {
      return `${base} border-forest-600 dark:border-forest-500 bg-forest-100 dark:bg-forest-700`;
    }
    return `${base} border-cream-300 dark:border-forest-600`;
  });

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 overflow-hidden">
      {/* Product Header */}
      <div class="flex items-center gap-4 p-4 border-b border-cream-200 dark:border-forest-700 bg-cream-50/50 dark:bg-forest-900/30">
        {/* Select All Checkbox */}
        <label class="flex items-center gap-3 cursor-pointer flex-shrink-0">
          <div class="relative">
            <input
              type="checkbox"
              checked={allSelected()}
              onChange={() =>
                allSelected()
                  ? props.onDeselectAll(props.slug)
                  : props.onSelectAll(props.slug)
              }
              class="peer sr-only"
            />
            <div class={checkboxClasses() + " peer-hover:border-forest-400 dark:peer-hover:border-forest-500 peer-focus-visible:ring-2 peer-focus-visible:ring-forest-500/30 peer-focus-visible:ring-offset-1"}>
              <Show when={allSelected()} fallback={
                <Show when={someSelected()}>
                  <div class="w-2.5 h-0.5 bg-forest-600 dark:bg-forest-400 rounded-sm" />
                </Show>
              }>
                <CheckIcon class="w-3 h-3 text-white" />
              </Show>
            </div>
          </div>
        </label>

        {/* Product Thumbnail */}
        <A
          href={`/plants/${props.slug}`}
          class="w-14 h-14 flex-shrink-0 bg-cream-100 dark:bg-forest-900/50 rounded-lg overflow-hidden"
        >
          <Show
            when={props.thumbnail}
            fallback={
              <div class="w-full h-full flex items-center justify-center">
                <LeafIcon class="w-6 h-6 text-gray-300 dark:text-gray-600" />
              </div>
            }
          >
            {(thumb) => (
              <img
                src={thumb().url}
                alt={props.name}
                class="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </Show>
        </A>

        {/* Product Info */}
        <div class="flex-1 min-w-0">
          <A
            href={`/plants/${props.slug}`}
            class="font-semibold text-base text-forest-800 dark:text-cream-50 hover:text-forest-600 dark:hover:text-forest-300 transition-colors truncate block"
          >
            {props.name}
          </A>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {props.variants.length} {props.variants.length === 1 ? t("cart.variant") : t("cart.variants")}
          </p>
        </div>

        {/* Group Total */}
        <div class="text-right flex-shrink-0">
          <p class="font-bold text-base text-forest-800 dark:text-cream-50">
            {formatPrice(groupLineTotal())}
          </p>
        </div>
      </div>

      {/* Variant Rows */}
      <div class="p-3 space-y-2">
        <For each={props.variants}>
          {(variant) => (
            <VariantRow
              item={variant}
              isSelected={props.selectedIds.has(variant.id)}
              onToggle={props.onToggle}
              onUpdateQuantity={props.onUpdateQuantity}
              onRemove={props.onRemove}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default ProductGroup;
