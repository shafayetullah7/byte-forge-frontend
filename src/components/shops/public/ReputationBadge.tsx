import type { Component } from "solid-js";
import type { PublicShopBadge } from "~/lib/types/public/shops.types";

const BADGE_STYLES: Record<PublicShopBadge, string> = {
  TOP_SELLER: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  FAST_RESPONDER: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  HIGHLY_RATED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  TRUSTED_SHOP: "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300",
  RISING_SELLER: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  COMMUNITY_FAVORITE: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  BUYER_FRIENDLY: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  CAMPAIGN_CHAMPION: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

export function getBadgeLabel(
  badge: PublicShopBadge,
  t: (key: string) => string,
): string {
  const key = `public.shops.badges.${badge.toLowerCase()}`;
  return t(key);
}

export const ReputationBadge: Component<{
  badge: PublicShopBadge;
  label: string;
}> = (props) => (
  <span
    class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${BADGE_STYLES[props.badge]}`}
  >
    {props.label}
  </span>
);

export const VerifiedBadge: Component<{ label: string; class?: string }> = (props) => (
  <span
    class={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-700 dark:bg-forest-900/50 dark:text-forest-300 border border-forest-200 dark:border-forest-600 ${props.class ?? ""}`}
  >
    <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clip-rule="evenodd"
      />
    </svg>
    {props.label}
  </span>
);

export const ActiveStatusBadge: Component<{ label: string }> = (props) => (
  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
    {props.label}
  </span>
);
