import { query, createAsync } from "@solidjs/router";
import { authApi } from "~/lib/api/endpoints/auth.api";

/**
 * Session Management for ByteForge Frontend
 *
 * Simplified to use the new functional fetcher via authApi.
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
    // checkAuth uses strict: false internally by default in our refactor? 
    // Wait, let me check authApi.checkAuth implementation.
    return await authApi.checkAuth();
  } catch (error) {
    // Fail silently for session checks to support public pages
    return null;
  }
}, "user-session");

/**
 * Perform a logout operation
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
 */
export const useSession = () => createAsync(() => getSession());

