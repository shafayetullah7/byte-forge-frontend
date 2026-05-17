import { A } from "@solidjs/router";
import { Show, For } from "solid-js";
import { useI18n } from "~/i18n";
import type { PublicPlantListItem } from "~/lib/api/types/public/plants.types";
import { LeafIcon, SunIcon, DropletIcon, CubeIcon } from "~/components/icons";
import { formatPrice, getInventoryLabel, getDifficultyLabel, getDifficultyColor, lightLabel, wateringLabel } from "./constants";

export function PlantCard(props: { plant: PublicPlantListItem }) {
  const { t } = useI18n();
  const plant = props.plant;
  const inStock = plant.inStock;

  return (
    <A
      href={`/plants/${plant.slug}`}
      class="group flex flex-col bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 overflow-hidden hover:shadow-lg hover:border-forest-300 dark:hover:border-forest-600 transition-all duration-300"
    >
      <div class="relative aspect-[4/3] bg-cream-100 dark:bg-forest-900/50 overflow-hidden">
        <Show when={plant.thumbnail} fallback={
          <div class="w-full h-full flex items-center justify-center">
            <LeafIcon class="w-12 h-12 text-gray-300 dark:text-gray-600" />
          </div>
        }>
          {(thumbnail) => (
            <img
              src={thumbnail().url} alt={plant.name}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </Show>

        <div class="absolute bottom-3 left-3">
          <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/95 dark:bg-forest-900/95 backdrop-blur-sm shadow-sm text-sm font-bold text-forest-800 dark:text-cream-50">
            {formatPrice(plant.price)}
          </span>
        </div>

        <div class="absolute top-3 left-3 flex flex-col gap-1.5">
          <Show when={!inStock}>
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-terracotta-500/90 backdrop-blur-sm text-xs font-semibold text-white">
              {t("public.plants.plantCard.outOfStock")}
            </span>
          </Show>
          <Show when={inStock && plant.inventoryCount <= 5}>
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-cream-500/90 backdrop-blur-sm text-xs font-semibold text-cream-900">
              {t("public.plants.plantCard.onlyLeft", { count: plant.inventoryCount })}
            </span>
          </Show>
        </div>

        <Show when={plant.careDifficulty}>
          {(difficulty) => (
            <div class="absolute top-3 right-3">
              <span class={`inline-flex items-center px-2.5 py-1 rounded-lg backdrop-blur-sm text-xs font-semibold ${getDifficultyLabel(difficulty(), t) ? getDifficultyColor(difficulty()) : ""}`}>
                {getDifficultyLabel(difficulty(), t)}
              </span>
            </div>
          )}
        </Show>
      </div>

      <div class="p-4">
        <div class="mb-2">
          <h3 class="font-semibold text-forest-800 dark:text-cream-50 group-hover:text-forest-600 dark:group-hover:text-forest-300 transition-colors">
            {plant.name}
          </h3>
          <Show when={plant.scientificName}>
            {(name) => (
              <p class="text-xs italic text-gray-400 dark:text-gray-500 mt-0.5 truncate">{name()}</p>
            )}
          </Show>
        </div>

        <Show when={plant.shop}>
          {(shop) => (
            <A
              href={`/shops/${shop().slug}`}
              class="inline-flex items-center gap-2 mb-3 px-2 py-1 rounded-lg hover:bg-cream-50 dark:hover:bg-forest-700/50 transition-colors group/shop"
            >
              <Show when={shop().logo}>
                {(logo) => (
                  <img
                    src={logo().url} alt={shop().name}
                    class="w-5 h-5 rounded-full object-cover ring-1 ring-gray-200 dark:ring-forest-600"
                  />
                )}
              </Show>
              <span class="text-xs text-gray-500 dark:text-gray-400 group-hover/shop:text-forest-600 dark:group-hover/shop:text-forest-300 transition-colors">
                {shop().name}
              </span>
            </A>
          )}
        </Show>

        <Show when={plant.tags.length > 0}>
          <div class="flex flex-wrap gap-1.5 mb-3">
            <For each={plant.tags.slice(0, 3)}>
              {(tag) => (
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-cream-100/80 text-cream-700 dark:bg-forest-700/60 dark:text-gray-300">
                  {tag.name || tag.slug}
                </span>
              )}
            </For>
          </div>
        </Show>

        <div class="flex items-center gap-3 text-xs">
          <Show when={plant.lightRequirement}>
            {(light) => (
              <span class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400" title={`${t("public.plants.plantCard.lightTitle")}: ${light()}`}>
                <SunIcon class="w-3.5 h-3.5 text-amber-500" />
                {lightLabel(light(), t)}
              </span>
            )}
          </Show>
          <Show when={plant.wateringFrequency}>
            {(freq) => (
              <span class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400" title={`${t("public.plants.plantCard.wateringTitle")}: ${freq()}`}>
                <DropletIcon class="w-3.5 h-3.5 text-blue-500" />
                {wateringLabel(freq(), t)}
              </span>
            )}
          </Show>
          <span class={`inline-flex items-center gap-1 ${
            inStock ? "text-forest-600 dark:text-forest-400" : "text-terracotta-600 dark:text-terracotta-400"
          }`}>
            <CubeIcon class="w-3.5 h-3.5" />
            {inStock ? getInventoryLabel(plant.inventoryCount, t) : t("public.plants.inventory.outOfStock")}
          </span>
        </div>
      </div>
    </A>
  );
}
