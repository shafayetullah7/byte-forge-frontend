export const HOME_ANALYTICS_EVENT = "bf:home-analytics";

export const HOME_ANALYTICS_SECTIONS = {
  hero: "hero",
  trust_bar: "trust_bar",
  quick_discovery: "quick_discovery",
  home_offers: "home_offers",
  shop_by_category: "shop_by_category",
  featured_listings: "featured_listings",
  budget_finds: "budget_finds",
  featured_shops: "featured_shops",
  shop_by_need: "shop_by_need",
  founding_articles: "founding_articles",
  how_it_works: "how_it_works",
  why_byte_forge: "why_byte_forge",
  seller_cta: "seller_cta",
  featured_reviews: "featured_reviews",
  footer: "footer",
} as const;

export type HomeAnalyticsSectionId =
  (typeof HOME_ANALYTICS_SECTIONS)[keyof typeof HOME_ANALYTICS_SECTIONS];

export type HomeAnalyticsSectionImpression = {
  type: "section_impression";
  section: string;
};

export type HomeAnalyticsSectionClick = {
  type: "section_click";
  clickId: string;
  section?: string;
};

export type HomeAnalyticsDetail =
  | HomeAnalyticsSectionImpression
  | HomeAnalyticsSectionClick;

export function homeSectionAttrs(section: HomeAnalyticsSectionId): {
  "data-analytics-section": HomeAnalyticsSectionId;
} {
  return { "data-analytics-section": section };
}

export function homeClickAttrs(clickId: string): {
  "data-analytics-click": string;
} {
  return { "data-analytics-click": clickId };
}

export function dispatchHomeAnalytics(detail: HomeAnalyticsDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(HOME_ANALYTICS_EVENT, {
      detail,
    }),
  );
}
