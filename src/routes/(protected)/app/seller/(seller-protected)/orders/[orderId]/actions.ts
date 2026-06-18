import { action, revalidate } from "@solidjs/router";
import {
  cancelSellerOrder,
  getSellerOrder,
  invalidateAllSellerOrderCaches,
  shipSellerOrder,
  updateSellerOrderStatus,
} from "~/lib/api/endpoints/seller/orders.api";
import type {
  CancelSellerOrderRequest,
  ShipSellerOrderRequest,
  UpdateSellerOrderStatusRequest,
} from "~/lib/api/types/seller-orders.types";
import { ApiError } from "~/lib/api/types";

export type SellerOrderMutationResult =
  | { success: true }
  | {
      success: false;
      stale?: boolean;
      error: { statusCode?: number; message: string };
    };

async function runSellerOrderMutation(
  orderId: string,
  mutation: () => Promise<unknown>,
): Promise<SellerOrderMutationResult> {
  try {
    await mutation();
    invalidateAllSellerOrderCaches(orderId);
    return { success: true };
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.statusCode === 409) {
      revalidate(getSellerOrder.keyFor(orderId));
      invalidateAllSellerOrderCaches(orderId);
      return {
        success: false,
        stale: true,
        error: {
          statusCode: 409,
          message: apiError.response?.message ?? apiError.message,
        },
      };
    }

    return {
      success: false,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.response?.message ?? apiError.message,
      },
    };
  }
}

export interface SellerOrderStatusActionData extends UpdateSellerOrderStatusRequest {
  orderId: string;
}

export interface SellerOrderShipActionData extends ShipSellerOrderRequest {
  orderId: string;
}

export interface SellerOrderCancelActionData extends CancelSellerOrderRequest {
  orderId: string;
}

export const updateSellerOrderStatusAction = action(
  async (input: SellerOrderStatusActionData) => {
    "use server";
    const { orderId, ...body } = input;
    return runSellerOrderMutation(orderId, () => updateSellerOrderStatus(orderId, body));
  },
  "seller-update-order-status",
);

export const shipSellerOrderAction = action(
  async (input: SellerOrderShipActionData) => {
    "use server";
    const { orderId, ...body } = input;
    return runSellerOrderMutation(orderId, () => shipSellerOrder(orderId, body));
  },
  "seller-ship-order",
);

export const cancelSellerOrderAction = action(
  async (input: SellerOrderCancelActionData) => {
    "use server";
    const { orderId, ...body } = input;
    return runSellerOrderMutation(orderId, () => cancelSellerOrder(orderId, body));
  },
  "seller-cancel-order",
);
