import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie } from "vinxi/http";

/**
 * Authentication Middleware for SolidStart
 *
 * This middleware runs on EVERY server request before route handlers execute.
 * It performs a lightweight session check and stores the result in event.locals
 * for use by route loaders and server functions.
 *
 * **What it does:**
 * - Checks for the presence of a session cookie
 * - Stores authentication status in event.locals.isAuthenticated
 * - Stores session ID in event.locals.sessionId
 *
 * **What it does NOT do:**
 * - Does NOT validate the session (for performance)
 * - Does NOT redirect users (redirects happen in route loaders)
 * - Does NOT fetch user data (use getSession() for that)
 *
 * **Why this approach?**
 * - Middleware is fast and runs on every request
 * - Route loaders can decide whether to redirect based on isAuthenticated
 * - Separates concerns: middleware checks, loaders enforce
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
    // Check if session cookie exists (lightweight check, no validation)
    const sessionCookie = getCookie(event.nativeEvent, "session");

    // Store auth status in event.locals for use in route loaders
    // This is accessible via getRequestEvent().locals in server functions
    event.locals.isAuthenticated = !!sessionCookie;
    event.locals.sessionId = sessionCookie || null;

    // Optional: Add user data to locals if needed
    // event.locals.user = await getUserFromSession(sessionCookie);
    // Note: This would add latency to every request, so only do this if necessary
  },
});
