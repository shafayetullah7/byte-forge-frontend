import { Show, createMemo, createSignal, createResource, Suspense } from "solid-js";
import { createAsync } from "@solidjs/router";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { useI18n } from "~/i18n";
import { getOrders, getOrdersStats } from "~/lib/api/endpoints/buyer/orders.api";
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

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const { t } = useI18n();

  const [currentPage, setCurrentPage] = createSignal(1);
  const [statusFilter, setStatusFilter] = createSignal("");
  const [paymentFilter, setPaymentFilter] = createSignal("");
  const [searchQuery, setSearchQuery] = createSignal("");

  const filterParams = createMemo(() =>
    buildFilterParams({
      page: currentPage(),
      limit: ITEMS_PER_PAGE,
      statusFilter: statusFilter(),
      paymentFilter: paymentFilter(),
      searchQuery: searchQuery(),
    })
  );

  const statsData = createAsync(() => getOrdersStats());
  const [ordersData, { refetch: refetchOrders }] = createResource(
    () => filterParams(),
    (params) => getOrders(params)
  );

  const totalItems = createMemo(() => ordersData.latest?.meta?.total ?? 0);
  const totalPages = createMemo(() => Math.ceil(totalItems() / ITEMS_PER_PAGE) || 1);

  const hasActiveFilters = createMemo(
    () => !!(searchQuery() || statusFilter() || paymentFilter())
  );

  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPaymentFilter("");
    setCurrentPage(1);
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
        searchQuery={searchQuery()}
        onSearchChange={(val) => handleFilterChange(setSearchQuery, val)}
        statusFilter={statusFilter()}
        onStatusChange={(val) => handleFilterChange(setStatusFilter, val)}
        paymentFilter={paymentFilter()}
        onPaymentChange={(val) => handleFilterChange(setPaymentFilter, val)}
        hasActiveFilters={hasActiveFilters()}
        onClearFilters={clearFilters}
      />

      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {t("buyer.orders.resultsCount", { showing: ordersData.latest?.groups?.length ?? 0, total: totalItems() })}
        </p>
      </div>

      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback error={error} reset={reset} label="orders" />
        )}
      >
        <Show
          when={ordersData.latest}
          fallback={
            ordersData.error ? (
              <div class="bg-white dark:bg-forest-800 rounded-xl border border-red-200 dark:border-red-800 py-12 px-4 text-center shadow-sm">
                <ShoppingBagIcon class="w-10 h-10 text-red-400 dark:text-red-500 mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">
                  {t("buyer.orders.error.failedToLoad") || "Failed to load orders"}
                </h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">
                  {ordersData.error.message}
                </p>
                <button
                  onClick={() => refetchOrders()}
                  class="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  {t("buyer.orders.error.retry") || "Retry"}
                </button>
              </div>
            ) : (
              <OrdersLoading />
            )
          }
        >
          {(data) => (
            <div class="relative">
              {ordersData.loading && (
                <div class="absolute top-0 left-0 right-0 h-0.5 bg-forest-600 animate-pulse rounded-full z-10" />
              )}
              <OrdersTable
                groups={data().groups}
                hasActiveFilters={hasActiveFilters()}
                onClearFilters={clearFilters}
              />
              <Pagination
                currentPage={currentPage()}
                totalPages={totalPages()}
                totalItems={totalItems()}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Show>
      </SafeErrorBoundary>
    </div>
  );
}
