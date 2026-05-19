import { Show, type Component } from "solid-js";
import { useI18n } from "~/i18n";
import type { PublicPlantVariant } from "~/lib/api/types/public/plants.types";
import { formatPrice } from "../../constants";

const VariantCard: Component<{
  variant: PublicPlantVariant;
  isSelected: boolean;
  onSelect: () => void;
}> = (props) => {
  const { t } = useI18n();
  const attrs = props.variant.plantAttributes;

  const stockLabel = () => {
    if (!props.variant.inStock) return t("public.plants.inventory.outOfStock");
    if (props.variant.inventoryCount <= 5)
      return t("public.plants.inventory.onlyLeft", { count: props.variant.inventoryCount });
    return t("public.plants.inventory.inStockShort");
  };

  const stockColor = () => {
    if (!props.variant.inStock) return "text-terracotta-600 dark:text-terracotta-400";
    if (props.variant.inventoryCount <= 5) return "text-cream-600 dark:text-cream-400";
    return "text-forest-600 dark:text-forest-400";
  };

  return (
    <button
      onClick={props.onSelect}
      class={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        props.isSelected
          ? "border-forest-500 dark:border-forest-400 bg-forest-50 dark:bg-forest-900/30 shadow-md"
          : "border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 hover:border-forest-300 dark:hover:border-forest-600"
      }`}
      disabled={!props.variant.inStock}
    >
      <div class="flex items-start justify-between mb-2">
        <div>
          <p class="font-semibold text-forest-800 dark:text-cream-50">{props.variant.title}</p>
          {props.variant.sku && (
            <p class="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">{props.variant.sku}</p>
          )}
        </div>
        <p class="text-lg font-bold text-forest-800 dark:text-cream-50">{formatPrice(props.variant.price)}</p>
      </div>

      <Show when={attrs}>
        {(a) => (
          <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <Show when={a().growthStage}>
              <span class="text-xs px-2 py-0.5 bg-cream-100 dark:bg-forest-700/60 text-cream-700 dark:text-gray-300 rounded-full">
                {a().growthStage}
              </span>
            </Show>
            <Show when={a().leafDensity}>
              <span class="text-xs px-2 py-0.5 bg-cream-100 dark:bg-forest-700/60 text-cream-700 dark:text-gray-300 rounded-full">
                {a().leafDensity}
              </span>
            </Show>
            <Show when={a().currentHeight}>
              <span class="text-xs px-2 py-0.5 bg-cream-100 dark:bg-forest-700/60 text-cream-700 dark:text-gray-300 rounded-full">
                {a().currentHeight}
              </span>
            </Show>
          </div>
        )}
      </Show>

      <div class="mt-2">
        <span class={`text-xs font-medium ${stockColor()}`}>
          {stockLabel()}
        </span>
      </div>
    </button>
  );
};

export default VariantCard;
