import { fetcher } from "../api-client";
import { ApiError } from "../types";
import type {
  Shop,
  ShopStatus,
  ApplyAsSellerRequest,
  Plant,
  PlantFilter,
  CreatePlantRequest,
  UpdatePlantRequest,
  VerificationStatus,
  UpdateVerificationRequest,
} from "../types/seller.types";

/**
 * Seller API endpoints
 *
 * Refactored to use the functional fetcher with unwrapped responses.
 */
export const sellerApi = {
  /**
   * Shop management
   */
  shops: {
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
        return await fetcher<ShopStatus>(
          "/api/v1/user/seller/shops/my-shop/status"
        );
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
        // Re-throw to let the caller handle errors (e.g., display toast)
        throw error;
      }
    },

    /**
     * Get user's shops
     */
    getAll: async (): Promise<Shop[]> => {
      return fetcher<Shop[]>("/api/v1/user/seller/shops");
    },

    /**
     * Shop Verification
     */
    verification: {
      /**
       * Get shop verification status
       * Returns null if no verification record exists (404 handled gracefully)
       */
      getStatus: async (): Promise<VerificationStatus | null> => {
        try {
          return await fetcher<VerificationStatus>(
            "/api/v1/user/seller/shops/my-shop/verification"
          );
        } catch (error: any) {
          if (error instanceof ApiError && error.statusCode === 404) {
            return null;
          }
          throw error;
        }
      },

      /**
       * Update verification documents
       */
      update: async (
        data: UpdateVerificationRequest
      ): Promise<VerificationStatus> => {
        return fetcher<VerificationStatus>(
          "/api/v1/user/seller/shops/my-shop/verification",
          {
            method: "PATCH",
            body: JSON.stringify(data),
          }
        );
      },
    },
  },

  /**
   * Plant/Product management
   */
  plants: {
    /**
     * Create a new plant
     */
    create: async (data: CreatePlantRequest): Promise<Plant> => {
      return fetcher<Plant>("/api/v1/user/seller/plants", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    /**
     * Get all plants (with filtering)
     */
    getAll: async (filter?: PlantFilter): Promise<Plant[]> => {
      return fetcher<Plant[]>("/api/v1/user/seller/plants", {
        params: filter as any,
      });
    },

    /**
     * Get plant by ID
     */
    getById: async (id: string): Promise<Plant> => {
      return fetcher<Plant>(`/api/v1/user/seller/plants/${id}`);
    },

    /**
     * Update plant details
     */
    update: async (id: string, data: UpdatePlantRequest): Promise<Plant> => {
      return fetcher<Plant>(`/api/v1/user/seller/plants/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },

    /**
     * Delete a plant
     */
    delete: async (id: string): Promise<void> => {
      return fetcher<void>(`/api/v1/user/seller/plants/${id}`, {
        method: "DELETE",
      });
    },
  },
};
