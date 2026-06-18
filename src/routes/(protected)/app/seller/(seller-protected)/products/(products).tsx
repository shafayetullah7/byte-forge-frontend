import { createMemo, createSignal, Show, Suspense, ErrorBoundary, createEffect } from "solid-js";
import { A, createAsync, useNavigate } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { getProducts } from "~/lib/api/endpoints/seller/products.api";
import type { ProductFilter } from "~/lib/api/types/seller.types";
import {
  PackageIcon,
  ExclamationCircleIcon,
  Squares2x2Icon,
  CheckCircleIcon,
  FolderIcon,
  ArchiveIcon,
} from "~/components/icons";
import {
  PRODUCT_TYPE_CONFIGS,
  SORT_OPTIONS,
  buildFilterParams,
  computeTypeStats,
  computeStats,
  OverallStatsCard,
  StatsLoading,
  ProductTypeCards,
  FilterBar,
  ProductsTable,
  Pagination,
} from "./components";

export default function ProductsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal("");
  const [productTypeFilter, setProductTypeFilter] = createSignal("");
  const [sortBy, setSortBy] = createSignal("createdAt");
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("desc");
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

  const filterParams = createMemo<ProductFilter>(() =>
    buildFilterParams({
      page: currentPage(),
      limit: ITEMS_PER_PAGE,
      search: searchQuery(),
      status: statusFilter(),
      productType: productTypeFilter(),
      sortBy: sortBy(),
      sortOrder: sortOrder(),
    })
  );

  const productsData = createAsync(
    () => getProducts(filterParams()),
    { deferStream: true }
  );

  const [stableProducts, setStableProducts] = createSignal<{
    data: any[];
    meta: { total: number; pages: number };
  } | undefined>(undefined);
  const [isRefetching, setIsRefetching] = createSignal(false);

  createEffect(() => {
    const d = productsData();
    if (d !== undefined) {
      setStableProducts(d);
      setIsRefetching(false);
    } else if (stableProducts() !== undefined) {
      setIsRefetching(true);
    }
  });

  const products = createMemo(() => stableProducts()?.data ?? []);
  const meta = createMemo(() => stableProducts()?.meta);
  const totalPages = createMemo(() => meta()?.pages ?? 1);
  const totalItems = createMemo(() => meta()?.total ?? 0);

  const statsData = createAsync(
    () => getProducts({ limit: 100 }),
    { deferStream: true }
  );

  const stats = createMemo(() => computeStats(statsData()?.data));
  const typeStats = createMemo(() => computeTypeStats(PRODUCT_TYPE_CONFIGS, statsData()?.data));

  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setProductTypeFilter("");
    setCurrentPage(1);
  };

  const hasActiveFilters = createMemo(
    () => !!(searchQuery() || statusFilter() || productTypeFilter())
  );

  const activeFilterCount = createMemo(() => {
    let count = 0;
    if (searchQuery()) count++;
    if (statusFilter()) count++;
    if (productTypeFilter()) count++;
    return count;
  });

  const sortLabel = createMemo(() => {
    const option = SORT_OPTIONS.find((o) => o.value === sortBy());
    return option
      ? `${t(option.labelKey)} (${sortOrder() === "asc" ? t("seller.products.sort.asc") : t("seller.products.sort.desc")})`
      : "";
  });

  const handleSortChange = (option: { value: string; labelKey: string }) => {
    if (sortBy() === option.value) {
      setSortOrder(sortOrder() === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option.value);
      setSortOrder("desc");
    }
    setShowSortPanel(false);
  };

  const handleResetSort = () => {
    setSortBy("createdAt");
    setSortOrder("desc");
    setShowSortPanel(false);
  };

  return (
    <ErrorBoundary
      fallback={(error) => (
        <div class="mx-auto max-w-[1400px]">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div class="flex items-start gap-3">
              <ExclamationCircleIcon class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 class="text-lg font-semibold text-red-900 dark:text-red-300">
                  {t("seller.products.error.failedToLoad")}
                </h3>
                <p class="text-sm text-red-700 dark:text-red-400 mt-1">
                  {error?.message || t("seller.products.error.unexpectedError")}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {t("seller.products.error.retry")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div class="mx-auto max-w-[1400px]">
        <div class="mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
                <PackageIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                  {t("seller.products.allProducts")}
                </h1>
                <p class="text-base text-gray-600 dark:text-gray-400">
                  {t("seller.products.manageProducts")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={<StatsLoading />}>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <OverallStatsCard
              label={t("seller.products.stats.totalProducts")}
              value={stats().total}
              icon={Squares2x2Icon}
              valueColor="default"
              iconBg="bg-cream-100 dark:bg-cream-900/40"
              iconColor="text-cream-600 dark:text-cream-400"
            />
            <OverallStatsCard
              label={t("seller.products.stats.active")}
              value={stats().active}
              icon={CheckCircleIcon}
              valueColor="forest"
              iconBg="bg-forest-100 dark:bg-forest-900/40"
              iconColor="text-forest-600 dark:text-forest-400"
            />
            <OverallStatsCard
              label={t("seller.products.stats.draft")}
              value={stats().draft}
              icon={FolderIcon}
              valueColor="cream"
              iconBg="bg-cream-100 dark:bg-cream-900/40"
              iconColor="text-cream-600 dark:text-cream-400"
            />
            <OverallStatsCard
              label={t("seller.products.stats.archived")}
              value={stats().archived}
              icon={ArchiveIcon}
              valueColor="terracotta"
              iconBg="bg-terracotta-100 dark:bg-terracotta-900/40"
              iconColor="text-terracotta-600 dark:text-terracotta-400"
            />
          </div>
        </Suspense>

        <div class="mb-8">
          <h2 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-4">
            {t("seller.products.productTypes")}
          </h2>
          <Suspense fallback={
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map(() => (
                <div class="h-48 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 animate-pulse" />
              ))}
            </div>
          }>
            <ProductTypeCards typeStats={typeStats()} />
          </Suspense>
        </div>

        <FilterBar
          searchQuery={searchQuery()}
          onSearchChange={(val) => handleFilterChange(setSearchQuery, val)}
          statusFilter={statusFilter()}
          onStatusChange={(val) => handleFilterChange(setStatusFilter, val)}
          productTypeFilter={productTypeFilter()}
          onProductTypeChange={(val) => handleFilterChange(setProductTypeFilter, val)}
          sortLabel={sortLabel()}
          showSortPanel={showSortPanel()}
          onToggleSortPanel={() => setShowSortPanel(!showSortPanel())}
          sortOptions={SORT_OPTIONS}
          sortBy={sortBy()}
          sortOrder={sortOrder()}
          onSortChange={handleSortChange}
          onResetSort={handleResetSort}
          hasActiveFilters={hasActiveFilters()}
          activeFilterCount={activeFilterCount()}
          onClearFilters={clearFilters}
          onCloseSortPanel={() => setShowSortPanel(false)}
        />

        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {t("seller.products.resultsCount", { showing: products().length, total: totalItems() })}
          </p>
          <Show when={hasActiveFilters()}>
            <button
              onClick={clearFilters}
              class="inline-flex items-center gap-1.5 text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
            >
              {t("seller.products.clearAllFilters")}
            </button>
          </Show>
        </div>

        <Show
          when={stableProducts()}
          fallback={
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 py-12 px-4 text-center shadow-sm">
              <PackageIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
                {t("seller.products.loading")}
              </h3>
              <p class="text-gray-500 dark:text-gray-400">{t("seller.products.loadingDescription")}</p>
            </div>
          }
        >
          <ProductsTable
            products={products()}
            hasActiveFilters={hasActiveFilters()}
            onClearFilters={clearFilters}
            isRefetching={isRefetching()}
          />

          <Pagination
            currentPage={currentPage()}
            totalPages={totalPages()}
            totalItems={totalItems()}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </Show>
      </div>
    </ErrorBoundary>
  );
}
