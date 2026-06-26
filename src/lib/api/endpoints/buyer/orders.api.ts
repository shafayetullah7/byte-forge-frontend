import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  OrderListResponse,
  OrderFilterParams,
  OrderStats,
  OrderGroupDetailResponse,
} from "../../types/order.types";

const BASE_PATH = "/api/v1/user/buyer/orders";

/**
 * Get paginated orders
 */
export const getOrders = query(
  async (params?: OrderFilterParams): Promise<OrderListResponse> => {
    "use server";
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
    "use server";
    return fetcher<OrderStats>(`${BASE_PATH}/stats`);
  },
  "buyer-orders-stats"
);

/**
 * Get detailed order group with all orders, items, addresses, and status history
 */
export const getOrderGroup = query(
  async (groupId: string): Promise<OrderGroupDetailResponse> => {
    "use server";
    return fetcher<OrderGroupDetailResponse>(`${BASE_PATH}/${groupId}`, {
      unwrapData: false,
    });
  },
  "buyer-order-group-detail"
);

/**
 * Cancel an order
 */
export const cancelOrder = async (
  orderId: string,
  reason?: string
): Promise<void> => {
  await fetcher<null>(`${BASE_PATH}/${orderId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
};

/**
 * Confirm order delivery (buyer)
 */
export const confirmDelivery = async (orderId: string): Promise<void> => {
  await fetcher<null>(`${BASE_PATH}/${orderId}/confirm-delivery`, {
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
export const invalidateAllOrders = (groupId?: string) => {
  revalidate(getOrders.keyFor());
  revalidate(getOrdersStats.keyFor());
  if (groupId) {
    revalidate(getOrderGroup.keyFor(groupId));
  }
};

/**
 * Orders API endpoints
 */
export const ordersApi = {
  get: getOrders,
  getStats: getOrdersStats,
  getGroup: getOrderGroup,
  cancel: cancelOrder,
  confirmDelivery,
};
