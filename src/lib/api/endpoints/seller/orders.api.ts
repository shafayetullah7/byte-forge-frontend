import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import { ApiError } from "../../types";
import type {
  CancelSellerOrderRequest,
  SellerOrderDetail,
  SellerOrderFilterParams,
  SellerOrderListResponse,
  SellerOrderStats,
  ShipSellerOrderRequest,
  UpdateSellerOrderStatusRequest,
} from "../../types/seller-orders.types";

const BASE_PATH = "/api/v1/user/seller/orders";

export const getSellerOrders = query(
  async (params?: SellerOrderFilterParams): Promise<SellerOrderListResponse> => {
    "use server";
    const queryParams: Record<string, string | number | undefined> = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.sortBy !== undefined) queryParams.sortBy = params.sortBy;
      if (params.sortOrder !== undefined) queryParams.sortOrder = params.sortOrder;
      if (params.orderStatus !== undefined) queryParams.orderStatus = params.orderStatus;
      if (params.paymentStatus !== undefined) queryParams.paymentStatus = params.paymentStatus;
      if (params.search !== undefined) queryParams.search = params.search;
      if (params.dateFrom !== undefined) queryParams.dateFrom = params.dateFrom;
      if (params.dateTo !== undefined) queryParams.dateTo = params.dateTo;
    }

    return fetcher<SellerOrderListResponse>(BASE_PATH, {
      params: queryParams,
      unwrapData: false,
    });
  },
  "seller-orders"
);

export const getSellerOrderStats = query(
  async (): Promise<SellerOrderStats> => {
    "use server";
    return fetcher<SellerOrderStats>(`${BASE_PATH}/stats`);
  },
  "seller-orders-stats"
);

export const getSellerOrder = query(
  async (orderId: string): Promise<SellerOrderDetail | null> => {
    "use server";
    try {
      return await fetcher<SellerOrderDetail>(`${BASE_PATH}/${orderId}`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },
  "seller-order-detail"
);

export const updateSellerOrderStatus = async (
  orderId: string,
  body: UpdateSellerOrderStatusRequest
): Promise<SellerOrderDetail> => {
  return fetcher<SellerOrderDetail>(`${BASE_PATH}/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

export const shipSellerOrder = async (
  orderId: string,
  body: ShipSellerOrderRequest
): Promise<SellerOrderDetail> => {
  return fetcher<SellerOrderDetail>(`${BASE_PATH}/${orderId}/ship`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const cancelSellerOrder = async (
  orderId: string,
  body: CancelSellerOrderRequest
): Promise<SellerOrderDetail> => {
  return fetcher<SellerOrderDetail>(`${BASE_PATH}/${orderId}/cancel`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

export const invalidateSellerOrders = () => {
  revalidate(getSellerOrders.keyFor());
  revalidate(getSellerOrderStats.keyFor());
};

export const invalidateSellerOrderDetail = (orderId: string) => {
  revalidate(getSellerOrder.keyFor(orderId));
};

export const invalidateAllSellerOrderCaches = (orderId: string) => {
  invalidateSellerOrders();
  invalidateSellerOrderDetail(orderId);
};

export const sellerOrdersApi = {
  list: getSellerOrders,
  stats: getSellerOrderStats,
  get: getSellerOrder,
  updateStatus: updateSellerOrderStatus,
  ship: shipSellerOrder,
  cancel: cancelSellerOrder,
};
