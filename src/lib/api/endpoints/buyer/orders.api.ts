import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type { OrderListResponse, OrderFilterParams, OrderStats } from "../../types/order.types";

const BASE_PATH = "/api/v1/user/buyer/orders";

export const getOrders = query(
  async (params?: OrderFilterParams): Promise<OrderListResponse> => {
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.sortBy !== undefined) queryParams.sortBy = params.sortBy;
      if (params.sortOrder !== undefined) queryParams.sortOrder = params.sortOrder;
      if (params.orderStatus !== undefined) queryParams.orderStatus = params.orderStatus;
      if (params.paymentStatus !== undefined) queryParams.paymentStatus = params.paymentStatus;
      if (params.search !== undefined) queryParams.search = params.search;
    }
    return fetcher<OrderListResponse>(BASE_PATH, { params: queryParams });
  },
  "buyer-orders"
);

export const getOrdersStats = query(
  async (): Promise<OrderStats> => {
    const res = await fetcher<OrderListResponse>(BASE_PATH, { params: { limit: 1 } });
    return res.stats;
  },
  "buyer-orders-stats"
);

export const invalidateOrders = () => revalidate(getOrders.keyFor());

export const invalidateAllOrders = () => {
  revalidate(getOrders.keyFor());
};
