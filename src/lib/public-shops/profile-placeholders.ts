import type {
  PublicShopProfile,
  PublicShopTrustMetrics,
} from "~/lib/types/public/shops.types";

const PLACEHOLDER_CATEGORY = "Plants";

/**
 * Merges API profile data with safe UI defaults only.
 * Does not inject mock trust/engagement metrics (Phase B+).
 */
export function mergeProfileWithPlaceholders(
  profile: PublicShopProfile,
): PublicShopProfile {
  const metrics: PublicShopTrustMetrics = {
    ...profile.metrics,
    followerCount: 0,
    deliverySuccessRate: 0,
    responseRate: 0,
    cancellationRate: 0,
    campaignsRun: 0,
    campaignParticipants: 0,
    blogCount: 0,
    buyerSatisfactionScore: 0,
  };

  const category =
    profile.category ||
    profile.categoriesServed[0] ||
    PLACEHOLDER_CATEGORY;

  return {
    ...profile,
    category,
    metrics,
    badges: profile.badges,
    featuredProductPreviews: profile.featuredProductPreviews,
    engagementScore: 0,
  };
}
