import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  ReviewStatus,
  SellerProductReviewResponse,
} from "../../types/review.types";

export interface SellerReviewFilter {
  page?: number;
  limit?: number;
  status?: ReviewStatus;
  rating?: number;
}

export const getSellerProductReviews = query(
  async (productId: string, filter?: SellerReviewFilter) => {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (filter) {
      if (filter.page !== undefined) params.page = filter.page;
      if (filter.limit !== undefined) params.limit = filter.limit;
      if (filter.status !== undefined) params.status = filter.status;
      if (filter.rating !== undefined) params.rating = filter.rating;
    }

    return fetcher<SellerProductReviewResponse>(
      `/api/v1/user/seller/products/${productId}/reviews`,
      { params }
    );
  },
  "seller-product-reviews"
);

export interface ReportSellerReviewRequest {
  reason: string;
  details?: string;
}

export const reportSellerReview = async (
  productId: string,
  reviewId: string,
  body: ReportSellerReviewRequest
) => {
  const data = await fetcher(`/api/v1/user/seller/reviews/${reviewId}/report`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  revalidate(getSellerProductReviews.keyFor(productId));
  return data;
};
