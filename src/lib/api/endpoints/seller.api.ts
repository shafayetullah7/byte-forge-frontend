import { api } from "../api-client";
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
import type { ApiResponse } from "../types";

/**
 * Seller API endpoints
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
    ): Promise<ApiResponse<BusinessAccount>> => {
      return api.post<ApiResponse<BusinessAccount>>(
        "/api/v1/user/seller/business-account",
        data
      );
    },

    /**
     * Get current user's business account
     */
    get: async (): Promise<ApiResponse<BusinessAccount>> => {
      return api.get<ApiResponse<BusinessAccount>>(
        "/api/v1/user/seller/business-account"
      );
    },
  },

  /**
   * Shop management
   */
  shops: {
    /**
     * Create a new shop
     */
    create: async (data: CreateShopRequest): Promise<ApiResponse<Shop>> => {
      return api.post<ApiResponse<Shop>>("/api/v1/user/seller/shops", data);
    },

    /**
     * Get user's shops
     */
    getAll: async (): Promise<ApiResponse<Shop[]>> => {
      return api.get<ApiResponse<Shop[]>>("/api/v1/user/seller/shops");
    },
  },

  /**
   * Plant/Product management
   */
  plants: {
    /**
     * Create a new plant
     */
    create: async (data: CreatePlantRequest): Promise<ApiResponse<Plant>> => {
      return api.post<ApiResponse<Plant>>("/api/v1/user/seller/plants", data);
    },

    /**
     * Get all plants (with filtering)
     */
    getAll: async (filter?: PlantFilter): Promise<ApiResponse<Plant[]>> => {
      return api.get<ApiResponse<Plant[]>>("/api/v1/user/seller/plants", {
        params: filter as any,
      });
    },

    /**
     * Get plant by ID
     */
    getById: async (id: string): Promise<ApiResponse<Plant>> => {
      return api.get<ApiResponse<Plant>>(`/api/v1/user/seller/plants/${id}`);
    },

    /**
     * Update plant details
     */
    update: async (
      id: string,
      data: UpdatePlantRequest
    ): Promise<ApiResponse<Plant>> => {
      return api.patch<ApiResponse<Plant>>(
        `/api/v1/user/seller/plants/${id}`,
        data
      );
    },

    /**
     * Delete a plant
     */
    delete: async (id: string): Promise<void> => {
      return api.delete(`/api/v1/user/seller/plants/${id}`);
    },
  },
};
