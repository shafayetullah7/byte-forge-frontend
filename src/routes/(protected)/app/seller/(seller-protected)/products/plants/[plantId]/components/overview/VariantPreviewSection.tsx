import { For, Show } from "solid-js";
import { CubeIcon, ImageIcon } from "~/components/icons";
import Badge from "~/components/ui/Badge";
import { useI18n } from "~/i18n";
import type { GrowthStage, PlantDetail, PlantForm, Variegation } from "~/lib/api/types/seller.types";
import {
  formatPrice,
  getGrowthStageLabel,
  getInventoryStatus,
  getPlantFormLabel,
  getVariegationLabel,
} from "../../utils";
import { translationFor } from "../../utils/plant-translations";
import { SectionCard } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/SectionCard";

export function VariantPreviewSection(props: { plant: PlantDetail }) {
  const { t } = useI18n();
  const variants = () => props.plant.variants ?? [];

  return (
    <Show when={variants().length > 0}>
      <SectionCard
        title={`${t("seller.products.plantOverview.variants")} (${variants().length})`}
        icon={<CubeIcon class="w-4 h-4 text-gray-400" />}
        action={
          <a
            href={`/app/seller/products/plants/${props.plant.id}/variants`}
            class="text-xs text-forest-600 dark:text-forest-400 hover:underline"
          >
            {t("seller.products.plantOverview.viewAll")}
          </a>
        }
      >
        <div class="space-y-3">
          <For each={variants().slice(0, 2)}>
            {(variant) => {
              const inv = getInventoryStatus(
                variant.inventoryCount,
                t as (key: string, ...args: unknown[]) => string,
              );
              const titleEn =
                translationFor(variant.translations, "en")?.title
                ?? t("seller.products.plantOverview.variant", variant.id);
              const titleBn = translationFor(variant.translations, "bn")?.title;
              const attrs = variant.plantAttributes;

              return (
                <div class="border border-cream-200 dark:border-forest-700 rounded-lg p-4 hover:bg-cream-50 dark:hover:bg-forest-700/30 transition-colors">
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <p class="text-sm font-semibold text-forest-800 dark:text-cream-50">{titleEn}</p>
                      {titleBn && (
                        <p class="text-sm font-medium text-forest-600 dark:text-forest-400">{titleBn}</p>
                      )}
                      <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">{variant.sku ?? "—"}</p>
                    </div>
                    <Badge variant={inv.variant} class="text-xs">
                      {inv.label}
                    </Badge>
                  </div>
                  <div class="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{t("seller.products.plantOverview.price")}</p>
                      <p class="text-sm font-bold text-forest-800 dark:text-cream-50">{formatPrice(variant.price)}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{t("seller.products.plantOverview.stock")}</p>
                      <p class="text-sm font-bold text-forest-800 dark:text-cream-50">{variant.inventoryCount}</p>
                    </div>
                  </div>
                  <Show when={attrs}>
                    {(a) => (
                      <div class="flex flex-wrap gap-1.5 pt-2 border-t border-cream-200 dark:border-forest-700">
                        <span class="text-xs px-2 py-0.5 bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-300 rounded-full">
                          {getGrowthStageLabel(a().growthStage as GrowthStage)}
                        </span>
                        <span class="text-xs px-2 py-0.5 bg-cream-50 dark:bg-cream-900/30 text-cream-700 dark:text-cream-300 rounded-full">
                          {getPlantFormLabel(a().plantForm as PlantForm)}
                        </span>
                        <span class="text-xs px-2 py-0.5 bg-terracotta-50 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300 rounded-full">
                          {getVariegationLabel(a().variegation as Variegation)}
                        </span>
                        <Show when={variant.media.length > 0}>
                          <span class="text-xs px-2 py-0.5 bg-sage-50 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 rounded-full flex items-center gap-1">
                            <ImageIcon class="w-3 h-3" />
                            {variant.media.length}
                          </span>
                        </Show>
                      </div>
                    )}
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
      </SectionCard>
    </Show>
  );
}
