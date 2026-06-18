import { createSignal, createMemo, createEffect } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { mapSidebarStatusParam } from "~/lib/orders/order-display.utils";
import type { OrderStatus, PaymentStatus } from "~/lib/api/types/seller-orders.types";

export function useSellerOrderFilters() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal("");
  const [paymentFilter, setPaymentFilter] = createSignal("");
  const [dateFrom, setDateFrom] = createSignal("");
  const [dateTo, setDateTo] = createSignal("");
  const [page, setPage] = createSignal(1);
  const limit = 10;

  createEffect(() => {
    const sidebarStatus = searchParams.status as string | undefined;
    if (sidebarStatus) {
      const mapped = mapSidebarStatusParam(sidebarStatus);
      if (mapped) setStatusFilter(mapped);
    }
  });

  const filterParams = createMemo(() => ({
    search: searchQuery() || undefined,
    orderStatus: (statusFilter() || undefined) as OrderStatus | undefined,
    paymentStatus: (paymentFilter() || undefined) as PaymentStatus | undefined,
    dateFrom: dateFrom() || undefined,
    dateTo: dateTo() || undefined,
    page: page(),
    limit,
  }));

  const resetPage = () => setPage(1);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    page,
    setPage,
    limit,
    filterParams,
    resetPage,
  };
}
