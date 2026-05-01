import { fetcher } from "../../api-client";
import { ApiError } from "../../types";
import type {
  VerificationStatus,
  UpdateVerificationRequest,
} from "../../types/seller.types";

/**
 * Seller Verification API endpoints
 */
export const sellerVerificationApi = {
  /**
   * Get shop verification status
   * Returns null if no verification record exists (404 handled gracefully)
   */
  getStatus: async (): Promise<VerificationStatus | null> => {
    try {
      return await fetcher<VerificationStatus>(
        "/api/v1/user/seller/shops/my-shop/verification"
      );
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Update verification documents
   */
  update: async (data: UpdateVerificationRequest): Promise<VerificationStatus> => {
    return fetcher<VerificationStatus>(
      "/api/v1/user/seller/shops/my-shop/verification",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },
};
