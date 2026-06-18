import { action } from "@solidjs/router";
import {
  cancelOrder,
  confirmDelivery,
  invalidateAllOrders,
} from "~/lib/api/endpoints/buyer/orders.api";
import { createReview } from "~/lib/api/endpoints/buyer/reviews.api";
import { ApiError } from "~/lib/api/types";

export interface CancelOrderActionData {
  orderId: string;
  groupId: string;
  reason?: string;
}

export interface ConfirmDeliveryActionData {
  orderId: string;
  groupId: string;
}

export interface SubmitReviewActionData {
  groupId: string;
  orderItemId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export const cancelOrderAction = action(async (input: CancelOrderActionData) => {
  "use server";
  try {
    await cancelOrder(input.orderId, input.reason);
    invalidateAllOrders(input.groupId);
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

export const confirmDeliveryAction = action(async (input: ConfirmDeliveryActionData) => {
  "use server";
  try {
    await confirmDelivery(input.orderId);
    invalidateAllOrders(input.groupId);
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
}, "confirm-delivery-action");

export const submitReviewAction = action(async (input: SubmitReviewActionData) => {
  "use server";
  try {
    await createReview({
      orderItemId: input.orderItemId,
      rating: input.rating,
      title: input.title,
      comment: input.comment,
    });
    invalidateAllOrders(input.groupId);
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
}, "submit-review-action");
