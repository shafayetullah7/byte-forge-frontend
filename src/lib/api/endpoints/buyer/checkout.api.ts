import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type { PriceBreakdownResponse, PlaceOrderResponse, PaymentMethod } from "../../types/checkout.types";

export interface CalculatePriceBreakdownRequest {
  addressId: string;
  itemIds: string[];
}

export interface PlaceOrderRequest {
  addressId: string;
  itemIds: string[];
  paymentMethod: PaymentMethod;
  notes?: string;
}

/**
 * Calculate price breakdown for checkout
 * Uses query() with POST for SSR support and caching
 */
export const calculatePriceBreakdown = query(
  async (request: CalculatePriceBreakdownRequest): Promise<PriceBreakdownResponse> => {
    return fetcher<PriceBreakdownResponse>(
      "/api/v1/user/buyer/checkout/price-breakdown",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  },
  "buyer-checkout-price-breakdown"
);

/**
 * Place order with Cash on Delivery
 */
export const placeOrder = async (request: PlaceOrderRequest): Promise<PlaceOrderResponse> => {
  return fetcher<PlaceOrderResponse>(
    "/api/v1/user/buyer/checkout/place-order",
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
};
