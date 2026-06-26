import type {
  PublicShopReview,
  PublicShopReviewSummary,
} from "~/lib/types/public/shops.types";

function emptyDistribution() {
  return [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: 0,
    percentage: 0,
  }));
}

function normalizeSummary(summary: PublicShopReviewSummary): PublicShopReviewSummary {
  return {
    average: summary.average ?? 0,
    total: summary.total ?? 0,
    distribution:
      summary.distribution?.length > 0 ? summary.distribution : emptyDistribution(),
  };
}

/**
 * Returns API review data only — no mock fill for empty shops.
 */
export function mergeReviewsWithPlaceholders(
  _slug: string,
  summary: PublicShopReviewSummary,
  reviews: PublicShopReview[],
): { summary: PublicShopReviewSummary; reviews: PublicShopReview[] } {
  return {
    summary: normalizeSummary(summary),
    reviews,
  };
}
