import { fetcher } from "../api-client";
import { ApiError } from "../types";
import type {
  Shop,
  ShopStatus,
  ApplyAsSellerRequest,
} from "../types/seller.types";

/**
 * Seller Shops API endpoints
 */
export const sellerShopsApi = {
  /**
   * Get current user's shop
   * Returns null if user has no shop (404 handled gracefully)
   */
  getMyShop: async (): Promise<Shop | null> => {
    try {
      return await fetcher<Shop>("/api/v1/user/seller/shops/my-shop");
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Get shop status for routing decisions
   * Returns null if user has no shop (404 handled gracefully)
   */
  getMyShopStatus: async (): Promise<ShopStatus | null> => {
    try {
      return await fetcher<ShopStatus>("/api/v1/user/seller/shops/my-shop/status");
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Apply to create a new shop (become a seller)
   */
  create: async (data: ApplyAsSellerRequest): Promise<Shop> => {
    try {
      return await fetcher<Shop>("/api/v1/user/seller/shops/apply", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Get user's shops
   */
  getAll: async (): Promise<Shop[]> => {
    return fetcher<Shop[]>("/api/v1/user/seller/shops");
  },
};
