import { Show, createMemo, createDeferred, Suspense } from "solid-js";
import { createAsync, useSearchParams } from "@solidjs/router";
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
  const [searchParams, setSearchParams] = useSearchParams();

  // URL search params as source of truth
  const sp = searchParams;
  const currentPage = (): number => Number(sp.page ?? 1);
  const statusFilter = (): string => {
    const val = sp.status;
    return Array.isArray(val) ? val[0] : val ?? "";
  };
  const paymentFilter = (): string => {
    const val = sp.payment;
    return Array.isArray(val) ? val[0] : val ?? "";
  };
  const searchQuery = (): string => {
    const val = sp.search;
    return Array.isArray(val) ? val[0] : val ?? "";
  };

  // Debounced search - prevents network request on every keystroke
  const deferredSearch = createDeferred(searchQuery, { timeoutMs: 300 });

  // Inline filter params - no separate memo needed
  const ordersData = createAsync(() =>
    getOrders(
      buildFilterParams({
        page: currentPage(),
        limit: ITEMS_PER_PAGE,
        statusFilter: statusFilter(),
        paymentFilter: paymentFilter(),
        searchQuery: deferredSearch(),
      })
    )
  );

  // Stats - no filter dependency, fetched once
  const statsData = createAsync(() => getOrdersStats());

  // Derived loading state - no signal or effect needed
  const isRefetching = () =>
    ordersData() === undefined && ordersData.latest !== undefined;

  const totalItems = createMemo(() => ordersData.latest?.meta?.total ?? 0);
  const totalPages = createMemo(() => ordersData.latest?.meta?.pages ?? 1);

  const hasActiveFilters = createMemo(
    () => !!(searchQuery() || statusFilter() || paymentFilter())
  );

  const handleFilterChange = (key: "status" | "payment" | "search", value: string) => {
    setSearchParams({ [key]: value || undefined, page: undefined });
  };

  const clearFilters = () => {
    setSearchParams({ status: undefined, payment: undefined, search: undefined, page: undefined });
  };

  return (
    <div class="px-6 py-8 mx-auto max-w-[1400px]">
      <div class="mb-8">
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
        onSearchChange={(val) => handleFilterChange("search", val)}
        statusFilter={statusFilter()}
        onStatusChange={(val) => handleFilterChange("status", val)}
        paymentFilter={paymentFilter()}
        onPaymentChange={(val) => handleFilterChange("payment", val)}
        hasActiveFilters={hasActiveFilters()}
        onClearFilters={clearFilters}
      />

      <div class="mb-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {t("buyer.orders.resultsCount", { showing: ordersData.latest?.data?.length ?? 0, total: totalItems() })}
        </p>
      </div>

      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback error={error} reset={reset} label="orders" />
        )}
      >
        <Show
          when={ordersData.latest}
          fallback={<OrdersLoading />}
        >
          {(resp) => (
            <div class="relative">
              {isRefetching() && (
                <div class="absolute top-0 left-0 right-0 h-0.5 bg-forest-600 animate-pulse rounded-full z-10" />
              )}
              <OrdersTable
                groups={resp().data}
                hasActiveFilters={hasActiveFilters()}
                onClearFilters={clearFilters}
              />
              <Pagination
                currentPage={currentPage()}
                totalPages={totalPages()}
                totalItems={totalItems()}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={(page) => setSearchParams({ page: String(page) })}
              />
            </div>
          )}
        </Show>
      </SafeErrorBoundary>
    </div>
  );
}
