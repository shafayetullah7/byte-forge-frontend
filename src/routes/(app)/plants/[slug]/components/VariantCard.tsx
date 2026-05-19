import { For, Show, createMemo, type Component } from "solid-js";
import { useI18n } from "~/i18n";
import type { PublicPlantVariant } from "~/lib/api/types/public/plants.types";
import { formatPrice } from "../../constants";
import { translateEnum } from "./variant-enums";

interface AttrPill {
  label: string;
  value: string;
  color: string;
}

const VARIETY_COLORS = [
  "bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-300",
  "bg-cream-50 dark:bg-cream-900/30 text-cream-700 dark:text-cream-300",
  "bg-sage-50 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300",
  "bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
  "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
];

function getAttrColor(index: number): string {
  return VARIETY_COLORS[index % VARIETY_COLORS.length];
}

const VariantCard: Component<{
  variant: PublicPlantVariant;
  isSelected: boolean;
  onSelect: () => void;
}> = (props) => {
  const { t } = useI18n();
  const attrs = props.variant.plantAttributes;

  const stockLabel = createMemo(() => {
    if (!props.variant.inStock) return t("public.plants.inventory.outOfStock");
    if (props.variant.inventoryCount <= 5)
      return t("public.plants.inventory.onlyLeft", { count: props.variant.inventoryCount });
    return t("public.plants.inventory.inStockShort");
  });

  const stockColor = createMemo(() => {
    if (!props.variant.inStock) return "text-terracotta-600 dark:text-terracotta-400";
    if (props.variant.inventoryCount <= 5) return "text-cream-600 dark:text-cream-400";
    return "text-forest-600 dark:text-forest-400";
  });

  const primaryPills = createMemo<AttrPill[]>(() => {
    if (!attrs) return [];
    return [
      { label: t("public.plants.variant.growthStage"), value: translateEnum(t, "growthStage", attrs.growthStage), color: getAttrColor(0) },
      { label: t("public.plants.variant.currentHeight"), value: attrs.currentHeight || "", color: getAttrColor(1) },
      { label: t("public.plants.variant.variegation"), value: translateEnum(t, "variegation", attrs.variegation), color: getAttrColor(2) },
    ].filter((r) => r.value && r.value.trim() !== "");
  });

  return (
    <button
      onClick={props.onSelect}
      class={`w-full text-left rounded-xl border-2 transition-all ${
        props.isSelected
          ? "border-forest-500 dark:border-forest-400 bg-forest-50 dark:bg-forest-900/30 shadow-md"
          : "border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 hover:border-forest-300 dark:hover:border-forest-600"
      }`}
      disabled={!props.variant.inStock}
    >
      <div class="p-4">
        <div class="flex items-start justify-between mb-2">
          <div>
            <p class="font-semibold text-forest-800 dark:text-cream-50">{props.variant.title}</p>
            {props.variant.sku && (
              <p class="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">{props.variant.sku}</p>
            )}
          </div>
          <p class="text-lg font-bold text-forest-800 dark:text-cream-50">{formatPrice(props.variant.price)}</p>
        </div>

        <Show when={primaryPills().length > 0}>
          <div class="flex flex-wrap gap-1.5 pt-2 border-t border-cream-100 dark:border-forest-700/50">
            <For each={primaryPills()}>
              {(pill) => (
                <span class={`text-[10px] font-medium px-2 py-0.5 rounded-full ${pill.color}`}>
                  {pill.value}
                </span>
              )}
            </For>
          </div>
        </Show>

        <div class="mt-2">
          <span class={`${stockColor()}`}>
            {stockLabel()}
          </span>
        </div>
      </div>
    </button>
  );
};

export default VariantCard;
