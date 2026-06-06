import { createMemo, createSignal, Show, Suspense, ErrorBoundary } from "solid-js";
import { createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { getOrders, getOrdersStats } from "~/lib/api/endpoints/buyer/orders.api";
import type { OrderFilterParams } from "~/lib/api/types/order.types";
import {
  ShoppingBagIcon,
  ExclamationCircleIcon,
} from "~/components/icons";
import {
  buildFilterParams,
  StatsLoading,
  StatsDisplay,
  FilterBar,
  OrdersTable,
  Pagination,
} from "./components";

export default function OrdersPage() {
  const { t } = useI18n();

  const [statusFilter, setStatusFilter] = createSignal("");
  const [paymentFilter, setPaymentFilter] = createSignal("");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [currentPage, setCurrentPage] = createSignal(1);
  const ITEMS_PER_PAGE = 10;

  const filterParams = createMemo<OrderFilterParams>(() =>
    buildFilterParams({
      page: currentPage(),
      limit: ITEMS_PER_PAGE,
      statusFilter: statusFilter(),
      paymentFilter: paymentFilter(),
      searchQuery: searchQuery(),
    })
  );

  const statsData = createAsync(() => getOrdersStats(), { deferStream: true });

  const ordersData = createAsync(() => getOrders(filterParams()), { deferStream: true });

  const totalItems = createMemo(() => ordersData()?.meta?.total ?? 0);
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
    <ErrorBoundary
      fallback={(error) => (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div class="flex items-start gap-3">
              <ExclamationCircleIcon class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 class="text-lg font-semibold text-red-900 dark:text-red-300">
                  {t("buyer.orders.error.failedToLoad")}
                </h3>
                <p class="text-sm text-red-700 dark:text-red-400 mt-1">
                  {error?.message || t("buyer.orders.error.unexpectedError")}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {t("buyer.orders.error.retry")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    >
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

        <Suspense fallback={<StatsLoading />}>
          <Show when={statsData()}>
            {(stats) => (
              <StatsDisplay
                total={stats().total}
                active={stats().active}
                delivered={stats().delivered}
                cancelled={stats().cancelled}
                totalSpent={stats().totalSpent}
              />
            )}
          </Show>
        </Suspense>

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

        <Suspense
          fallback={
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 py-12 px-4 text-center shadow-sm">
              <ShoppingBagIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("buyer.orders.loading")}
              </h3>
              <p class="text-gray-500 dark:text-gray-400">{t("buyer.orders.loadingDescription")}</p>
            </div>
          }
        >
          <Show when={ordersData()}>
            {(data) => (
              <>
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
              </>
            )}
          </Show>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
