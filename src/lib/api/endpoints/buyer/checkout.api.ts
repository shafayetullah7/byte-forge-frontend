import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type { PriceBreakdownResponse } from "../../types/checkout.types";

/**
 * Calculate price breakdown for checkout
 * Uses query() for SSR support and caching
 */
export const calculatePriceBreakdown = query(
  async (districtId: string): Promise<PriceBreakdownResponse> => {
    return fetcher<PriceBreakdownResponse>(
      "/api/v1/user/buyer/checkout/price-breakdown",
      { params: { districtId } }
    );
  },
  "buyer-checkout-price-breakdown"
);

/**
 * Checkout API
 */
export const checkoutApi = {
  calculatePriceBreakdown,
};
