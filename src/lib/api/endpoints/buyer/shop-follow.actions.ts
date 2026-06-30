import { action } from "@solidjs/router";
import { followShop, unfollowShop } from "./shop-follow.api";
import { ApiError } from "~/lib/api/types";

export type ShopFollowMutationResult =
  | { success: true; following: boolean }
  | { success: false; error: { message: string; statusCode?: number } };

export const toggleShopFollowAction = action(
  async (input: { slug: string; follow: boolean }): Promise<ShopFollowMutationResult> => {
    "use server";
    try {
      if (input.follow) {
        await followShop(input.slug);
      } else {
        await unfollowShop(input.slug);
      }
      return { success: true, following: input.follow };
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
  "toggle-shop-follow",
);
