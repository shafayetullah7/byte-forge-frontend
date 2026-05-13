import { createMemo, createSignal, For, Show, Suspense, ErrorBoundary, createEffect } from "solid-js";
import { A, createAsync, useNavigate } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { getProducts } from "~/lib/api/endpoints/seller/products.api";
import type { ProductListItem, ProductType, ProductFilter } from "~/lib/api/types/seller.types";
import {
  PackageIcon,
  PlusIcon,
  Squares2x2Icon,
  CheckCircleIcon,
  FolderIcon,
  ArchiveIcon,
  ClockIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  DropletIcon,
  HeartIcon,
  ExclamationCircleIcon,
  SortIcon,
  XIcon,
  FilterIcon,
} from "~/components/icons";
import Badge from "~/components/ui/Badge";
import { FilterSelect } from "~/components/ui/FilterSelect";

// ========================
// Product Type Config (static navigation)
// ========================

interface ProductTypeConfig {
  type: ProductType;
  nameKey: string;
  icon: any;
  href: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBg: string;
}

const PRODUCT_TYPE_CONFIGS: ProductTypeConfig[] = [
  {
    type: "plant",
    nameKey: "seller.products.types.plants",
    icon: CubeIcon,
    href: "/app/seller/products/plants",
    color: "text-forest-600 dark:text-forest-400",
    bgColor: "bg-forest-50 dark:bg-forest-900/30",
    borderColor: "border-forest-200 dark:border-forest-700",
    hoverBg: "hover:bg-forest-50 dark:hover:bg-forest-900/20",
  },
  {
    type: "pot",
    nameKey: "seller.products.types.pots",
    icon: CubeIcon,
    href: "/app/seller/products/pots",
    color: "text-terracotta-600 dark:text-terracotta-400",
    bgColor: "bg-terracotta-50 dark:bg-terracotta-900/30",
    borderColor: "border-terracotta-200 dark:border-terracotta-700",
    hoverBg: "hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20",
  },
  {
    type: "seed",
    nameKey: "seller.products.types.seeds",
    icon: HeartIcon,
    href: "/app/seller/products/seeds",
    color: "text-sage-600 dark:text-sage-400",
    bgColor: "bg-sage-50 dark:bg-sage-900/30",
    borderColor: "border-sage-200 dark:border-sage-700",
    hoverBg: "hover:bg-sage-50 dark:hover:bg-sage-900/20",
  },
  {
    type: "fertilizer",
    nameKey: "seller.products.types.fertilizer",
    icon: DropletIcon,
    href: "/app/seller/products/fertilizer",
    color: "text-cream-600 dark:text-cream-400",
    bgColor: "bg-cream-50 dark:bg-cream-900/30",
    borderColor: "border-cream-200 dark:border-cream-700",
    hoverBg: "hover:bg-cream-50 dark:hover:bg-cream-900/20",
  },
];

const SORT_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "createdAt", labelKey: "seller.products.sort.dateCreated" },
  { value: "updatedAt", labelKey: "seller.products.sort.dateUpdated" },
  { value: "name", labelKey: "seller.products.sort.name" },
  { value: "price", labelKey: "seller.products.sort.price" },
  { value: "inventory", labelKey: "seller.products.sort.inventory" },
];

// ========================
// Helpers
// ========================

function getStatusVariant(status: string): "forest" | "cream" | "terracotta" | "default" {
  switch (status) {
    case "ACTIVE": return "forest";
    case "DRAFT": return "cream";
    case "ARCHIVED": return "terracotta";
    default: return "default";
  }
}

function formatPrice(price: string | number | null | undefined): string {
  if (!price) return "\u2014";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `\u09f3${num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTypeLabel(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getInventoryLabel(count: number, t: (key: string, params?: Record<string, any>) => string): { label: string; variant: "forest" | "cream" | "terracotta" } {
  if (count === 0) return { label: t("seller.products.inventory.outOfStock"), variant: "terracotta" };
  if (count <= 10) return { label: t("seller.products.inventory.left", { count }), variant: "cream" };
  return { label: t("seller.products.inventory.inStock", { count }), variant: "forest" };
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

// ========================
// Filter Chip Component
// ========================

function FilterChip(props: { label: string; onRemove: () => void }) {
  return (
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 border border-forest-200 dark:border-forest-800">
      {props.label}
      <button
        onClick={props.onRemove}
        class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-800 transition-colors"
      >
        <XIcon class="w-3 h-3" />
      </button>
    </span>
  );
}

// ========================
// Stats Card Component
// ========================

function StatsCard(props: {
  label: string;
  value: number;
  icon: any;
  valueColor: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl p-5 border border-cream-200 dark:border-forest-700 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{props.label}</p>
          <p class="text-2xl font-bold mt-1" classList={{
            "text-forest-800 dark:text-cream-50": props.valueColor === "default",
            "text-forest-600 dark:text-forest-400": props.valueColor === "forest",
            "text-cream-600 dark:text-cream-400": props.valueColor === "cream",
            "text-terracotta-600 dark:text-terracotta-400": props.valueColor === "terracotta",
          }}>
            {props.value}
          </p>
        </div>
        <div class={`w-10 h-10 rounded-lg ${props.iconBg} flex items-center justify-center`}>
          <props.icon class={`w-5 h-5 ${props.iconColor}`} />
        </div>
      </div>
    </div>
  );
}

// ========================
// Loading Placeholder
// ========================

function StatsLoading() {
  return (
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <For each={Array.from({ length: 4 })}>
        {() => (
          <div class="h-24 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 animate-pulse" />
        )}
      </For>
    </div>
  );
}

function TableLoading() {
  return (
    <div class="hidden lg:block bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden">
      <div class="p-12 text-center">
        <PackageIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4 animate-pulse" />
        <p class="text-gray-500 dark:text-gray-400">Loading products...</p>
      </div>
    </div>
  );
}

// ========================
// Main Products Page
// ========================

export default function ProductsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  // Filter State
  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal("");
  const [productTypeFilter, setProductTypeFilter] = createSignal("");
  const [sortBy, setSortBy] = createSignal("createdAt");
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("desc");
  const [showSortPanel, setShowSortPanel] = createSignal(false);
  const [currentPage, setCurrentPage] = createSignal(1);
  const ITEMS_PER_PAGE = 10;

  // Close sort panel on outside click
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

  // Filter Params Memo
  const filterParams = createMemo<ProductFilter>(() => ({
    page: currentPage(),
    limit: ITEMS_PER_PAGE,
    search: searchQuery() || undefined,
    status: (statusFilter() || undefined) as ProductFilter["status"],
    productType: (productTypeFilter() || undefined) as ProductFilter["productType"],
    sortBy: sortBy() as ProductFilter["sortBy"],
    sortOrder: sortOrder(),
  }));

  // API Call
  const productsData = createAsync(
    () => getProducts(filterParams()),
    { deferStream: true }
  );

  // Stable signal pattern
  const [stableProducts, setStableProducts] = createSignal<{ data: ProductListItem[]; meta: { total: number; pages: number } } | undefined>(undefined);
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

  // Extract data
  const products = createMemo(() => stableProducts()?.data ?? []);
  const meta = createMemo(() => stableProducts()?.meta);
  const totalPages = createMemo(() => meta()?.pages ?? 1);
  const totalItems = createMemo(() => meta()?.total ?? 0);

  // Stats (fetched separately with high limit to get all for stats)
  const statsData = createAsync(
    () => getProducts({ limit: 100 }),
    { deferStream: true }
  );

  const totalProducts = createMemo(() => statsData()?.data?.length ?? 0);
  const totalActive = createMemo(() => (statsData()?.data ?? []).filter((p) => p.status === "ACTIVE").length);
  const totalDraft = createMemo(() => (statsData()?.data ?? []).filter((p) => p.status === "DRAFT").length);
  const totalArchived = createMemo(() => (statsData()?.data ?? []).filter((p) => p.status === "ARCHIVED").length);

  // Per-type stats
  const typeStats = createMemo(() =>
    PRODUCT_TYPE_CONFIGS.map((config) => {
      const typeProducts = (statsData()?.data ?? []).filter((p) => p.productType === config.type);
      return {
        ...config,
        total: typeProducts.length,
        active: typeProducts.filter((p) => p.status === "ACTIVE").length,
        draft: typeProducts.filter((p) => p.status === "DRAFT").length,
        archived: typeProducts.filter((p) => p.status === "ARCHIVED").length,
      };
    })
  );

  // Filter Handlers
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
    () => searchQuery() || statusFilter() || productTypeFilter()
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
    return option ? `${t(option.labelKey)} (${sortOrder() === "asc" ? t("seller.products.sort.asc") : t("seller.products.sort.desc")})` : "";
  });

  return (
    <ErrorBoundary
      fallback={(error) => (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">
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
    <div class="px-6 py-8 mx-auto max-w-[1400px]">
      {/* Page Header */}
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
          <A
            href="/app/seller/products/new"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
          >
            <PlusIcon class="w-5 h-5" />
            {t("seller.products.addProduct")}
          </A>
        </div>
      </div>

      {/* Overall Stats */}
      <Suspense fallback={<StatsLoading />}>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            label={t("seller.products.stats.totalProducts")}
            value={totalProducts()}
            icon={Squares2x2Icon}
            valueColor="default"
            iconBg="bg-cream-100 dark:bg-cream-900/40"
            iconColor="text-cream-600 dark:text-cream-400"
          />
          <StatsCard
            label={t("seller.products.stats.active")}
            value={totalActive()}
            icon={CheckCircleIcon}
            valueColor="forest"
            iconBg="bg-forest-100 dark:bg-forest-900/40"
            iconColor="text-forest-600 dark:text-forest-400"
          />
          <StatsCard
            label={t("seller.products.stats.draft")}
            value={totalDraft()}
            icon={FolderIcon}
            valueColor="cream"
            iconBg="bg-cream-100 dark:bg-cream-900/40"
            iconColor="text-cream-600 dark:text-cream-400"
          />
          <StatsCard
            label={t("seller.products.stats.archived")}
            value={totalArchived()}
            icon={ArchiveIcon}
            valueColor="terracotta"
            iconBg="bg-terracotta-100 dark:bg-terracotta-900/40"
            iconColor="text-terracotta-600 dark:text-terracotta-400"
          />
        </div>
      </Suspense>

      {/* Product Type Cards */}
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-4">
          {t("seller.products.productTypes")}
        </h2>
        <Suspense fallback={
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <For each={Array.from({ length: 4 })}>
              {() => (
                <div class="h-48 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 animate-pulse" />
              )}
            </For>
          </div>
        }>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <For each={typeStats()}>
              {(pt) => (
                <A
                  href={pt.href}
                  class={`block bg-white dark:bg-forest-800 rounded-xl border ${pt.borderColor} shadow-sm overflow-hidden transition-all hover:shadow-md ${pt.hoverBg} group`}
                  classList={{
                    "opacity-60 pointer-events-none": pt.total === 0,
                  }}
                >
                  <div class={`p-5 ${pt.bgColor} border-b ${pt.borderColor}`}>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class={`w-10 h-10 rounded-lg ${pt.bgColor} border ${pt.borderColor} flex items-center justify-center`}>
                          <pt.icon class={`w-5 h-5 ${pt.color}`} />
                        </div>
                        <div>
                          <h3 class="font-semibold text-forest-800 dark:text-cream-50">
                            {t(pt.nameKey)}
                          </h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            {t("seller.products.productCount", { count: pt.total })}
                          </p>
                        </div>
                      </div>
                      <ChevronRightIcon class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors" />
                    </div>
                  </div>

                  {/* Card Stats */}
                  <div class="p-4">
                    <div class="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p class="text-lg font-bold text-forest-600 dark:text-forest-400">
                          {pt.active}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{t("seller.products.cardStats.active")}</p>
                      </div>
                      <div>
                        <p class="text-lg font-bold text-cream-600 dark:text-cream-400">
                          {pt.draft}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{t("seller.products.cardStats.draft")}</p>
                      </div>
                      <div>
                        <p class="text-lg font-bold text-terracotta-600 dark:text-terracotta-400">
                          {pt.archived}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{t("seller.products.cardStats.archived")}</p>
                      </div>
                    </div>

                    <Show when={pt.total > 0}>
                      <div class="mt-3">
                        <div class="flex items-center gap-2 mb-1">
                          <div class="flex-1 h-1.5 bg-gray-100 dark:bg-forest-700 rounded-full overflow-hidden">
                            <div
                              class="h-full bg-forest-500 rounded-full transition-all"
                              style={{ width: `${(pt.active / pt.total) * 100}%` }}
                            />
                          </div>
                          <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {Math.round((pt.active / pt.total) * 100)}%
                          </span>
                        </div>
                      </div>
                    </Show>
                  </div>
                </A>
              )}
            </For>
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

            {/* Status Filter */}
            <FilterSelect
              options={[
                { value: "", label: t("seller.products.filters.allStatus") },
                { value: "ACTIVE", label: t("seller.products.filters.statusActive"), dotColor: "bg-forest-500" },
                { value: "DRAFT", label: t("seller.products.filters.statusDraft"), dotColor: "bg-cream-500" },
                { value: "ARCHIVED", label: t("seller.products.filters.statusArchived"), dotColor: "bg-terracotta-500" },
              ]}
              value={statusFilter()}
              onChange={(val) => handleFilterChange(setStatusFilter, val)}
            />

            {/* Product Type Filter */}
            <FilterSelect
              options={[
                { value: "", label: t("seller.products.filters.allTypes") },
                { value: "plant", label: t("seller.products.filters.typePlants") },
                { value: "pot", label: t("seller.products.filters.typePots") },
                { value: "seed", label: t("seller.products.filters.typeSeeds") },
                { value: "fertilizer", label: t("seller.products.filters.typeFertilizers") },
              ]}
              value={productTypeFilter()}
              onChange={(val) => handleFilterChange(setProductTypeFilter, val)}
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
                      {(option) => (
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
                            <span>{t(option.labelKey)}</span>
                          </span>
                          {sortBy() === option.value && (
                            <span class="text-xs">
                              {sortOrder() === "asc" ? t("seller.products.sort.asc") : t("seller.products.sort.desc")}
                            </span>
                          )}
                        </button>
                      )}
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
                    label={t("seller.products.filterLabels.search", { query: searchQuery() })}
                    onRemove={() => handleFilterChange(setSearchQuery, "")}
                  />
                </Show>
                <Show when={statusFilter()}>
                  <FilterChip
                    label={t("seller.products.filterLabels.status", {
                      status: statusFilter() === "ACTIVE" ? t("seller.products.filters.statusActive") : statusFilter() === "DRAFT" ? t("seller.products.filters.statusDraft") : t("seller.products.filters.statusArchived"),
                    })}
                    onRemove={() => handleFilterChange(setStatusFilter, "")}
                  />
                </Show>
                <Show when={productTypeFilter()}>
                  <FilterChip
                    label={t("seller.products.filterLabels.type", { type: getTypeLabel(productTypeFilter()) })}
                    onRemove={() => handleFilterChange(setProductTypeFilter, "")}
                  />
                </Show>
              </div>
            </div>
          </Show>
        </div>
      </div>

      {/* Results Count */}
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {t("seller.products.resultsCount", { showing: products().length, total: totalItems() })}
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

      {/* Products Table */}
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
        <div class="relative">
          <Show
            when={products().length > 0}
            fallback={
              <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 py-12 px-4 text-center shadow-sm">
                <PackageIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
                  {t("seller.products.noProductsFound")}
                </h3>
                <p class="text-gray-500 dark:text-gray-400 mb-6">
                  {hasActiveFilters()
                    ? t("seller.products.noProductsAdjustFilters")
                    : t("seller.products.noProductsStart")}
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
                    href="/app/seller/products/new"
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
                  >
                    <PlusIcon class="w-5 h-5" />
                    {t("seller.products.addProduct")}
                  </A>
                </Show>
              </div>
            }
          >
            {/* Desktop Table */}
            <div class="hidden lg:block bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-cream-200 dark:border-forest-700 bg-cream-50 dark:bg-forest-900/50">
                    <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("seller.products.tableHeaders.product")}
                    </th>
                    <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("seller.products.tableHeaders.type")}
                    </th>
                    <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("seller.products.tableHeaders.price")}
                    </th>
                    <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("seller.products.tableHeaders.inventory")}
                    </th>
                    <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("seller.products.tableHeaders.status")}
                    </th>
                    <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("seller.products.tableHeaders.updated")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={products()}>
                    {(product: ProductListItem) => {
                      const inventory = getInventoryLabel(product.inventoryCount, t);
                      const productTypeLabel = getTypeLabel(product.productType);

                      return (
                        <tr
                          class="border-b border-cream-100 dark:border-forest-700/50 hover:bg-cream-50 dark:hover:bg-forest-900/30 transition-colors cursor-pointer"
                          onClick={() => {
                            if (product.productType === "plant") {
                              navigate(`/app/seller/products/plants/${product.id}`);
                            }
                          }}
                        >
                          <td class="px-5 py-3.5">
                            <div>
                              <p class="font-semibold text-forest-800 dark:text-cream-50">
                                {product.name || product.slug}
                              </p>
                              <p class="text-sm text-gray-500 dark:text-gray-400">
                                {product.shortDescription}
                              </p>
                            </div>
                          </td>
                          <td class="px-5 py-3.5">
                            <span class="text-sm text-gray-700 dark:text-gray-300">
                              {productTypeLabel}
                            </span>
                          </td>
                          <td class="px-5 py-3.5">
                            <span class="font-semibold text-forest-800 dark:text-cream-50">
                              {formatPrice(product.price)}
                            </span>
                          </td>
                          <td class="px-5 py-3.5">
                            <Badge variant={inventory.variant}>
                              {inventory.label}
                            </Badge>
                          </td>
                          <td class="px-5 py-3.5">
                            <Badge variant={getStatusVariant(product.status)}>
                              {product.status === "ACTIVE" ? t("seller.products.statusLabels.active") : product.status === "DRAFT" ? t("seller.products.statusLabels.draft") : t("seller.products.statusLabels.archived")}
                            </Badge>
                          </td>
                          <td class="px-5 py-3.5">
                            <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                              <ClockIcon class="w-3.5 h-3.5" />
                              {t("seller.products.updated")} {formatDateTime(product.updatedAt)}
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
            <div class="lg:hidden space-y-3">
              <For each={products()}>
                {(product: ProductListItem) => {
                  const inventory = getInventoryLabel(product.inventoryCount, t);
                  const productTypeLabel = getTypeLabel(product.productType);

                  return (
                    <div
                      class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-4 hover:bg-cream-50 dark:hover:bg-forest-900/30 transition-colors cursor-pointer"
                      onClick={() => {
                        if (product.productType === "plant") {
                          navigate(`/app/seller/products/plants/${product.id}`);
                        }
                      }}
                    >
                      <div class="flex items-start justify-between mb-3">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 mb-1">
                            <h3 class="font-semibold text-forest-800 dark:text-cream-50 truncate">
                              {product.name || product.slug}
                            </h3>
                            <Badge variant={getStatusVariant(product.status)} class="flex-shrink-0">
                              {product.status === "ACTIVE" ? t("seller.products.statusLabels.active") : product.status === "DRAFT" ? t("seller.products.statusLabels.draft") : t("seller.products.statusLabels.archived")}
                            </Badge>
                          </div>
                          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {product.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div class="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p class="text-gray-500 dark:text-gray-400 text-xs">{t("seller.products.mobileLabels.type")}</p>
                          <p class="font-medium text-forest-800 dark:text-cream-50">
                            {productTypeLabel}
                          </p>
                        </div>
                        <div>
                          <p class="text-gray-500 dark:text-gray-400 text-xs">{t("seller.products.mobileLabels.price")}</p>
                          <p class="font-semibold text-forest-800 dark:text-cream-50">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <div>
                          <p class="text-gray-500 dark:text-gray-400 text-xs">{t("seller.products.mobileLabels.inventory")}</p>
                          <Badge variant={inventory.variant} class="mt-0.5">
                            {inventory.label}
                          </Badge>
                        </div>
                      </div>

                      <div class="mt-2 pt-2 border-t border-cream-100 dark:border-forest-700/50">
                        <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                          <ClockIcon class="w-3 h-3" />
                          {t("seller.products.updated")} {formatDateTime(product.updatedAt)}
                        </span>
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
                  {t("seller.products.pagination.showing", {
                    start: (currentPage() - 1) * ITEMS_PER_PAGE + 1,
                    end: Math.min(currentPage() * ITEMS_PER_PAGE, totalItems()),
                    total: totalItems(),
                  })}
                </p>
                <Show when={totalPages() > 1}>
                  <div class="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage() === 1}
                      class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRightIcon class="w-5 h-5 text-gray-700 dark:text-gray-300 rotate-180" />
                    </button>
                    <For each={getPageNumbers(currentPage(), totalPages())}>
                      {(page) => (
                        page === "..." ? (
                          <span class="w-9 h-9 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 select-none">\u2026</span>
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
    </ErrorBoundary>
  );
}
