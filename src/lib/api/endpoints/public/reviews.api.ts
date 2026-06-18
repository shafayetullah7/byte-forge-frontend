import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type { PublicReviewResponse } from "../../types/review.types";

export const getPublicPlantReviews = query(
  async (slug: string) => {
    return fetcher<PublicReviewResponse>(`/api/v1/reviews/plants/${slug}`);
  },
  "public-plant-reviews"
);

export const getPublicProductReviews = query(
  async (productId: string) => {
    return fetcher<PublicReviewResponse>(
      `/api/v1/reviews/products/${productId}`
    );
  },
  "public-product-reviews"
);
