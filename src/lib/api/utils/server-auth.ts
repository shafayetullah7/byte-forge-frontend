import { redirect } from "@solidjs/router";
import { ApiError } from "../types";

/**
 * Handle API errors in SolidStart route loaders and server functions
 *
 * This utility checks if an error is an auth redirect error and performs
 * a server-side redirect using SolidStart's redirect() function.
 *
 * @param error - The error to handle
 * @throws {Response} - SolidStart redirect response
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
export function handleServerAuthError(error: unknown): void {
  if (error instanceof ApiError && error.isAuthRedirect) {
    // Perform server-side redirect using SolidStart's redirect
    throw redirect(error.redirectUrl || "/login");
  }
  // If not an auth redirect error, do nothing (let it propagate)
}

/**
 * Wrapper for API calls in server components that automatically handles auth errors
 *
 * @param apiCall - The API call to execute
 * @returns The result of the API call
 * @throws {Response} - SolidStart redirect response on 401
 *
 * @example
 * ```typescript
 * export const route = {
 *   load: () => withServerAuthRedirect(() => authApi.checkAuth())
 * };
 * ```
 */
export async function withServerAuthRedirect<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    handleServerAuthError(error);
    throw error; // Re-throw if not an auth error
  }
}
