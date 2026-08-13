import { createSignal, createMemo, For, Show, Suspense, createEffect } from "solid-js";
import { A, createAsync, useNavigate } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { getPlants } from "~/lib/api/endpoints/seller/plants.api";
import { getCategoryTree, getTags } from "~/lib/api/endpoints/public";
import type { PlantFilter, PlantListResponse, PlantStatus } from "~/lib/api/types/seller.types";
import { PRODUCT_STATUS } from "~/lib/api/types/seller.types";
import type { CategoryTree } from "~/lib/api/endpoints/public/categories.api";
import { FilterIcon, ChevronLeftIcon, ChevronRightIcon, ArchiveIcon, SortIcon, PackageIcon, PlusIcon, XIcon, MagnifyingGlassIcon, FolderIcon, DollarSignIcon, CubeIcon, ClockIcon, CheckCircleIcon, Squares2x2Icon, TagIcon } from "~/components/icons";
import Badge from "~/components/ui/Badge";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { TagMultiSelect, type TagGroupOption } from "~/components/ui/TagMultiSelect";
import { CategorySearchSelect, type CategoryOption } from "~/components/seller/CategorySearchSelect";
import {
  SORT_OPTIONS,
  getPageNumbers,
  getInventoryLabel,
  getStatusVariant,
  formatPrice,
  formatDateTime,
} from "../components/utils";
import { getStatusLabel } from "./[plantId]/utils";

// ========================
// Filter Chip
// ========================

function FilterChip(props: { label: string; removeLabel: string; onRemove: () => void }) {
  return (
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 border border-forest-200 dark:border-forest-800">
      {props.label}
      <button
        type="button"
        onClick={props.onRemove}
        aria-label={props.removeLabel}
        class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-800 transition-colors"
      >
        <XIcon class="w-3 h-3" />
      </button>
    </span>
  );
}

function statusFilterLabel(status: PlantStatus, t: (key: string) => string): string {
  return getStatusLabel(status, t);
}

// ========================
// Main Page
// ========================

export default function PlantsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal("");
  const [categoryFilter, setCategoryFilter] = createSignal("");
  const [selectedTagIds, setSelectedTagIds] = createSignal<string[]>([]);
  const [sortBy, setSortBy] = createSignal("createdAt");
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = createSignal(false);
  const [showSortPanel, setShowSortPanel] = createSignal(false);

  const [currentPage, setCurrentPage] = createSignal(1);
  const ITEMS_PER_PAGE = 10;

  createEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-sort-panel]")) {
        setShowSortPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  const toggleTag = (tagId: string) => {
    const current = selectedTagIds();
    if (current.includes(tagId)) {
      setSelectedTagIds(current.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...current, tagId]);
    }
    setCurrentPage(1);
  };

  const removeTag = (tagId: string) => {
    setSelectedTagIds(selectedTagIds().filter((id) => id !== tagId));
    setCurrentPage(1);
  };

  const filterParams = createMemo<PlantFilter>(() => ({
    page: currentPage(),
    limit: ITEMS_PER_PAGE,
    search: searchQuery() || undefined,
    status: (statusFilter() || undefined) as PlantFilter["status"],
    categoryId: categoryFilter() || undefined,
    tagIds: selectedTagIds().length > 0 ? selectedTagIds() : undefined,
    sortBy: sortBy() as PlantFilter["sortBy"],
    sortOrder: sortOrder(),
  }));

  const apiData = createAsync(
    () => getPlants(filterParams()),
    { deferStream: true }
  );

  const statsData = createAsync(
    () => getPlants({ limit: 100 }),
    { deferStream: true }
  );

  const categoryTreeData = createAsync(() => getCategoryTree(), { deferStream: true });
  const tagGroupsData = createAsync(() => getTags(), { deferStream: true });

  // Stable signal pattern - keeps showing old data during refetch (prevents blinking)
  const [stablePlants, setStablePlants] = createSignal<PlantListResponse | undefined>(undefined);
  const [isRefetching, setIsRefetching] = createSignal(false);

  createEffect(() => {
    const d = apiData();
    if (d !== undefined) {
      setStablePlants(d);
      setIsRefetching(false);
    } else if (stablePlants() !== undefined) {
      // apiData is undefined but we have stable data → refetching
      setIsRefetching(true);
    }
  });

  const flatCategories = createMemo<CategoryOption[]>(() => {
    const tree = categoryTreeData();
    if (!tree) return [];
    const flat: CategoryOption[] = [];
    const flatten = (cats: CategoryTree[]) => {
      for (const cat of cats) {
        flat.push({
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          parentId: cat.parentId,
          childrenCount: cat.childrenCount,
        });
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children);
        }
      }
    };
    flatten(tree);
    return flat;
  });

  const tagGroupOptions = createMemo<TagGroupOption[]>(() => {
    const groups = tagGroupsData();
    if (!groups) return [];
    return groups.map((g) => ({
      id: g.id,
      slug: g.slug,
      name: g.name,
      tags: g.tags.map((t) => ({ id: t.id, slug: t.slug, name: t.name })),
    }));
  });

  const tagIdToName = createMemo<Record<string, string>>(() => {
    const groups = tagGroupsData();
    if (!groups) return {};
    const map: Record<string, string> = {};
    for (const group of groups) {
      for (const tag of group.tags) {
        map[tag.id] = tag.name;
      }
    }
    return map;
  });

  const products = createMemo(() => stablePlants()?.data ?? []);
  const meta = createMemo(() => stablePlants()?.meta);

  const totalPages = createMemo(() => meta()?.pages ?? 1);
  const totalItems = createMemo(() => meta()?.total ?? 0);

  const stats = createMemo(() => {
    const allItems = statsData()?.data ?? [];
    return {
      total: allItems.length,
      active: allItems.filter((p) => p.status === PRODUCT_STATUS.ACTIVE).length,
      draft: allItems.filter((p) => p.status === PRODUCT_STATUS.DRAFT).length,
      archived: allItems.filter((p) => p.status === PRODUCT_STATUS.ARCHIVED).length,
    };
  });

  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setCategoryFilter("");
    setSelectedTagIds([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = createMemo(
    () => searchQuery() || statusFilter() || categoryFilter() || selectedTagIds().length > 0
  );

  const activeFilterCount = createMemo(() => {
    let count = 0;
    if (searchQuery()) count++;
    if (statusFilter()) count++;
    if (categoryFilter()) count++;
    count += selectedTagIds().length;
    return count;
  });

  const sortLabel = createMemo(() => {
    const option = SORT_OPTIONS.find((o) => o.value === sortBy());
    return option
      ? `${t(option.labelKey)} (${sortOrder() === "asc" ? t("seller.products.sort.asc") : t("seller.products.sort.desc")})`
      : "";
  });

  const statusFilterLabelText = createMemo(() => {
    const status = statusFilter();
    if (!status) return "";
    return statusFilterLabel(status as PlantStatus, t);
  });

  return (
    <div class="mx-auto max-w-[1400px]">
      {/* Page Header */}
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
              <PackageIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                {t("seller.products.types.plants")}
              </h1>
              <p class="text-base text-gray-600 dark:text-gray-400">
                {t("seller.products.managePlantProducts")}
              </p>
            </div>
          </div>
          <A
            href="/app/seller/products/plants/new"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
          >
            <PlusIcon class="w-5 h-5" />
            {t("seller.products.addPlant")}
          </A>
        </div>
      </div>

      {/* Stats Cards - isolated Suspense so stats never blink during filter refetch */}
      <div class="mb-6">
        <Suspense fallback={
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div class="h-24 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 animate-pulse" />
            <div class="h-24 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 animate-pulse" />
            <div class="h-24 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 animate-pulse" />
            <div class="h-24 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 animate-pulse" />
          </div>
        }>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div class="bg-white dark:bg-forest-800 rounded-xl p-5 sm:p-6 border border-cream-200 dark:border-forest-700 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{t("common.total")}</p>
                  <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">{stats().total}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-cream-100 dark:bg-cream-900/40 flex items-center justify-center">
                  <Squares2x2Icon class="w-5 h-5 text-cream-600 dark:text-cream-400" />
                </div>
              </div>
            </div>
            <div class="bg-white dark:bg-forest-800 rounded-xl p-5 sm:p-6 border border-cream-200 dark:border-forest-700 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{t("seller.products.stats.active")}</p>
                  <p class="text-2xl font-bold text-forest-600 dark:text-forest-400 mt-1">{stats().active}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center">
                  <CheckCircleIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
                </div>
              </div>
            </div>
            <div class="bg-white dark:bg-forest-800 rounded-xl p-5 sm:p-6 border border-cream-200 dark:border-forest-700 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{t("seller.products.stats.draft")}</p>
                  <p class="text-2xl font-bold text-cream-600 dark:text-cream-400 mt-1">{stats().draft}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-cream-100 dark:bg-cream-900/40 flex items-center justify-center">
                  <FolderIcon class="w-5 h-5 text-cream-600 dark:text-cream-400" />
                </div>
              </div>
            </div>
            <div class="bg-white dark:bg-forest-800 rounded-xl p-5 sm:p-6 border border-cream-200 dark:border-forest-700 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{t("seller.products.stats.archived")}</p>
                  <p class="text-2xl font-bold text-terracotta-600 dark:text-terracotta-400 mt-1">{stats().archived}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-terracotta-100 dark:bg-terracotta-900/40 flex items-center justify-center">
                  <ArchiveIcon class="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      </div>

      {/* Search & Filter Bar */}
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm mb-6">
        <div class="p-4">
          <div class="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div class="flex-1 relative">
              <input
                type="text"
                placeholder={t("seller.products.searchPlaceholder")}
                value={searchQuery()}
                onInput={(e) => handleFilterChange(setSearchQuery, e.currentTarget.value)}
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 placeholder-gray-400 dark:placeholder-gray-500 transition-standard focus-ring-flat"
              />
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Quick Status Filter */}
            <FilterSelect
              options={[
                { value: "", label: t("seller.products.filters.allStatus") },
                { value: PRODUCT_STATUS.ACTIVE, label: t("seller.products.filters.statusActive"), dotColor: "bg-forest-500" },
                { value: PRODUCT_STATUS.DRAFT, label: t("seller.products.filters.statusDraft"), dotColor: "bg-cream-500" },
                { value: PRODUCT_STATUS.ARCHIVED, label: t("seller.products.filters.statusArchived"), dotColor: "bg-terracotta-500" },
              ]}
              value={statusFilter()}
              onChange={(val) => handleFilterChange(setStatusFilter, val)}
            />

            {/* Sort Button (Desktop) */}
            <div data-sort-panel class="hidden lg:block relative">
              <button
                onClick={() => setShowSortPanel(!showSortPanel())}
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 transition-standard focus-ring-flat min-w-[200px]"
              >
                <SortIcon class="w-4 h-4 text-gray-400" />
                <span class="text-sm truncate">{sortLabel()}</span>
              </button>

              {/* Sort Dropdown */}
              <Show when={showSortPanel()}>
                <div class="absolute right-0 mt-2 w-64 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-lg z-50 overflow-hidden">
                  <div class="p-3 border-b border-cream-200 dark:border-forest-700">
                    <p class="text-sm font-semibold text-forest-800 dark:text-cream-100">{t("seller.products.sort.sortBy")}</p>
                  </div>
                  <div class="p-2">
                    <For each={SORT_OPTIONS}>
                      {(option) => {
                        const optionIcon = option.value === "createdAt" || option.value === "updatedAt"
                          ? <ClockIcon class="w-4 h-4 text-gray-400" />
                          : option.value === "name"
                            ? <PackageIcon class="w-4 h-4 text-gray-400" />
                            : option.value === "price"
                              ? <DollarSignIcon class="w-4 h-4 text-gray-400" />
                              : <CubeIcon class="w-4 h-4 text-gray-400" />;
                        return (
                          <button
                            onClick={() => {
                              if (sortBy() === option.value) {
                                setSortOrder(sortOrder() === "asc" ? "desc" : "asc");
                              } else {
                                setSortBy(option.value);
                                setSortOrder("desc");
                              }
                              setShowSortPanel(false);
                            }}
                            class={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                              sortBy() === option.value
                                ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 font-medium"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-700"
                            }`}
                          >
                            <span class="flex items-center gap-2">
                              {optionIcon}
                              <span>{t(option.labelKey)}</span>
                            </span>
                            {sortBy() === option.value && (
                              <span class="text-xs">
                                {sortOrder() === "asc" ? t("seller.products.sort.asc") : t("seller.products.sort.desc")}
                              </span>
                            )}
                          </button>
                        );
                      }}
                    </For>
                  </div>
                  <div class="p-3 border-t border-cream-200 dark:border-forest-700">
                    <button
                      onClick={() => {
                        setSortBy("createdAt");
                        setSortOrder("desc");
                        setShowSortPanel(false);
                      }}
                      class="w-full text-center text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
                    >
                      {t("seller.products.sort.resetToDefault")}
                    </button>
                  </div>
                </div>
              </Show>
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters())}
              class="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:border-forest-500 dark:hover:border-forest-400 transition-standard"
            >
              <FilterIcon class="w-5 h-5" />
              {t("seller.products.filters.button")}
              <Show when={hasActiveFilters()}>
                <span class="w-5 h-5 rounded-full bg-forest-500 text-white text-xs flex items-center justify-center font-bold">
                  {activeFilterCount()}
                </span>
              </Show>
            </button>
          </div>

          {/* Advanced Filters Panel */}
          <Show when={showFilters()}>
            <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("seller.products.filters.category")}
                  </label>
                  <CategorySearchSelect
                    value={categoryFilter()}
                    onChange={(val) => handleFilterChange(setCategoryFilter, val)}
                    categories={flatCategories()}
                  />
                </div>

                {/* Tag Multi-Select */}
                <div data-tag-dropdown>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("seller.products.filters.tags")}
                  </label>
                  <TagMultiSelect
                    selectedTags={selectedTagIds()}
                    onToggle={toggleTag}
                    groups={tagGroupOptions()}
                  />
                </div>

                {/* Sort (Mobile) */}
                <div class="lg:hidden">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("seller.products.sort.sortBy")}
                  </label>
                  <div class="space-y-2">
                    <select
                      value={sortBy()}
                      onChange={(e) => {
                        setSortBy(e.currentTarget.value);
                        setSortOrder("desc");
                      }}
                      class="w-full px-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 transition-standard focus-ring-flat"
                    >
                      <For each={SORT_OPTIONS}>
                        {(opt) => (
                          <option value={opt.value}>{t(opt.labelKey)}</option>
                        )}
                      </For>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder() === "asc" ? "desc" : "asc")}
                      class="w-full px-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 text-sm font-medium transition-standard"
                    >
                      {t("seller.products.sort.orderLabel", sortOrder() === "asc")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Show>

          {/* Category & Tag Filters (Desktop) */}
          <div class="hidden lg:block mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("seller.products.filters.category")}
                </label>
                <CategorySearchSelect
                  value={categoryFilter()}
                  onChange={(val) => handleFilterChange(setCategoryFilter, val)}
                  categories={flatCategories()}
                />
              </div>
              <div data-tag-dropdown>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("seller.products.filters.tags")}
                </label>
                <TagMultiSelect
                  selectedTags={selectedTagIds()}
                  onToggle={toggleTag}
                  groups={tagGroupOptions()}
                />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <Show when={hasActiveFilters()}>
            <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FilterIcon class="w-4 h-4 text-gray-400" />
                  {t("seller.products.activeFilters")} ({activeFilterCount()})
                </p>
                <button
                  onClick={clearFilters}
                  class="text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
                >
                  {t("seller.products.clearAll")}
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <Show when={searchQuery()}>
                  <FilterChip
                    label={t("seller.products.filterLabels.search", searchQuery())}
                    removeLabel={t("seller.products.filters.removeFilter", t("seller.products.filterLabels.search", searchQuery()))}
                    onRemove={() => handleFilterChange(setSearchQuery, "")}
                  />
                </Show>
                <Show when={statusFilter()}>
                  <FilterChip
                    label={t("seller.products.filterLabels.status", statusFilterLabelText())}
                    removeLabel={t("seller.products.filters.removeFilter", t("seller.products.filterLabels.status", statusFilterLabelText()))}
                    onRemove={() => handleFilterChange(setStatusFilter, "")}
                  />
                </Show>
                <Show when={categoryFilter()}>
                  <FilterChip
                    label={t(
                      "seller.products.filterLabels.category",
                      flatCategories().find((c) => c.id === categoryFilter())?.name ?? "",
                    )}
                    removeLabel={t(
                      "seller.products.filters.removeFilter",
                      t(
                        "seller.products.filterLabels.category",
                        flatCategories().find((c) => c.id === categoryFilter())?.name ?? "",
                      ),
                    )}
                    onRemove={() => handleFilterChange(setCategoryFilter, "")}
                  />
                </Show>
                <For each={selectedTagIds()}>
                  {(tagId) => (
                    <FilterChip
                      label={tagIdToName()[tagId] || tagId}
                      removeLabel={t("seller.products.filters.removeFilter", tagIdToName()[tagId] || tagId)}
                      onRemove={() => removeTag(tagId)}
                    />
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </div>

      {/* Results Count */}
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {t("seller.products.plantsResultsCount", products().length, totalItems())}
        </p>
        <Show when={hasActiveFilters()}>
          <button
            onClick={clearFilters}
            class="inline-flex items-center gap-1.5 text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
          >
            <XIcon class="w-4 h-4" />
            {t("seller.products.clearAllFilters")}
          </button>
        </Show>
      </div>

      {/* Products Table / Cards - with loading overlay during refetch */}
      <Show
        when={stablePlants()}
        fallback={
          <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 py-12 px-4 text-center shadow-sm">
            <PackageIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
              {t("seller.products.loadingPlants")}
            </h3>
            <p class="text-gray-500 dark:text-gray-400">{t("seller.products.loadingPlantsDescription")}</p>
          </div>
        }
      >
        <div class="relative">
          <Show
            when={products().length > 0}
            fallback={
              <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 py-12 px-4 text-center shadow-sm">
                <PackageIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
                  {t("seller.products.noPlantsFound")}
                </h3>
                <p class="text-gray-500 dark:text-gray-400 mb-6">
                  {hasActiveFilters()
                    ? t("seller.products.noProductsAdjustFilters")
                    : t("seller.products.startSellingPlants")}
                </p>
                <Show
                  when={!hasActiveFilters()}
                  fallback={
                    <button
                      onClick={clearFilters}
                      class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
                    >
                      {t("seller.products.clearFilters")}
                    </button>
                  }
                >
                  <A
                    href="/app/seller/products/plants/new"
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
                  >
                    <PlusIcon class="w-5 h-5" />
                    {t("seller.products.addPlant")}
                  </A>
                </Show>
              </div>
            }
          >
            {/* Desktop Table */}
            <div class="hidden lg:block bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-cream-200 dark:border-forest-700 bg-cream-50 dark:bg-forest-900/50">
                    <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div class="flex items-center gap-2">
                        <PackageIcon class="w-4 h-4 text-gray-400" />
                        {t("seller.products.tableHeaders.product")}
                      </div>
                    </th>
                    <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div class="flex items-center gap-2">
                        <FolderIcon class="w-4 h-4 text-gray-400" />
                        {t("seller.products.tableHeaders.category")}
                      </div>
                    </th>
                    <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div class="flex items-center gap-2">
                        <TagIcon class="w-4 h-4 text-gray-400" />
                        {t("seller.products.tableHeaders.tags")}
                      </div>
                    </th>
                    <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div class="flex items-center gap-2">
                        <DollarSignIcon class="w-4 h-4 text-gray-400" />
                        {t("seller.products.tableHeaders.price")}
                      </div>
                    </th>
                    <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div class="flex items-center gap-2">
                        <CubeIcon class="w-4 h-4 text-gray-400" />
                        {t("seller.products.tableHeaders.inventory")}
                      </div>
                    </th>
                    <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t("seller.products.tableHeaders.status")}</th>
                    <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div class="flex items-center gap-2">
                        <ClockIcon class="w-4 h-4 text-gray-400" />
                        {t("seller.products.tableHeaders.updated")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={products()}>
                    {(product) => {
                      const inventory = getInventoryLabel(product.inventoryCount, t);
                      return (
                        <tr
                          class="border-b border-cream-100 dark:border-forest-700/50 hover:bg-cream-50 dark:hover:bg-forest-900/30 transition-colors cursor-pointer"
                          onClick={() => navigate(`/app/seller/products/plants/${product.id}`)}
                        >
                          <td class="px-4 py-3">
                            <div>
                              <p class="font-semibold text-forest-800 dark:text-cream-50">
                                {product.name}
                              </p>
                              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                {product.shortDescription}
                              </p>
                            </div>
                          </td>
                          <td class="px-4 py-3">
                            <Show
                              when={product.category}
                              fallback={<span class="text-gray-400 dark:text-gray-500 text-sm">—</span>}
                            >
                              <span class="text-sm text-gray-700 dark:text-gray-300">
                                {product.category!.name}
                              </span>
                            </Show>
                          </td>
                          <td class="px-4 py-3">
                            <div class="flex flex-wrap gap-1 max-w-[200px]">
                              <For each={product.tags.slice(0, 3)}>
                                {(tag) => (
                                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300">
                                    {tag.name}
                                  </span>
                                )}
                              </For>
                              <Show when={product.tags.length > 3}>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-100 text-cream-700 dark:bg-forest-700 dark:text-gray-400">
                                  +{product.tags.length - 3}
                                </span>
                              </Show>
                            </div>
                          </td>
                          <td class="px-4 py-3">
                            <span class="font-semibold text-forest-800 dark:text-cream-50">
                              {formatPrice(product.price)}
                            </span>
                          </td>
                          <td class="px-4 py-3">
                            <Badge variant={inventory.variant}>
                              {inventory.label}
                            </Badge>
                          </td>
                          <td class="px-4 py-3">
                            <Badge variant={getStatusVariant(product.status)}>
                              {getStatusLabel(product.status as PlantStatus, t)}
                            </Badge>
                          </td>
                          <td class="px-4 py-3">
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                              {formatDateTime(product.updatedAt)}
                            </span>
                          </td>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div class="lg:hidden space-y-4">
              <For each={products()}>
                {(product) => {
                  const inventory = getInventoryLabel(product.inventoryCount, t);
                  return (
                    <div
                      class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5 hover:bg-cream-50 dark:hover:bg-forest-900/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/app/seller/products/plants/${product.id}`)}
                    >
                      <div class="flex items-start justify-between mb-3">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 mb-1">
                            <h3 class="font-semibold text-forest-800 dark:text-cream-50 truncate">
                              {product.name}
                            </h3>
                            <Badge variant={getStatusVariant(product.status)} class="flex-shrink-0">
                              {getStatusLabel(product.status as PlantStatus, t)}
                            </Badge>
                          </div>
                          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {product.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div class="flex items-center gap-2">
                          <FolderIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <p class="text-gray-500 dark:text-gray-400">{t("seller.products.mobileLabels.category")}</p>
                            <p class="font-medium text-forest-800 dark:text-cream-50">
                              {product.category?.name || "—"}
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <DollarSignIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <p class="text-gray-500 dark:text-gray-400">{t("seller.products.mobileLabels.price")}</p>
                            <p class="font-semibold text-forest-800 dark:text-cream-50">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <CubeIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <p class="text-gray-500 dark:text-gray-400">{t("seller.products.mobileLabels.inventory")}</p>
                            <Badge variant={inventory.variant} class="mt-0.5">
                              {inventory.label}
                            </Badge>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <ClockIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <p class="text-gray-500 dark:text-gray-400">{t("seller.products.updated")}</p>
                            <p class="font-medium text-forest-800 dark:text-cream-50">
                              {formatDateTime(product.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div class="flex flex-wrap gap-1">
                        <For each={product.tags}>
                          {(tag) => (
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300">
                              {tag.name}
                            </span>
                          )}
                        </For>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>

            {/* Pagination */}
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm px-6 py-4 mt-6">
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {t(
                    "seller.products.pagination.showing",
                    (currentPage() - 1) * ITEMS_PER_PAGE + 1,
                    Math.min(currentPage() * ITEMS_PER_PAGE, totalItems()),
                    totalItems(),
                  )}
                </p>
                <Show when={totalPages() > 1}>
                  <div class="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage() === 1}
                      class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeftIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <For each={getPageNumbers(currentPage(), totalPages())}>
                      {(page) => (
                        page === "..." ? (
                          <span class="w-9 h-9 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 select-none">…</span>
                        ) : (
                          <button
                            onClick={() => setCurrentPage(page as number)}
                            class={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                              currentPage() === page
                                ? "bg-forest-600 text-white"
                                : "border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </For>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages(), p + 1))}
                      disabled={currentPage() === totalPages()}
                      class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRightIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </Show>
              </div>
            </div>
          </Show>

          {/* Loading overlay during refetch */}
          <Show when={isRefetching()}>
            <div class="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
              <div class="flex items-center gap-2 text-forest-700 dark:text-cream-200">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span class="text-sm font-medium">{t("seller.products.updating")}</span>
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}
