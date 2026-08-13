import type { Locale } from "~/i18n";
import type { SubscriptionPlan, SubscriptionPlanInterval } from "~/lib/api/types/seller/subscription.types";

const FORMAT_LOCALE: Record<Locale, string> = {
  en: "en-BD",
  bn: "bn-BD",
};

export function getPurchasablePlans(plans: SubscriptionPlan[]): SubscriptionPlan[] {
  return plans
    .filter((plan) => plan.isActiveForNew && !plan.isRetired && plan.stripePriceId)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function formatPlanPrice(priceBdt: string, locale: Locale = "en"): string {
  const numeric = Number(priceBdt);
  if (Number.isNaN(numeric)) return `৳${priceBdt}`;
  return new Intl.NumberFormat(FORMAT_LOCALE[locale], {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numeric);
}

export function planIntervalKey(interval: SubscriptionPlanInterval): "monthly" | "yearly" {
  return interval === "MONTH" ? "monthly" : "yearly";
}
