/**
 * Configuration for API client authentication error handling
 *
 * This module configures how the API client responds to 401 Unauthorized errors,
 * including which endpoints should trigger redirects and which should fail silently.
 */

/**
 * Auth error handler configuration
 *
 * Controls the behavior of automatic authentication redirects when API calls
 * receive 401 Unauthorized responses.
 */
export interface AuthErrorConfig {
  /**
   * URL to redirect to on 401 Unauthorized
   *
   * When a 401 error occurs on a non-excluded endpoint:
   * - CSR (Client): Redirects via window.location.href
   * - SSR (Server): Marks error for route loader to handle with redirect()
   *
   * @default "/login"
   */
  loginUrl?: string;

  /**
   * Endpoints that should NOT trigger automatic auth redirects
   *
   * Use this to prevent infinite redirect loops and allow graceful degradation
   * for endpoints that check auth status without requiring authentication.
   *
   * Examples:
   * - Login/register endpoints (prevent redirect loops)
   * - Auth check endpoints (allow silent failure for public pages)
   * - Public endpoints that return different data based on auth status
   *
   * Matching is done with String.includes(), so partial paths work:
   * - "/auth/login" matches "/api/v1/user/auth/login"
   */
  excludedEndpoints?: string[];

  /**
   * Custom handler for auth errors
   *
   * If provided, this will be called instead of the default redirect behavior.
   * Useful for custom auth flows or analytics tracking.
   *
   * @param endpoint - The endpoint that returned 401
   * @param error - The ApiError instance
   */
  onAuthError?: (endpoint: string, error: Error) => void;

  /**
   * Whether to clear local/session storage on auth error
   *
   * Enable this to clean up any cached user data when session expires.
   *
   * @default false
   */
  clearStorageOnAuthError?: boolean;

  /**
   * Storage keys to clear on auth error
   *
   * Only used if clearStorageOnAuthError is true.
   * Keys are removed from both localStorage and sessionStorage.
   */
  storageKeysToClear?: string[];
}

/**
 * Default auth error configuration
 *
 * Excluded endpoints:
 * 1. /auth/login - Prevents redirect loop when login fails
 * 2. /auth/register - Prevents redirect loop when registration fails
 * 3. /auth/check - Allows silent failure for public session checks (Navbar, etc.)
 * 4. /admin/auth/login - Prevents redirect loop for admin login
 */
export const defaultAuthErrorConfig: AuthErrorConfig = {
  loginUrl: "/login",
  excludedEndpoints: [
    "/api/v1/user/auth/login", // User login endpoint
    "/api/v1/user/auth/register", // User registration endpoint
    "/api/v1/user/auth/check", // Session check endpoint (used by useSession)
    "/api/v1/admin/auth/login", // Admin login endpoint
  ],
  clearStorageOnAuthError: false,
  storageKeysToClear: [],
};
