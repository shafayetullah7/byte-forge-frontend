import { action } from "@solidjs/router";
import { placeOrder } from "~/lib/api/endpoints/buyer/checkout.api";
import type { PlaceOrderRequest } from "~/lib/api/endpoints/buyer/checkout.api";
import { invalidateAllCart } from "~/lib/api/endpoints/buyer/cart.api";
import type { PlaceOrderResponse } from "~/lib/api/types/checkout.types";
import { ApiError } from "~/lib/api/types";
import { readApiErrorCode } from "~/lib/api/read-api-error-code";

export type PlaceOrderActionResult =
  | { success: true; data: PlaceOrderResponse }
  | { success: false; error: { message: string; statusCode?: number; code?: string } };

export const placeOrderAction = action(
  async (input: PlaceOrderRequest): Promise<PlaceOrderActionResult> => {
    "use server";
    try {
      const result = await placeOrder(input);
      invalidateAllCart();
      return { success: true, data: result };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: {
          statusCode: apiError.statusCode,
          message: apiError.response?.message ?? apiError.message,
          code: readApiErrorCode(apiError.response),
        },
      };
    }
  },
  "place-order",
);
