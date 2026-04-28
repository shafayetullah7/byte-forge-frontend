import type {
  Shop,
  ShopStatus,
  ApplyAsSellerRequest,
  PlantListItem,
  PlantListResponse,
  PlantFilter,
  CreatePlantRequest,
  CreatePlantResponse,
  VerificationStatus,
  UpdateVerificationRequest,
} from "../types/seller.types";
import { sellerShopsApi } from "./shops.api";
import { sellerVerificationApi } from "./verification.api";
import { plantsApi } from "./plants.api";

/**
 * Seller API endpoints
 *
 * Barrel file that re-exports all seller-related APIs.
 * Individual modules: shops.api.ts, verification.api.ts, plants.api.ts
 */
export const sellerApi = {
  /**
   * Shop management
   */
  shops: sellerShopsApi,

  /**
   * Shop verification
   */
  verification: sellerVerificationApi,

  /**
   * Plant/Product management
   */
  plants: plantsApi,
};

// Re-export types for convenience
export type {
  Shop,
  ShopStatus,
  ApplyAsSellerRequest,
  PlantListItem,
  PlantListResponse,
  PlantFilter,
  CreatePlantRequest,
  CreatePlantResponse,
  VerificationStatus,
  UpdateVerificationRequest,
};
