import type { Translator } from "~/i18n";

const ERROR_MESSAGE_KEYS: Record<string, string> = {
  "Subscription coupon not found": "seller.subscription.errors.couponNotFound",
  "This coupon has already been redeemed for your shop":
    "seller.subscription.errors.couponAlreadyRedeemed",
  "Coupon redemption limit reached": "seller.subscription.errors.couponLimitReached",
  "Coupon is not active": "seller.subscription.errors.couponInactive",
  "Coupon is not yet valid": "seller.subscription.errors.couponNotYetValid",
  "Coupon has expired": "seller.subscription.errors.couponExpired",
  "Subscription plan not found": "seller.subscription.errors.planNotFound",
  "Subscription plan is not available for new purchases":
    "seller.subscription.errors.planUnavailable",
  "Shop already has an incomplete Stripe subscription. Complete or cancel it before starting a new checkout.":
    "seller.subscription.errors.incompleteStripeSubscription",
  "A Stripe checkout is already in progress for another plan. Complete or cancel it first.":
    "seller.subscription.errors.checkoutInProgressOtherPlan",
  "Billing portal is only available for Stripe subscriptions. Your shop is on a coupon plan.":
    "seller.subscription.errors.portalCouponOnly",
  "Billing portal is only available for Stripe subscriptions. Contact support for admin-managed plans.":
    "seller.subscription.errors.portalAdminOnly",
  "Billing portal requires an active Stripe subscription. Subscribe via Stripe checkout first.":
    "seller.subscription.errors.portalStripeRequired",
};

export function translateSubscriptionError(
  t: Translator,
  message?: string | null,
): string {
  if (!message) {
    return t("common.error");
  }

  if (message.startsWith("Subscription is already active until")) {
    return t("seller.subscription.coupon.alreadyActive");
  }

  if (message.includes("not synced to Stripe yet")) {
    return t("seller.subscription.errors.planNotSynced");
  }

  const key = ERROR_MESSAGE_KEYS[message];
  if (key) {
    return t(key);
  }

  return message;
}
