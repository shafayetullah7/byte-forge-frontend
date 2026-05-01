import { query, createAsync } from "@solidjs/router";
import { authApi } from "~/lib/api/endpoints/user/auth.api";

/**
 * Session Management for ByteForge Frontend
 *
 * ## Architecture Decision: JWT-Based Authentication
 *
 * This implementation uses JWT tokens via API calls instead of SolidStart's built-in
 * `useSession` from `vinxi/http`. This is an **intentional design decision** to support:
 *
 * 1. **Mobile App Compatibility** - The same backend API serves both web and native mobile apps.
 *    Mobile apps cannot use SolidStart's server-side encrypted sessions.
 *
 * 2. **API-First Architecture** - The backend is designed as a stateless API that can be
 *    consumed by multiple clients (web, mobile, third-party integrations).
 *
 * 3. **Cross-Domain Support** - JWT tokens work across domains, enabling future microservices
 *    or CDN-hosted frontends.
 *
 * 4. **Standard Industry Practice** - JWT-based authentication is the standard for modern
 *    API-driven applications with multiple client platforms.
 *
 * ## How It Works
 *
 * - Access tokens are stored in HTTP-only cookies (secure, XSS-resistant)
 * - Refresh tokens are also stored in HTTP-only cookies
 * - Token refresh is handled automatically via `useTokenRefresh` hook
 * - Session validation happens via `/api/v1/auth/check` endpoint
 *
 * ## Why Not SolidStart Sessions?
 *
 * SolidStart's `useSession` from `vinxi/http` uses server-side encrypted sessions tied to
 * browser cookies. This approach:
 * - Only works for web browsers (not mobile apps)
 * - Requires session storage/redis for scalability
 * - Ties authentication to the SolidStart frontend
 *
 * Our JWT approach is more flexible for a multi-platform application.
 */

/**
 * Server-side session loader
 *
 * Uses SolidStart's query() and the authApi.checkAuth with strict: false.
 * This ensures the auth check happens once per request during SSR and
 * doesn't force a redirect if the user is unauthenticated (public pages).
 */
export const getSession = query(async () => {
  "use server";
  try {
    // checkAuth validates JWT tokens and returns user data
    // Returns null if not authenticated (supports public pages)
    return await authApi.checkAuth();
  } catch (error) {
    // Fail silently for session checks to support public pages
    return null;
  }
}, "user-session");

/**
 * Perform a logout operation
 *
 * Calls the backend logout endpoint to invalidate the session
 * and clears tokens from cookies.
 */
export const performLogout = async () => {
  const { revalidate } = await import("@solidjs/router");

  try {
    // Use the authApi for logout
    await authApi.logout();
  } catch (error: any) {
    // Silent failure if already logged out (401)
    if (error?.statusCode !== 401) {
      console.error("[Auth] Logout error:", error);
    }
  } finally {
    await revalidate("user-session");
  }

  return true;
};

/**
 * Client/Server hook to access the current session
 *
 * Uses createAsync() to subscribe to session changes.
 * Must be called within a Router context (inside a Route component).
 *
 * @returns Signal containing the current user session or null
 */
export const useSession = () => createAsync(() => getSession());
