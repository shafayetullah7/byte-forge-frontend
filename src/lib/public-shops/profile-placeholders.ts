import type {
  PublicShopBadge,
  PublicShopFeaturedPreview,
  PublicShopProfile,
  PublicShopTrustMetrics,
} from "~/lib/types/public/shops.types";

/** Extended trust metrics not yet returned by GET /shops/:slug. */
const PLACEHOLDER_EXTENDED_METRICS: Pick<
  PublicShopTrustMetrics,
  | "followerCount"
  | "deliverySuccessRate"
  | "responseRate"
  | "cancellationRate"
  | "campaignsRun"
  | "campaignParticipants"
  | "blogCount"
  | "buyerSatisfactionScore"
> = {
  followerCount: 1200,
  deliverySuccessRate: 97,
  responseRate: 94,
  cancellationRate: 2.1,
  campaignsRun: 8,
  campaignParticipants: 2400,
  blogCount: 6,
  buyerSatisfactionScore: 4.7,
};

const PLACEHOLDER_BADGES: PublicShopBadge[] = ["TRUSTED_SHOP", "BUYER_FRIENDLY"];

const PLACEHOLDER_CATEGORY = "Plants";

const PLACEHOLDER_FEATURED_PREVIEWS: PublicShopFeaturedPreview[] = [];

function engagementScore(metrics: PublicShopTrustMetrics): number {
  return (
    metrics.completedOrders * 0.4 +
    metrics.averageRating * 0.3 +
    metrics.reviewCount * 0.1 +
    metrics.followerCount * 0.01
  );
}

/**
 * Merges API profile data with static placeholders for fields the backend
 * does not expose yet. API values always win when present.
 */
export function mergeProfileWithPlaceholders(
  profile: PublicShopProfile,
): PublicShopProfile {
  const metrics: PublicShopTrustMetrics = {
    ...PLACEHOLDER_EXTENDED_METRICS,
    ...profile.metrics,
    totalProducts: profile.metrics.totalProducts,
    completedOrders: profile.metrics.completedOrders,
    averageRating: profile.metrics.averageRating,
    reviewCount: profile.metrics.reviewCount,
    memberSince: profile.metrics.memberSince,
  };

  const category =
    profile.category ||
    profile.categoriesServed[0] ||
    PLACEHOLDER_CATEGORY;

  return {
    ...profile,
    category,
    metrics,
    badges: profile.badges.length > 0 ? profile.badges : PLACEHOLDER_BADGES,
    featuredProductPreviews:
      profile.featuredProductPreviews.length > 0
        ? profile.featuredProductPreviews
        : PLACEHOLDER_FEATURED_PREVIEWS,
    engagementScore: engagementScore(metrics),
  };
}
