export const STRIPE_CHECKOUT_PENDING_KEY = "bf-stripe-checkout-pending";

export function markStripeCheckoutPending() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(STRIPE_CHECKOUT_PENDING_KEY, "1");
}

export function clearStripeCheckoutPending() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(STRIPE_CHECKOUT_PENDING_KEY);
}

export function isStripeCheckoutPending(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(STRIPE_CHECKOUT_PENDING_KEY) === "1";
}
