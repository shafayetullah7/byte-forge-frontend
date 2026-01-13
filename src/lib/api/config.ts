/**
 * Configuration for API client interceptors
 */

/**
 * Auth error handler configuration
 */
export interface AuthErrorConfig {
  /**
   * URL to redirect to on 401 Unauthorized
   * @default "/login"
   */
  loginUrl?: string;

  /**
   * Endpoints that should not trigger auth redirect
   * (to prevent infinite loops)
   */
  excludedEndpoints?: string[];

  /**
   * Custom handler for auth errors
   * If provided, this will be called instead of the default redirect
   */
  onAuthError?: (endpoint: string, error: Error) => void;

  /**
   * Whether to clear local storage on auth error
   * @default false
   */
  clearStorageOnAuthError?: boolean;

  /**
   * Storage keys to clear on auth error
   */
  storageKeysToClear?: string[];
}

/**
 * Default auth error configuration
 */
export const defaultAuthErrorConfig: AuthErrorConfig = {
  loginUrl: "/login",
  excludedEndpoints: [
    "/api/v1/user/auth/login",
    "/api/v1/user/auth/register",
    "/api/v1/admin/auth/login",
  ],
  clearStorageOnAuthError: false,
  storageKeysToClear: [],
};
