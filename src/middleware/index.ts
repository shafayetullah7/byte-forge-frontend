import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie } from "vinxi/http";

/**
 * Auth middleware - runs on every server request
 * Checks for session cookie and stores auth status in event.locals
 *
 * Note: This does NOT redirect - it only checks and stores auth state
 * Redirects should be done in route loaders or components using redirect()
 */
export default createMiddleware({
  onRequest: async (event) => {
    // Check if session cookie exists
    const sessionCookie = getCookie(event.nativeEvent, "session");

    // Store auth status in event.locals for use in route loaders
    event.locals.isAuthenticated = !!sessionCookie;
    event.locals.sessionId = sessionCookie || null;

    // Optional: Add user data to locals if needed
    // event.locals.user = await getUserFromSession(sessionCookie);
  },
});
