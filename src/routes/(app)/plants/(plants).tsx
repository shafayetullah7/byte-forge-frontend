import { createSignal, createMemo, createEffect, Show, ErrorBoundary, onCleanup } from "solid-js";
import { A, createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import type { PublicPlantFilter } from "~/lib/api/types/public/plants.types";
import { getPublicPlants } from "~/lib/api/endpoints/public/plants.api";
import { getCategoryTree } from "~/lib/api/endpoints/public/categories.api";
import { getTags } from "~/lib/api/endpoints/public/tags.api";
import { LeafIcon, XIcon } from "~/components/icons";
import { Button } from "~/components/ui";
import { FilterSection } from "./filter-section";
import { FilterToolbar } from "~/components/plants/filter-toolbar";
import { ActiveFilters } from "~/components/plants/active-filters";
import { PlantGrid } from "~/components/plants/plant-grid";
import { Pagination } from "~/components/plants/pagination";

const ITEMS_PER_PAGE = 12;

export default function PlantsPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = createSignal("");
  const [debouncedSearch, setDebouncedSearch] = createSignal("");
  const [categoryId, setCategoryId] = createSignal("");
  const [selectedTagIds, setSelectedTagIds] = createSignal<Set<string>>(new Set());
  const [careDifficulty, setCareDifficulty] = createSignal("");
  const [lightRequirement, setLightRequirement] = createSignal("");
  const [wateringFrequency, setWateringFrequency] = createSignal("");
  const [humidityLevel, setHumidityLevel] = createSignal("");
  const [growthRate, setGrowthRate] = createSignal("");
  const [minPrice, setMinPrice] = createSignal("");
  const [maxPrice, setMaxPrice] = createSignal("");
  const [inStockOnly, setInStockOnly] = createSignal(false);
  const [sortBy, setSortBy] = createSignal("name");
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = createSignal(1);
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  let debounceTimer: ReturnType<typeof setTimeout>;
  createEffect(() => {
    const query = searchQuery();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setDebouncedSearch(query);
      setCurrentPage(1);
    }, 300);
    onCleanup(() => clearTimeout(debounceTimer));
  });

  const categoryTree = createAsync(() => getCategoryTree(), { deferStream: true });
  const tagGroups = createAsync(() => getTags(), { deferStream: true });

  const allTags = createMemo(() => {
    const groups = tagGroups();
    if (!groups || groups.length === 0) return [];
    const result: { id: string; name: string; groupId: string; groupName: string }[] = [];
    for (const group of groups) {
      for (const tag of group.tags) {
        result.push({ id: tag.id, name: tag.name, groupId: group.id, groupName: group.name });
      }
    }
    return result;
  });

  const filterParams = createMemo<PublicPlantFilter>(() => ({
    page: currentPage(),
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch() || undefined,
    categoryId: categoryId() || undefined,
    tagIds: selectedTagIds().size > 0 ? [...selectedTagIds()] : undefined,
    careDifficulty: (careDifficulty() || undefined) as PublicPlantFilter["careDifficulty"],
    lightRequirement: (lightRequirement() || undefined) as PublicPlantFilter["lightRequirement"],
    wateringFrequency: (wateringFrequency() || undefined) as PublicPlantFilter["wateringFrequency"],
    humidityLevel: (humidityLevel() || undefined) as PublicPlantFilter["humidityLevel"],
    growthRate: (growthRate() || undefined) as PublicPlantFilter["growthRate"],
    minPrice: minPrice() ? parseFloat(minPrice()) : undefined,
    maxPrice: maxPrice() ? parseFloat(maxPrice()) : undefined,
    inStockOnly: inStockOnly() || undefined,
    sortBy: sortBy() as PublicPlantFilter["sortBy"],
    sortOrder: sortOrder(),
  }));

  const plantsData = createAsync(
    () => getPublicPlants(filterParams()),
    { deferStream: true }
  );

  const [stablePlants, setStablePlants] = createSignal<Awaited<ReturnType<typeof getPublicPlants>> | undefined>(undefined);
  const [isRefetching, setIsRefetching] = createSignal(false);

  createEffect(() => {
    const d = plantsData();
    if (d !== undefined) {
      setStablePlants(d);
      setIsRefetching(false);
    } else if (stablePlants() !== undefined) {
      setIsRefetching(true);
    }
  });

  const plants = createMemo(() => stablePlants()?.data ?? []);
  const meta = createMemo(() => stablePlants()?.meta);
  const totalPages = createMemo(() => meta()?.pages ?? 1);
  const totalItems = createMemo(() => meta()?.total ?? 0);

  const hasActiveFilters = createMemo(() =>
    !!debouncedSearch() ||
    !!categoryId() ||
    selectedTagIds().size > 0 ||
    !!careDifficulty() ||
    !!lightRequirement() ||
    !!wateringFrequency() ||
    !!humidityLevel() ||
    !!growthRate() ||
    !!minPrice() ||
    !!maxPrice() ||
    inStockOnly()
  );

  const activeFilterCount = createMemo(() => {
    let count = 0;
    if (debouncedSearch()) count++;
    if (categoryId()) count++;
    if (selectedTagIds().size > 0) count++;
    if (careDifficulty()) count++;
    if (lightRequirement()) count++;
    if (wateringFrequency()) count++;
    if (humidityLevel()) count++;
    if (growthRate()) count++;
    if (minPrice()) count++;
    if (maxPrice()) count++;
    if (inStockOnly()) count++;
    return count;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setCategoryId("");
    setSelectedTagIds(new Set<string>());
    setCareDifficulty("");
    setLightRequirement("");
    setWateringFrequency("");
    setHumidityLevel("");
    setGrowthRate("");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setCurrentPage(1);
  };

  return (
    <ErrorBoundary
      fallback={(error) => (
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center p-6">
          <div class="bg-white dark:bg-forest-800 rounded-2xl border border-red-200 dark:border-red-800 p-8 max-w-md w-full text-center">
            <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <LeafIcon class="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
              {t("public.plants.error.title")}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {error?.message || t("public.plants.error.message")}
            </p>
            <Button onClick={() => window.location.reload()} variant="primary">
              {t("public.plants.error.retry")}
            </Button>
          </div>
        </div>
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
        <div class="relative">
          <Show when={sidebarOpen()}>
            <div
              class="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          </Show>

          <aside
            class={`w-64 bg-white dark:bg-forest-800 border-r border-cream-200 dark:border-forest-700 overflow-y-auto ${
              sidebarOpen() ? "fixed inset-y-0 left-0 z-50" : "hidden lg:block"
            } lg:fixed lg:top-16 lg:left-0 lg:z-10 lg:h-[calc(100vh-4rem)]`}
          >
            <div class="lg:hidden flex items-center justify-between p-4 border-b border-cream-200 dark:border-forest-700 sticky top-0 z-10 bg-white dark:bg-forest-800">
              <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50">{t("public.plants.toolbar.filters")}</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors"
              >
                <XIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <div class="p-4 lg:p-6">
              <FilterSection
                categories={categoryTree}
                selectedCategoryId={categoryId}
                setSelectedCategoryId={setCategoryId}
                tags={allTags}
                selectedTagIds={selectedTagIds}
                toggleTag={toggleTag}
                careDifficulty={careDifficulty}
                setCareDifficulty={setCareDifficulty}
                lightRequirement={lightRequirement}
                setLightRequirement={setLightRequirement}
                wateringFrequency={wateringFrequency}
                setWateringFrequency={setWateringFrequency}
                humidityLevel={humidityLevel}
                setHumidityLevel={setHumidityLevel}
                growthRate={growthRate}
                setGrowthRate={setGrowthRate}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </aside>

          <main class="lg:ml-64">
            <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <FilterToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                hasActiveFilters={hasActiveFilters}
                activeFilterCount={activeFilterCount}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />

              <div class="flex items-center justify-between mb-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {t("public.plants.results.showing")}{" "}
                  <span class="font-semibold text-forest-800 dark:text-cream-50">
                    {plants().length}
                  </span>{" "}
                  {t("public.plants.results.of")}{" "}
                  <span class="font-semibold text-forest-800 dark:text-cream-50">
                    {totalItems()}
                  </span>{" "}
                  {t("public.plants.results.plants")}
                </p>
                <Show when={hasActiveFilters()}>
                  <button
                    onClick={clearFilters}
                    class="inline-flex items-center gap-1.5 text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
                  >
                    <XIcon class="w-4 h-4" />
                    {t("public.plants.results.clearAll")}
                  </button>
                </Show>
              </div>

              <ActiveFilters
                debouncedSearch={debouncedSearch}
                setSearchQuery={setSearchQuery}
                setDebouncedSearch={setDebouncedSearch}
                categories={categoryTree}
                selectedCategoryId={categoryId}
                setSelectedCategoryId={setCategoryId}
                tags={allTags}
                selectedTagIds={selectedTagIds}
                toggleTag={toggleTag}
                careDifficulty={careDifficulty}
                setCareDifficulty={setCareDifficulty}
                lightRequirement={lightRequirement}
                setLightRequirement={setLightRequirement}
                wateringFrequency={wateringFrequency}
                setWateringFrequency={setWateringFrequency}
                humidityLevel={humidityLevel}
                setHumidityLevel={setHumidityLevel}
                growthRate={growthRate}
                setGrowthRate={setGrowthRate}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
              />

              <PlantGrid
                plants={plants}
                hasData={() => stablePlants() !== undefined}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
