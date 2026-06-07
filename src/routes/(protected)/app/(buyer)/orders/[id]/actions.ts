import { action, revalidate } from "@solidjs/router";
import { cancelOrder, invalidateAllOrders, getOrderGroup } from "~/lib/api/endpoints/buyer/orders.api";
import { ApiError } from "~/lib/api/types";

export interface CancelOrderActionData {
  orderId: string;
  groupId: string;
}

export const cancelOrderAction = action(async (input: CancelOrderActionData) => {
  "use server";
  try {
    await cancelOrder(input.orderId);
    invalidateAllOrders();
    revalidate(getOrderGroup.keyFor(input.groupId));
    return { success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.response?.message ?? apiError.message,
      },
    };
  }
}, "cancel-order-action");
