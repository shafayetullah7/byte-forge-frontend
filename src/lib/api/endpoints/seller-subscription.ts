/**
 * Seller subscription API — typed client for Phases 10–15 backend routes.
 * UI consumes these from Phase 21 onward.
 */
export type {
  SubscriptionStatus,
  SubscriptionPlan,
  SubscriptionInvoice,
  SubscriptionBillingProvider,
  SubscriptionPlanInterval,
  SellerSubscription,
  SubscriptionCheckoutSession,
  SubscriptionBillingPortalSession,
  SubscriptionInvoiceListResponse,
  RedeemSubscriptionCouponPayload,
  CreateSubscriptionCheckoutPayload,
  ListSubscriptionInvoicesParams,
} from "../types/seller/subscription.types";

export {
  getSellerSubscription,
  getSellerSubscriptionInvoices,
  redeemSellerSubscriptionCoupon,
  createSellerSubscriptionCheckout,
  createSellerSubscriptionBillingPortal,
  invalidateSellerSubscription,
  invalidateSellerSubscriptionInvoices,
} from "./seller/subscription.api";

export {
  redeemSubscriptionCouponAction,
  createSubscriptionCheckoutAction,
  createSubscriptionBillingPortalAction,
  type SubscriptionMutationResult,
} from "./seller/subscription.actions";
