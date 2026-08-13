export const SUBSCRIPTION_NAG_DISMISSED_KEY = "bf-subscription-nag-dismissed";

export function isSubscriptionNagDismissedForSession(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(SUBSCRIPTION_NAG_DISMISSED_KEY) === "1";
}

export function dismissSubscriptionNagForSession() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(SUBSCRIPTION_NAG_DISMISSED_KEY, "1");
}
