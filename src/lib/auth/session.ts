import { query, createAsync } from "@solidjs/router";
import { fetcher } from "~/lib/api/api-client";
import type { AuthUser as User } from "~/lib/api/types/auth.types";

/**
 * Session Management for ByteForge Frontend
 *
 * Simplified to use the new functional fetcher.
 */

/**
 * Server-side session loader
 *
 * Uses SolidStart's query() and the new fetcher with strict: false.
 * This ensures the auth check happens once per request during SSR and 
 * doesn't force a redirect if the user is unauthenticated (public pages).
 */
export const getSession = query(async () => {
  "use server";
  try {
    // strict: false handles the 401 silently by not throwing a redirect
    return await fetcher<User>("/api/auth/me", { strict: false });
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
    // Use the functional fetcher for logout as well
    await fetcher("/api/auth/logout", { method: "POST" });
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

