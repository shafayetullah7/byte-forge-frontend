import { fetcher } from "../../api-client";
import type { AuthUser } from "../../types/auth.types";

/**
 * Authentication API endpoints (OIDC-only — login/callback on byte-forge-auth API).
 */
export const authApi = {
  oidcCheck: async (headers?: HeadersInit): Promise<AuthUser> => {
    return fetcher<AuthUser>("/api/v1/user/auth/oidc-check", {
      headers,
      strict: false,
    });
  },

  refreshOidcTokens: async (): Promise<null> => {
    return fetcher<null>("/api/v1/user/auth/oidc/refresh", {
      method: "POST",
      strict: false,
    });
  },

  logout: async (): Promise<void> => {
    return fetcher<void>("/api/v1/user/auth/logout", {
      method: "POST",
    });
  },
};
