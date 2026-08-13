import { action } from "@solidjs/router";
import { ApiError } from "../../types";
import type {
  CreateSubscriptionCheckoutPayload,
  RedeemSubscriptionCouponPayload,
  SellerSubscription,
  SubscriptionBillingPortalSession,
  SubscriptionCheckoutSession,
} from "../../types/seller/subscription.types";
import {
  createSellerSubscriptionBillingPortal,
  createSellerSubscriptionCheckout,
  redeemSellerSubscriptionCoupon,
} from "./subscription.api";

export type SubscriptionMutationResult<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; statusCode?: number } };

function mutationError(error: unknown): { message: string; statusCode?: number } {
  const apiError = error as ApiError;
  return {
    statusCode: apiError.statusCode,
    message: apiError.response?.message ?? apiError.message,
  };
}

export const redeemSubscriptionCouponAction = action(
  async (
    payload: RedeemSubscriptionCouponPayload,
  ): Promise<SubscriptionMutationResult<SellerSubscription>> => {
    "use server";
    try {
      const data = await redeemSellerSubscriptionCoupon(payload);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: mutationError(error) };
    }
  },
  "redeem-subscription-coupon",
);

export const createSubscriptionCheckoutAction = action(
  async (
    payload: CreateSubscriptionCheckoutPayload,
  ): Promise<SubscriptionMutationResult<SubscriptionCheckoutSession>> => {
    "use server";
    try {
      const data = await createSellerSubscriptionCheckout(payload);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: mutationError(error) };
    }
  },
  "create-subscription-checkout",
);

export const createSubscriptionBillingPortalAction = action(
  async (): Promise<SubscriptionMutationResult<SubscriptionBillingPortalSession>> => {
    "use server";
    try {
      const data = await createSellerSubscriptionBillingPortal();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: mutationError(error) };
    }
  },
  "create-subscription-billing-portal",
);
