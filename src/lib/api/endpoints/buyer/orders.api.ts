import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type { OrderListResponse, OrderFilterParams, OrderStats, Order } from "../../types/order.types";

const BASE_PATH = "/api/v1/user/buyer/orders";

/**
 * Get paginated orders
 */
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
    return fetcher<OrderListResponse>(BASE_PATH, {
      params: queryParams,
      unwrapData: false,
    });
  },
  "buyer-orders"
);

/**
 * Get order statistics
 */
export const getOrdersStats = query(
  async (): Promise<OrderStats> => {
    return fetcher<OrderStats>(`${BASE_PATH}/stats`);
  },
  "buyer-orders-stats"
);

/**
 * Get single order by ID
 */
export const getOrderById = query(
  async (orderId: string): Promise<Order> => {
    return fetcher<Order>(`${BASE_PATH}/${orderId}`);
  },
  "buyer-order-detail"
);

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId: string): Promise<Order> => {
  return fetcher<Order>(`${BASE_PATH}/${orderId}/cancel`, {
    method: "POST",
  });
};

/**
 * Invalidate orders cache
 */
export const invalidateOrders = () => revalidate(getOrders.keyFor());

/**
 * Invalidate order stats cache
 */
export const invalidateOrdersStats = () => revalidate(getOrdersStats.keyFor());

/**
 * Invalidate all orders-related caches
 */
export const invalidateAllOrders = () => {
  revalidate(getOrders.keyFor());
  revalidate(getOrdersStats.keyFor());
};

/**
 * Orders API endpoints
 */
export const ordersApi = {
  get: getOrders,
  getStats: getOrdersStats,
  getById: getOrderById,
  cancel: cancelOrder,
};
