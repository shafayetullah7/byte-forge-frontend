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
  const m = profile.metrics;
  const metrics: PublicShopTrustMetrics = {
    followerCount: m?.followerCount ?? 0,
    deliverySuccessRate: m?.deliverySuccessRate ?? 0,
    responseRate: m?.responseRate ?? 0,
    cancellationRate: m?.cancellationRate ?? 0,
    campaignsRun: m?.campaignsRun ?? 0,
    campaignParticipants: m?.campaignParticipants ?? 0,
    blogCount: m?.blogCount ?? 0,
    buyerSatisfactionScore: m?.buyerSatisfactionScore ?? 0,
    totalProducts: m?.totalProducts ?? 0,
    completedOrders: m?.completedOrders ?? 0,
    averageRating: m?.averageRating ?? 0,
    reviewCount: m?.reviewCount ?? 0,
    memberSince: m?.memberSince ?? profile.createdAt,
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
