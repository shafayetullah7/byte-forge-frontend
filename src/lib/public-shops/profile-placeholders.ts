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
    followerCount: 0,
    deliverySuccessRate: 0,
    responseRate: 0,
    cancellationRate: 0,
    campaignsRun: 0,
    campaignParticipants: 0,
    blogCount: 0,
    buyerSatisfactionScore: 0,
    ...profile.metrics,
    totalProducts: profile.metrics?.totalProducts ?? 0,
    completedOrders: profile.metrics?.completedOrders ?? 0,
    averageRating: profile.metrics?.averageRating ?? 0,
    reviewCount: profile.metrics?.reviewCount ?? 0,
    memberSince: profile.metrics?.memberSince ?? profile.createdAt,
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
