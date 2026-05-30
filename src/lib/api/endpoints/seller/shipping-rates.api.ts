import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  ShippingRate,
  ShippingRateWithDistrict,
  BulkUpdateShippingRatesRequest,
} from "../../types/seller.types";

/**
 * Get shipping rates for the current shop
 * Returns all 64 districts with their configured cost (defaults to "0")
 */
export const getShippingRates = query(
  async (): Promise<ShippingRateWithDistrict[]> => {
    return fetcher<ShippingRateWithDistrict[]>(
      "/api/v1/user/seller/shipping-rates/my-shop"
    );
  },
  "seller-shipping-rates"
);

/**
 * Bulk update shipping rates for the current shop
 * Only updates the districts provided in the request
 */
export const bulkUpdateShippingRates = async (
  data: BulkUpdateShippingRatesRequest
): Promise<ShippingRate[]> => {
  return fetcher<ShippingRate[]>(
    "/api/v1/user/seller/shipping-rates/my-shop",
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
};
