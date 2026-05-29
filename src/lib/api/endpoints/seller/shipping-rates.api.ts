import { fetcher } from "../../api-client";
import type {
  ShippingRate,
  BulkUpdateShippingRatesRequest,
} from "../../types/seller.types";

/**
 * Seller Shipping Rates API endpoints
 */
export const sellerShippingRatesApi = {
  /**
   * Get shipping rates for the current shop
   */
  get: async (): Promise<ShippingRate[]> => {
    return fetcher<ShippingRate[]>("/api/v1/user/seller/shipping-rates/my-shop");
  },

  /**
   * Bulk update shipping rates for the current shop
   * Only updates the districts provided in the request
   */
  bulkUpdate: async (
    data: BulkUpdateShippingRatesRequest
  ): Promise<ShippingRate[]> => {
    return fetcher<ShippingRate[]>(
      "/api/v1/user/seller/shipping-rates/my-shop",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },
};
