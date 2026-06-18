import { createMemo, Show, Suspense } from "solid-js";
import { createAsync } from "@solidjs/router";
import { ErrorBoundary } from "solid-js";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { SectionErrorFallback } from "~/components/seller/SectionErrorFallback";
import { MagnifyingGlassIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { getShop } from "~/lib/context/shop-context";
import { getSellerOrders, getSellerOrderStats } from "~/lib/api/endpoints/seller/orders.api";
import { buildSellerOrderHref } from "~/lib/orders/seller-order.utils";
import { Pagination } from "~/routes/(protected)/app/(buyer)/orders/components/Pagination";
import { useSellerOrderFilters } from "./hooks/useSellerOrderFilters";
import { SellerOrderStatsCards } from "./components/SellerOrderStats";
import { SellerOrdersTable } from "./components/SellerOrdersTable";

export default function SellerOrdersRoute() {
  const { t } = useI18n();
  const filters = useSellerOrderFilters();

  const shop = createAsync(() => getShop(), { deferStream: true });

  const ordersResponse = createAsync(() => getSellerOrders(filters.filterParams()), {
    deferStream: true,
  });
  const stats = createAsync(() => getSellerOrderStats(), { deferStream: true });

  const orders = createMemo(() => ordersResponse()?.data ?? []);
  const meta = createMemo(() => ordersResponse()?.meta);

  const getOrderHref = (orderId: string) => buildSellerOrderHref(orderId, filters.filterParams());

  const orderStatusOptions = createMemo(() => [
    { value: "", label: t("seller.orders.filters.allStatuses") },
    { value: "PENDING_PAYMENT", label: t("seller.orders.pending"), dotColor: "bg-cream-400" },
    { value: "CONFIRMED", label: t("seller.orders.status.confirmed"), dotColor: "bg-sage-400" },
    { value: "PROCESSING", label: t("seller.orders.processing"), dotColor: "bg-cream-400" },
    { value: "SHIPPED", label: t("seller.orders.shipped"), dotColor: "bg-forest-400" },
    { value: "DELIVERED", label: t("seller.orders.delivered"), dotColor: "bg-forest-500" },
    { value: "CANCELLED", label: t("seller.orders.cancelled"), dotColor: "bg-terracotta-400" },
  ]);

  const paymentStatusOptions = createMemo(() => [
    { value: "", label: t("seller.orders.filters.allPayments") },
    { value: "PENDING", label: t("seller.orders.payment.pending"), dotColor: "bg-cream-400" },
    { value: "COMPLETED", label: t("seller.orders.payment.completed"), dotColor: "bg-forest-500" },
  ]);

  const handleFilterChange = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    filters.resetPage();
  };

  return (
    <ErrorBoundary fallback={(error) => <SectionErrorFallback error={error} title="orders" />}>
      <div class="space-y-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{t("seller.orders.title")}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("seller.orders.subtitle")}</p>
        </div>

        <Show when={shop()?.status && shop()!.status !== "ACTIVE"}>
          <div class="rounded-xl border border-cream-300 dark:border-cream-700 bg-cream-50 dark:bg-cream-900/20 px-4 py-3 text-sm text-cream-800 dark:text-cream-200">
            {t("seller.orders.shopNotActiveBanner")}
          </div>
        </Show>

        <SellerOrderStatsCards stats={stats()} />

        <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
          <div class="p-5 border-b border-gray-200 dark:border-forest-700 flex flex-col lg:flex-row gap-4">
            <div class="relative flex-1">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder={t("seller.orders.searchPlaceholder")}
                value={filters.searchQuery()}
                onInput={(e) => {
                  filters.setSearchQuery(e.currentTarget.value);
                  filters.resetPage();
                }}
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm"
              />
            </div>
            <FilterSelect
              options={orderStatusOptions()}
              value={filters.statusFilter()}
              onChange={handleFilterChange(filters.setStatusFilter)}
              placeholder={t("seller.orders.filters.status")}
            />
            <FilterSelect
              options={paymentStatusOptions()}
              value={filters.paymentFilter()}
              onChange={handleFilterChange(filters.setPaymentFilter)}
              placeholder={t("seller.orders.filters.payment")}
            />
            <input
              type="date"
              value={filters.dateFrom()}
              onInput={(e) => {
                filters.setDateFrom(e.currentTarget.value);
                filters.resetPage();
              }}
              class="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-forest-600 text-sm"
              aria-label={t("seller.orders.filters.dateFrom")}
            />
            <input
              type="date"
              value={filters.dateTo()}
              onInput={(e) => {
                filters.setDateTo(e.currentTarget.value);
                filters.resetPage();
              }}
              class="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-forest-600 text-sm"
              aria-label={t("seller.orders.filters.dateTo")}
            />
          </div>

          <Suspense fallback={<div class="p-8 text-center text-sm text-gray-500">{t("seller.orders.loading")}</div>}>
            <SellerOrdersTable orders={orders()} getOrderHref={getOrderHref} />
          </Suspense>

          <div class="px-5 py-4 border-t border-gray-200 dark:border-forest-700 text-sm text-gray-500">
            {t("seller.orders.resultsCount", {
              showing: orders().length,
              total: meta()?.total ?? 0,
            })}
          </div>
        </div>

        <Show when={(meta()?.pages ?? 0) > 1}>
          <Pagination
            currentPage={filters.page()}
            totalPages={meta()?.pages ?? 1}
            totalItems={meta()?.total ?? 0}
            itemsPerPage={filters.limit}
            onPageChange={filters.setPage}
          />
        </Show>
      </div>
    </ErrorBoundary>
  );
}
