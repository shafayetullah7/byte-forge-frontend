import { For, Show, type Component } from "solid-js";
import { useI18n } from "~/i18n";
import type { PublicPlantVariant } from "~/lib/api/types/public/plants.types";
import { LeafIcon } from "~/components/icons";
import { translateEnum } from "./variant-enums";

interface AttrRow {
  label: string;
  value: string;
}

const VariantDetail: Component<{
  variant: PublicPlantVariant;
}> = (props) => {
  const { t } = useI18n();

  const allAttrs = (): AttrRow[] => {
    const attrs = props.variant.plantAttributes;
    if (!attrs) return [];
    return [
      { label: t("public.plants.variant.growthStage"), value: translateEnum(t, "growthStage", attrs.growthStage) },
      { label: t("public.plants.variant.plantForm"), value: translateEnum(t, "plantForm", attrs.plantForm) },
      { label: t("public.plants.variant.variegation"), value: translateEnum(t, "variegation", attrs.variegation) },
      { label: t("public.plants.variant.leafDensity"), value: translateEnum(t, "leafDensity", attrs.leafDensity) },
      { label: t("public.plants.variant.stemCount"), value: attrs.stemCount ? String(attrs.stemCount) : "" },
      { label: t("public.plants.variant.currentHeight"), value: attrs.currentHeight || "" },
      { label: t("public.plants.variant.currentSpread"), value: attrs.currentSpread || "" },
      { label: t("public.plants.variant.propagationType"), value: translateEnum(t, "propagationType", attrs.propagationType) },
      { label: t("public.plants.variant.containerType"), value: translateEnum(t, "containerType", attrs.containerType) },
      { label: t("public.plants.variant.containerSize"), value: attrs.containerSize || "" },
      { label: t("public.plants.variant.bundleType"), value: attrs.bundleType || "" },
    ].filter((r) => r.value && r.value.trim() !== "");
  };

  return (
    <Show when={allAttrs().length > 0}>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 p-5">
        <div class="flex items-center gap-2 mb-4">
          <LeafIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />
          <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">
            {t("public.plants.variant.variantDetails")}
          </h4>
        </div>
        <div class="grid grid-cols-2 gap-x-6 gap-y-3">
          <For each={allAttrs()}>
            {(row) => (
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {row.label}
                </p>
                <p class="text-sm font-medium text-forest-800 dark:text-cream-50 mt-0.5">
                  {row.value}
                </p>
              </div>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

export default VariantDetail;
