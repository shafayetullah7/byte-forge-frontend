import { toaster } from "~/components/ui/Toast";

export const SELLER_SUBSCRIPTION_PATH = "/app/seller/subscription";

export function showSubscriptionGateToast(message: string, actionLabel: string) {
  toaster.errorWithAction(message, {
    label: actionLabel,
    href: SELLER_SUBSCRIPTION_PATH,
  });
}

export function isSubscriptionFulfillmentDisabledReason(reason: string | null | undefined): boolean {
  if (!reason) return false;
  return reason.toLowerCase().includes("subscription");
}
