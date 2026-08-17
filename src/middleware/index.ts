import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie } from "vinxi/http";

/**
 * Authentication Middleware for SolidStart
 *
 * ## Architecture Decision: Cookie-Based Session Check
 *
 * This middleware performs a lightweight cookie presence check for JWT-based
 * authentication. It's designed to work alongside the JWT token system that
 * also powers mobile app authentication.
 *
 * ### How It Works
 *
 * 1. Middleware checks for the presence of the `session` cookie
 * 2. Sets `event.locals.isAuthenticated` for route loaders to use
 * 3. Does NOT validate the token (that happens in `authApi.oidcCheck()`)
 *
 * ### Why This Approach?
 *
 * - **Performance**: Middleware runs on every request, so we do a fast cookie check
 * - **Separation of Concerns**: Middleware checks presence, API validates tokens
 * - **Mobile Compatibility**: The same JWT tokens work for mobile apps via
 *   Authorization headers instead of cookies
 *
 * ### Mobile App Equivalent
 *
 * For mobile apps, the backend validates tokens from the Authorization header:
 *
 * ```
 * Authorization: Bearer <access_token>
 * ```
 *
 * **Usage in route loaders:**
 * ```typescript
 * import { requireAuth } from "~/lib/auth/middleware-auth";
 *
 * export const route = {
 *   load: () => {
 *     requireAuth(); // Redirects if not authenticated
 *     return loadProtectedData();
 *   }
 * };
 * ```
 */
export default createMiddleware({
  onRequest: async (event) => {
    const oidcCookie = getCookie(event.nativeEvent, "bfAccessToken");

    event.locals.isAuthenticated = Boolean(oidcCookie);
    event.locals.sessionId = null;
  },
});
