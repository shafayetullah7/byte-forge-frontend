import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import type { PublicPlantListItem } from "~/lib/api/types/public/plants.types";
import { LeafIcon } from "~/components/icons";
import { Button } from "~/components/ui";
import { PlantCard } from "../../routes/(app)/plants/plant-card";

export function PlantGrid(props: {
  plants: () => PublicPlantListItem[];
  hasData: () => boolean;
  hasActiveFilters: () => boolean;
  isRefreshing: () => boolean;
  clearFilters: () => void;
}) {
  const { t } = useI18n();

  return (
    <div class="relative">
      <Show when={props.isRefreshing()}>
        <div class="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-2 bg-forest-50/90 dark:bg-forest-900/90 backdrop-blur-sm rounded-xl border border-forest-200 dark:border-forest-700 shadow-sm mb-4">
          <svg class="animate-spin w-4 h-4 mr-2 text-forest-600 dark:text-forest-400" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span class="text-sm font-medium text-forest-700 dark:text-forest-300">{t("public.plants.grid.refreshing")}</span>
        </div>
      </Show>
      <Show when={props.hasData()} fallback={
        <EmptyState loading />
      }>
        <Show when={props.plants().length > 0} fallback={
          <EmptyState
            filters={props.hasActiveFilters()}
            onClearFilters={props.clearFilters}
          />
        }>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <For each={props.plants()}>
              {(plant) => <PlantCard plant={plant} />}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}

function EmptyState(props: { loading?: boolean; filters?: boolean; onClearFilters?: () => void }) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 py-16 px-4 text-center">
      <div class="w-16 h-16 rounded-full bg-cream-100 dark:bg-forest-700 flex items-center justify-center mx-auto mb-4">
        <LeafIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
        {props.loading ? t("public.plants.grid.loading") : t("public.plants.grid.noPlants")}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {props.loading
          ? t("public.plants.grid.loadingDesc")
          : props.filters
            ? t("public.plants.grid.noPlantsFilters")
            : t("public.plants.grid.noPlantsEmpty")}
      </p>
      <Show when={props.filters}>
        <Button onClick={props.onClearFilters!} variant="secondary">
          {t("public.plants.grid.clearAllFilters")}
        </Button>
      </Show>
    </div>
  );
}
