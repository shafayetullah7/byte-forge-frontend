import { getRequestEvent } from "solid-js/web";
import { redirect } from "@solidjs/router";

/**
 * Get auth status from middleware locals
 * Can be used in route loaders or server functions
 */
export function getAuthStatus() {
  const event = getRequestEvent();
  return {
    isAuthenticated: event?.locals.isAuthenticated ?? false,
    sessionId: event?.locals.sessionId ?? null,
  };
}

/**
 * Require authentication in a route loader
 * Throws redirect to login if not authenticated
 *
 * @example
 * ```typescript
 * export const route = {
 *   load: () => {
 *     requireAuth(); // Redirects if not authenticated
 *     return loadData();
 *   }
 * };
 * ```
 */
export function requireAuth(redirectTo: string = "/login") {
  const { isAuthenticated } = getAuthStatus();

  if (!isAuthenticated) {
    throw redirect(redirectTo);
  }
}

/**
 * Wrapper for protected route loaders
 *
 * @example
 * ```typescript
 * export const route = {
 *   load: protectedLoader(async () => {
 *     const data = await api.get("/api/v1/user/profile");
 *     return data;
 *   })
 * };
 * ```
 */
export function protectedLoader<T>(
  loader: () => T | Promise<T>,
  redirectTo: string = "/login"
): () => T | Promise<T> {
  return () => {
    requireAuth(redirectTo);
    return loader();
  };
}
