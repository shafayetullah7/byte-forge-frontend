import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  CreateSubscriptionCheckoutPayload,
  ListSubscriptionInvoicesParams,
  RedeemSubscriptionCouponPayload,
  SellerSubscription,
  SubscriptionBillingPortalSession,
  SubscriptionCheckoutSession,
  SubscriptionInvoiceListResponse,
} from "../../types/seller/subscription.types";

const BASE_PATH = "/api/v1/user/seller/subscription";

type SuccessEnvelope<T> = { success: boolean; message: string; data: T };

/** GET /user/seller/subscription — status + available plans (Phase 10). */
export const getSellerSubscription = query(
  async () => {
    "use server";
    return fetcher<SellerSubscription>(BASE_PATH);
  },
  "seller-subscription",
);

/** GET /user/seller/subscription/invoices — paginated invoice history (Phase 12). */
export const getSellerSubscriptionInvoices = query(
  async (params?: ListSubscriptionInvoicesParams) => {
    "use server";
    return fetcher<SubscriptionInvoiceListResponse>(`${BASE_PATH}/invoices`, {
      params: params as Record<string, string | number | undefined>,
      unwrapData: false,
    });
  },
  "seller-subscription-invoices",
);

/** POST /user/seller/subscription/coupon/redeem (Phase 11). */
export async function redeemSellerSubscriptionCoupon(
  payload: RedeemSubscriptionCouponPayload,
): Promise<SellerSubscription> {
  const response = await fetcher<SuccessEnvelope<SellerSubscription>>(
    `${BASE_PATH}/coupon/redeem`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      unwrapData: false,
    },
  );
  invalidateSellerSubscription();
  return response.data;
}

/** POST /user/seller/subscription/checkout (Phase 13). */
export async function createSellerSubscriptionCheckout(
  payload: CreateSubscriptionCheckoutPayload,
): Promise<SubscriptionCheckoutSession> {
  const response = await fetcher<SuccessEnvelope<SubscriptionCheckoutSession>>(
    `${BASE_PATH}/checkout`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      unwrapData: false,
    },
  );
  invalidateSellerSubscription();
  return response.data;
}

/** POST /user/seller/subscription/billing-portal (Phase 15). */
export async function createSellerSubscriptionBillingPortal(): Promise<SubscriptionBillingPortalSession> {
  const response = await fetcher<SuccessEnvelope<SubscriptionBillingPortalSession>>(
    `${BASE_PATH}/billing-portal`,
    {
      method: "POST",
      unwrapData: false,
    },
  );
  return response.data;
}

export const invalidateSellerSubscription = () => {
  revalidate(getSellerSubscription.keyFor());
  revalidate(getSellerSubscriptionInvoices.keyFor());
};

export const invalidateSellerSubscriptionInvoices = (
  params?: ListSubscriptionInvoicesParams,
) => {
  revalidate(getSellerSubscriptionInvoices.keyFor(params));
};
