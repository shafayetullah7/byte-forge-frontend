import { sellerShopsApi } from "./shops.api";
import { sellerVerificationApi } from "./verification.api";
import { plantsApi, getPlants, getPlantById, createPlant, updatePlant, updatePlantStatus, deletePlant, invalidatePlant, invalidatePlants, invalidateAllPlantCaches } from "./plants.api";
import { productsApi, getProducts } from "./products.api";

export { sellerShopApi } from "./shop-detail.api";
export { getPlants, getPlantById, createPlant, updatePlant, updatePlantStatus, deletePlant, invalidatePlant, invalidatePlants, invalidateAllPlantCaches };
export { getProducts };
export { getShippingRates, bulkUpdateShippingRates } from "./shipping-rates.api";
export {
  getSellerStorefront,
  updateStorefrontProfile,
  replaceWhyChooseUs,
  replaceValuePoints,
  invalidateSellerStorefront,
} from "./storefront.api";
export {
  getSellerAnalyticsOverview,
  invalidateSellerAnalytics,
} from "./analytics.api";
export {
  getSellerCampaigns,
  getSellerCampaign,
  invalidateSellerCampaigns,
} from "./campaigns.api";
export {
  createCampaignAction,
  updateCampaignAction,
  submitCampaignAction,
  archiveCampaignAction,
  deleteCampaignAction,
} from "./campaigns.actions";
export {
  getSellerArticles,
  getSellerArticle,
  invalidateSellerArticles,
} from "./articles.api";
export {
  createArticleAction,
  updateArticleAction,
  submitArticleAction,
  archiveArticleAction,
  deleteArticleAction,
} from "./articles.actions";
export {
  getSellerOrders,
  getSellerOrderStats,
  getSellerOrder,
  updateSellerOrderStatus,
  shipSellerOrder,
  cancelSellerOrder,
  sellerOrdersApi,
} from "./orders.api";
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
  ShippingRateWithDistrict,
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
   * Plant/Product management
   */
  plants: plantsApi,

  /**
   * All Products management
   */
  products: productsApi,
};
