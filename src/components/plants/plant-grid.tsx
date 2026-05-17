import { For, Show, Suspense } from "solid-js";
import { useI18n } from "~/i18n";
import type { PublicPlantListItem } from "~/lib/api/types/public/plants.types";
import { LeafIcon } from "~/components/icons";
import { Button } from "~/components/ui";
import { PlantCard } from "../../routes/(app)/plants/plant-card";

const ITEMS_PER_PAGE = 12;

export function PlantGrid(props: {
  plants: () => PublicPlantListItem[];
  hasData: () => boolean;
  hasActiveFilters: () => boolean;
  clearFilters: () => void;
}) {
  const { t } = useI18n();

  return (
    <Suspense fallback={
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <For each={Array.from({ length: ITEMS_PER_PAGE })}>
          {() => (
            <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 overflow-hidden animate-pulse">
              <div class="aspect-[4/3] bg-cream-100 dark:bg-forest-900/50" />
              <div class="p-4 space-y-3">
                <div class="h-4 bg-cream-200 dark:bg-forest-700 rounded w-3/4" />
                <div class="h-3 bg-cream-100 dark:bg-forest-800 rounded w-1/2" />
                <div class="h-3 bg-cream-100 dark:bg-forest-800 rounded w-full" />
              </div>
            </div>
          )}
        </For>
      </div>
    }>
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
    </Suspense>
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
