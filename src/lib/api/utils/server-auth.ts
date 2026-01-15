import { redirect } from "@solidjs/router";
import { ApiError } from "../types";

/**
 * Server-Side Auth Redirect Utilities
 *
 * These utilities handle 401 errors during server-side rendering (SSR)
 * by using SolidStart's redirect() function to perform server-side redirects.
 */

/**
 * Handle API errors in SolidStart route loaders and server functions
 *
 * Checks if an error is a 401 Unauthorized and performs a server-side redirect.
 * This is the SSR equivalent of checking for 401 and calling window.location.href.
 *
 * @param error - The error to handle
 * @param redirectUrl - URL to redirect to on 401 (default: "/login")
 * @throws {Response} - SolidStart redirect response on 401
 *
 * @example
 * ```typescript
 * // In a route loader
 * export const route = {
 *   load: async () => {
 *     try {
 *       const data = await authApi.checkAuth();
 *       return data;
 *     } catch (error) {
 *       handleServerAuthError(error); // Redirects if 401
 *       throw error; // Re-throw other errors
 *     }
 *   }
 * };
 * ```
 */
export function handleServerAuthError(
  error: unknown,
  redirectUrl: string = "/login"
): void {
  if (error instanceof ApiError && error.statusCode === 401) {
    // Perform server-side redirect using SolidStart's redirect
    throw redirect(redirectUrl);
  }
  // If not a 401 error, do nothing (let it propagate)
}

/**
 * Server-Side Auth Redirect Wrapper
 *
 * Wraps an API call and automatically redirects to login on 401 errors (SSR only).
 * This is the server-side equivalent of withAuthRedirect().
 *
 * **When to use:**
 * - Route loaders that require authentication
 * - Server functions that need auth
 * - Any server-side code that should redirect on 401
 *
 * **When NOT to use:**
 * - Client-side code (use withAuthRedirect instead)
 * - When you want custom 401 handling
 * - Public endpoints that don't require auth
 *
 * @param apiCall - The API call to execute
 * @param redirectUrl - URL to redirect to on 401 (default: "/login")
 * @returns The result of the API call
 * @throws {Response} - SolidStart redirect response on 401
 *
 * @example
 * ```typescript
 * // In a route loader
 * export const route = {
 *   load: () => withServerAuthRedirect(() => authApi.checkAuth())
 * };
 *
 * // Or with custom redirect URL
 * export const route = {
 *   load: () => withServerAuthRedirect(
 *     () => adminApi.getDashboard(),
 *     "/admin/login"
 *   )
 * };
 * ```
 */
export async function withServerAuthRedirect<T>(
  apiCall: () => Promise<T>,
  redirectUrl: string = "/login"
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    handleServerAuthError(error, redirectUrl);
    throw error; // Re-throw if not a 401 error
  }
}
