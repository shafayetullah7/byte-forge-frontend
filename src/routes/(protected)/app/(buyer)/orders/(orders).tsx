import { Show, Suspense, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { createAsync } from "@solidjs/router";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { useI18n } from "~/i18n";
import { getOrders, getOrdersStats } from "~/lib/api/endpoints/buyer/orders.api";
import type { OrderFilterParams } from "~/lib/api/types/order.types";
import { ShoppingBagIcon } from "~/components/icons";
import {
  StatsLoading,
  OrdersLoading,
  StatsDisplay,
  OrdersTable,
  Pagination,
  FilterBar,
  buildFilterParams,
} from "./components";

interface OrderFilters {
  page: number;
  statusFilter: string;
  paymentFilter: string;
  searchQuery: string;
}

export default function OrdersPage() {
  const { t } = useI18n();

  const [filters, setFilters] = createStore<OrderFilters>({
    page: 1,
    statusFilter: "",
    paymentFilter: "",
    searchQuery: "",
  });
  const ITEMS_PER_PAGE = 10;

  const filterParams = createMemo<OrderFilterParams>(() =>
    buildFilterParams({
      page: filters.page,
      limit: ITEMS_PER_PAGE,
      statusFilter: filters.statusFilter,
      paymentFilter: filters.paymentFilter,
      searchQuery: filters.searchQuery,
    })
  );

  const statsData = createAsync(() => getOrdersStats());
  const ordersData = createAsync(() => getOrders(filterParams()));

  const totalItems = createMemo(() => ordersData()?.meta?.total ?? 0);
  const totalPages = createMemo(() => Math.ceil(totalItems() / ITEMS_PER_PAGE) || 1);

  const hasActiveFilters = createMemo(
    () => !!(filters.searchQuery || filters.statusFilter || filters.paymentFilter)
  );

  const handleFilterChange = (key: "statusFilter" | "paymentFilter" | "searchQuery", value: string) => {
    setFilters({ [key]: value, page: 1 });
  };

  const clearFilters = () => {
    setFilters({ page: 1, statusFilter: "", paymentFilter: "", searchQuery: "" });
  };

  return (
    <div class="px-6 py-8 mx-auto max-w-[1400px]">
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
              <ShoppingBagIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                {t("buyer.orders.title")}
              </h1>
              <p class="text-base text-gray-600 dark:text-gray-400">
                {t("buyer.orders.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback error={error} reset={reset} label="order statistics" />
        )}
      >
        <Suspense fallback={<StatsLoading />}>
          <Show when={statsData()}>
            {(stats) => <StatsDisplay stats={stats()} />}
          </Show>
        </Suspense>
      </SafeErrorBoundary>

      <FilterBar
        searchQuery={filters.searchQuery}
        onSearchChange={(val) => handleFilterChange("searchQuery", val)}
        statusFilter={filters.statusFilter}
        onStatusChange={(val) => handleFilterChange("statusFilter", val)}
        paymentFilter={filters.paymentFilter}
        onPaymentChange={(val) => handleFilterChange("paymentFilter", val)}
        hasActiveFilters={hasActiveFilters()}
        onClearFilters={clearFilters}
      />

      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {t("buyer.orders.resultsCount", { showing: ordersData()?.groups?.length ?? 0, total: totalItems() })}
        </p>
        <Show when={hasActiveFilters()}>
          <button
            onClick={clearFilters}
            class="inline-flex items-center gap-1.5 text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
          >
            {t("buyer.orders.clearAllFilters")}
          </button>
        </Show>
      </div>

      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback error={error} reset={reset} label="orders" />
        )}
      >
        <Suspense fallback={<OrdersLoading />}>
          <Show when={ordersData()}>
            {(data) => (
              <>
                <OrdersTable
                  groups={data().groups}
                  hasActiveFilters={hasActiveFilters()}
                  onClearFilters={clearFilters}
                />
                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages()}
                  totalItems={totalItems()}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={(page) => setFilters({ page })}
                />
              </>
            )}
          </Show>
        </Suspense>
      </SafeErrorBoundary>
    </div>
  );
}
