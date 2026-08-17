import { getRequestEvent } from "solid-js/web";
import { loginRedirectFromRequest } from "./login-redirect";

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
 * Require authentication in a route loader (cookie presence only).
 * Redirects to OIDC login via API when unauthenticated.
 */
export function requireAuth(): void {
  const { isAuthenticated } = getAuthStatus();

  if (!isAuthenticated) {
    loginRedirectFromRequest();
  }
}

/**
 * Wrapper for protected route loaders
 */
export function protectedLoader<T>(
  loader: () => T | Promise<T>,
): () => T | Promise<T> {
  return () => {
    requireAuth();
    return loader();
  };
}
