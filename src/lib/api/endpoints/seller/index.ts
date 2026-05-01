import { sellerShopsApi } from "./shops.api";
import { sellerVerificationApi } from "./verification.api";
import { plantsApi } from "./plants.api";

export { sellerShopApi } from "./shop-detail.api";
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
} from "../../types/seller.types";

/**
 * Seller API endpoints
 *
 * Barrel file that re-exports all seller-related APIs.
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
