/**
 * Authentication middleware for SolidStart.
 *
 * `bfAccessToken` is set on the API host (`:3005`), not the storefront.
 * Presence of that cookie on this origin is not a session. Protected routes
 * use `requireAuth` from `~/lib/auth/guards` (`oidc-check`).
 */
import { createMiddleware } from "@solidjs/start/middleware";

export default createMiddleware({
  onRequest: async (event) => {
    event.locals.isAuthenticated = false;
    event.locals.sessionId = null;
  },
});
