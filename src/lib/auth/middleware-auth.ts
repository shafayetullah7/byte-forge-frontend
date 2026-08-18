import { getRequestEvent } from "solid-js/web";

/**
 * Middleware locals are not a real session (OIDC cookies live on the API host).
 * Use `getSession` / `requireAuth` from `./guards` instead.
 */
export function getAuthStatus() {
  const event = getRequestEvent();
  return {
    isAuthenticated: event?.locals.isAuthenticated ?? false,
    sessionId: event?.locals.sessionId ?? null,
  };
}
