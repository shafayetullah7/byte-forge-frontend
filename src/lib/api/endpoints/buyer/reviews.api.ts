import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  BuyerReviewEligibility,
  CreateReviewRequest,
} from "../../types/review.types";

const BASE_PATH = "/api/v1/user/buyer/reviews";

export const getReviewEligibility = query(
  async (orderItemId: string) => {
    return fetcher<BuyerReviewEligibility>(
      `${BASE_PATH}/eligibility/${orderItemId}`
    );
  },
  "buyer-review-eligibility"
);

export const createReview = async (input: CreateReviewRequest) => {
  return fetcher(`${BASE_PATH}`, {
    method: "POST",
    body: JSON.stringify(input),
  });
};
