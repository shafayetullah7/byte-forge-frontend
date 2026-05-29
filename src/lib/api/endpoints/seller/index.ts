import { sellerShopsApi } from "./shops.api";
import { sellerVerificationApi } from "./verification.api";
import { plantsApi, getPlants, getPlantById, createPlant, updatePlant, deletePlant } from "./plants.api";
import { productsApi, getProducts } from "./products.api";
import { sellerShippingRatesApi } from "./shipping-rates.api";

export { sellerShopApi } from "./shop-detail.api";
export { getPlants, getPlantById, createPlant, updatePlant, deletePlant };
export { getProducts };
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
  ProductType,
  ProductListItem,
  ProductListResponse,
  ProductFilter,
  ShippingRate,
  BulkUpdateShippingRatesRequest,
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
   * Shipping rates per district
   */
  shippingRates: sellerShippingRatesApi,

  /**
   * Plant/Product management
   */
  plants: plantsApi,

  /**
   * All Products management
   */
  products: productsApi,
};
