import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type { FeaturedPublicReview, PublicReviewResponse } from "../../types/review.types";

export const getPublicPlantReviews = query(
  async (slug: string) => {
    "use server";
    return fetcher<PublicReviewResponse>(`/api/v1/reviews/plants/${slug}`);
  },
  "public-plant-reviews"
);

export const getPublicProductReviews = query(
  async (productId: string) => {
    "use server";
    return fetcher<PublicReviewResponse>(
      `/api/v1/reviews/products/${productId}`
    );
  },
  "public-product-reviews"
);

export const getFeaturedPublicReviews = query(
  async (limit = 6) => {
    "use server";
    return fetcher<FeaturedPublicReview[]>(`/api/v1/reviews/featured`, {
      params: { limit },
    });
  },
  "public-featured-reviews"
);
