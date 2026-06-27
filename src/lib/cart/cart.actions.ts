import { action } from "@solidjs/router";
import {
  invalidateAllCart,
  removeCartItem,
  updateCartItem,
} from "~/lib/api/endpoints/buyer/cart.api";
import { ApiError } from "~/lib/api/types";

export type CartMutationResult =
  | { success: true }
  | { success: false; error: { message: string; statusCode?: number } };

export const updateCartItemAction = action(
  async (input: { itemId: string; quantity: number }): Promise<CartMutationResult> => {
    "use server";
    try {
      await updateCartItem(input.itemId, { quantity: input.quantity });
      invalidateAllCart();
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
  },
  "update-cart-item",
);

export const removeCartItemAction = action(
  async (input: { itemId: string }): Promise<CartMutationResult> => {
    "use server";
    try {
      await removeCartItem(input.itemId);
      invalidateAllCart();
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
  },
  "remove-cart-item",
);
