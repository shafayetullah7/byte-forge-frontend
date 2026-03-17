import { fetcher } from "../api-client";
import { ApiError } from "../types";
import type {
  BusinessAccount,
  CreateBusinessAccountRequest,
  Shop,
  CreateShopRequest,
  Plant,
  PlantFilter,
  CreatePlantRequest,
  UpdatePlantRequest,
} from "../types/seller.types";

/**
 * Seller API endpoints
 *
 * Refactored to use the functional fetcher with unwrapped responses.
 */
export const sellerApi = {
  /**
   * Business Account management
   */
  businessAccount: {
    /**
     * Create/Setup a business account
     */
    create: async (
      data: CreateBusinessAccountRequest
    ): Promise<BusinessAccount> => {
      return fetcher<BusinessAccount>("/api/v1/user/seller/business-account", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    /**
     * Get current user's business account
     */
    get: async (): Promise<BusinessAccount> => {
      return fetcher<BusinessAccount>("/api/v1/user/seller/business-account");
    },
  },

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
     * Create a new shop
     */
    create: async (data: CreateShopRequest): Promise<Shop> => {
      return fetcher<Shop>("/api/v1/user/seller/shops/apply", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    /**
     * Get user's shops
     */
    getAll: async (): Promise<Shop[]> => {
      return fetcher<Shop[]>("/api/v1/user/seller/shops");
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
