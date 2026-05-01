import { fetcher } from "../../api-client";
import type { AuthUser } from "../../types/auth.types";

/**
 * User/Profile API endpoints
 * 
 * Refactored to use the functional fetcher with unwrapped responses.
 */
export const userApi = {
  /**
   * Get current user's profile
   */
  getProfile: async (): Promise<AuthUser> => {
    return fetcher<AuthUser>("/api/v1/user/profile");
  },
};
