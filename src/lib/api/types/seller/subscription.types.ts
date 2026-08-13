export type SubscriptionStatus = "NONE" | "ACTIVE" | "EXPIRED";

export type SubscriptionBillingProvider =
  | "NONE"
  | "COUPON"
  | "STRIPE"
  | "ADMIN"
  | "WALLET";

export type SubscriptionPlanInterval = "MONTH" | "YEAR";

/** Plan row sellers can purchase (from GET subscription.availablePlans). */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  interval: SubscriptionPlanInterval;
  priceBdt: string;
  isActiveForNew: boolean;
  isRetired: boolean;
  stripeProductId: string | null;
  stripePriceId: string | null;
  previousStripePriceIds: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Invoice row from GET subscription/invoices. */
export interface SubscriptionInvoice {
  id: string;
  amountBdt: string;
  currency: string;
  provider: string;
  status: string;
  receiptUrl: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  paidAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface SellerSubscription {
  status: SubscriptionStatus;
  /** Real entitlement — not affected by platform enforcement flag. */
  active: boolean;
  currentPeriodEnd: string | null;
  billingProvider: SubscriptionBillingProvider;
  cancelAtPeriodEnd: boolean;
  availablePlans: SubscriptionPlan[];
}

export interface SubscriptionInvoiceListResponse {
  success: boolean;
  message: string;
  data: SubscriptionInvoice[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SubscriptionCheckoutSession {
  url: string;
  sessionId: string;
}

export interface SubscriptionBillingPortalSession {
  url: string;
}

export interface RedeemSubscriptionCouponPayload {
  code: string;
}

export interface CreateSubscriptionCheckoutPayload {
  planId: string;
}

export interface ListSubscriptionInvoicesParams {
  page?: number;
  limit?: number;
}

type SuccessEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type SellerSubscriptionResponse = SuccessEnvelope<SellerSubscription>;
export type SubscriptionCheckoutResponse = SuccessEnvelope<SubscriptionCheckoutSession>;
export type SubscriptionBillingPortalResponse = SuccessEnvelope<SubscriptionBillingPortalSession>;
