import { api } from "../api-client";
import type { AuthUser } from "../types/auth.types";
import type { ApiResponse } from "../types";

/**
 * User/Profile API endpoints
 */
export const userApi = {
  /**
   * Get current user's profile
   */
  getProfile: async (): Promise<ApiResponse<AuthUser>> => {
    return api.get<ApiResponse<AuthUser>>("/api/v1/user/profile");
  },
};
