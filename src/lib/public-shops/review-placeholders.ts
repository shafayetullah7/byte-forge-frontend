import type {
  PublicShopReview,
  PublicShopReviewSummary,
} from "~/lib/types/public/shops.types";

const EMPTY_SUMMARY: PublicShopReviewSummary = {
  averageRating: 0,
  total: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

/**
 * Returns API review data only — no mock fill for empty shops.
 */
export function mergeReviewsWithPlaceholders(
  _slug: string,
  summary: PublicShopReviewSummary,
  reviews: PublicShopReview[],
): { summary: PublicShopReviewSummary; reviews: PublicShopReview[] } {
  if (summary.total > 0 || reviews.length > 0) {
    return { summary, reviews };
  }

  return { summary: EMPTY_SUMMARY, reviews: [] };
}
