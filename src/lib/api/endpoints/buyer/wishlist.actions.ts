import { action } from "@solidjs/router";
import { addWishlistItem, removeWishlistItem } from "./wishlist.api";
import { ApiError } from "~/lib/api/types";

export type WishlistMutationResult =
  | { success: true }
  | { success: false; error: { message: string; statusCode?: number } };

export const addToWishlistAction = action(
  async (input: { variantId: string }): Promise<WishlistMutationResult> => {
    "use server";
    try {
      await addWishlistItem(input.variantId);
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
  "add-to-wishlist",
);

export const removeFromWishlistAction = action(
  async (input: { variantId: string }): Promise<WishlistMutationResult> => {
    "use server";
    try {
      await removeWishlistItem(input.variantId);
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
  "remove-from-wishlist",
);
