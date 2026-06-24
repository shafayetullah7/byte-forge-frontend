import {
  MOCK_SHOP_REVIEWS,
  getMockReviewSummary,
} from "~/lib/mocks/public-shops";
import type {
  PublicShopReview,
  PublicShopReviewSummary,
} from "~/lib/types/public/shops.types";

/**
 * Fills review UI with static mock data when the API returns no reviews yet.
 * Remove once real review data is sufficient for all shops.
 */
export function mergeReviewsWithPlaceholders(
  slug: string,
  summary: PublicShopReviewSummary,
  reviews: PublicShopReview[],
): { summary: PublicShopReviewSummary; reviews: PublicShopReview[] } {
  if (summary.total > 0 || reviews.length > 0) {
    return { summary, reviews };
  }

  return {
    summary: getMockReviewSummary(slug),
    reviews: MOCK_SHOP_REVIEWS[slug] ?? [],
  };
}
