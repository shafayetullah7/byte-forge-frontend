import { query, createAsync } from "@solidjs/router";
import { authApi } from "~/lib/api";

/**
 * Session Management for ByteForge Frontend
 *
 * This module provides SSR-safe session checking using SolidStart's query() pattern.
 * It's designed to work seamlessly on both server and client without hydration mismatches.
 *
 * **Key Features:**
 * - Server-side session fetching with automatic client hydration
 * - Silent failure for public pages (doesn't redirect on 401)
 * - Single request per page load (cached via query key)
 * - Works with SolidJS reactivity system
 *
 * **Why this approach?**
 * - No Context Provider needed (avoids SSR hydration issues)
 * - No useEffect/onMount (runs on server during SSR)
 * - Automatic deduplication (multiple components can call useSession())
 * - Type-safe and reactive
 */

/**
 * Server-side session loader
 *
 * Uses SolidStart's query() to ensure the auth check only happens ONCE per request
 * on the server, and the result is automatically hydrated to the client.
 *
 * **Important:** This function is marked with "use server" to ensure it runs on the
 * server during SSR. The result is serialized and sent to the client for hydration.
 *
 * **Error Handling:**
 * - Returns null on error (fails silently)
 * - Does NOT trigger 401 redirects (auth check is excluded in config.ts)
 * - Allows public pages to check auth status without forcing login
 *
 * **Usage:**
 * Don't call this directly. Use useSession() instead.
 *
 * @returns User data if authenticated, null otherwise
 */
export const getSession = query(async () => {
  "use server";
  try {
    let headers: HeadersInit | undefined;
    
    if (typeof window === "undefined") {
      const { getRequestEvent } = await import("solid-js/web");
      const event = getRequestEvent();
      const cookie = event?.request.headers.get("cookie");
      if (cookie) {
        headers = { cookie };
      }
    }

    const response = await authApi.checkAuth(headers);
    return response.success ? response.data : null;
  } catch (error) {
    // Fail silently for public session checks
    // This allows components like Navbar to check auth status
    // without redirecting users who are browsing public pages
    return null;
  }
}, "user-session");

/**
 * Perform a logout operation
 *
 * This utility handles both the backend request and the frontend state cleanup.
 * It's designed to be resilient: if the backend returns a 401 (already unauthorized),
 * it still proceeds with clearing the local session state.
 *
 * @returns true if logout was performed (even if backend session was already gone)
 */
export const performLogout = async () => {
  const { revalidate } = await import("@solidjs/router");

  try {
    await authApi.logout();
  } catch (error: any) {
    // If we get a 401, the session is already invalid/gone on the server.
    // We should still proceed with clearing the local state.
    if (error?.statusCode !== 401) {
      console.error("[Auth] Logout error:", error);
      // We still revalidate to be safe, but we log other errors
    }
  } finally {
    // Revalidate the "user-session" query to trigger UI updates across the app
    await revalidate("user-session");
  }

  return true;
};

/**
 * Client/Server hook to access the current session
 *
 * This hook returns a reactive signal that contains the current user's session data.
 * It works on both server (SSR) and client (CSR) without hydration mismatches.
 *
 * **How it works:**
 * 1. During SSR: Calls getSession() on server, serializes result
 * 2. During hydration: Uses serialized data from server
 * 3. During CSR: Uses cached data or refetches if stale
 *
 * **Usage in components:**
 * ```typescript
 * import { useSession } from "~/lib/auth";
 *
 * function MyComponent() {
 *   const user = useSession();
 *
 *   return (
 *     <Show when={user()} fallback={<LoginButton />}>
 *       {(userData) => <div>Welcome, {userData().userName}!</div>}
 *     </Show>
 *   );
 * }
 * ```
 *
 * **Why not use a Context Provider?**
 * - Context Providers can cause SSR hydration mismatches
 * - This pattern is more aligned with SolidStart's data fetching model
 * - Automatic caching and deduplication built-in
 * - No need to wrap your app in a provider
 *
 * @returns Reactive signal containing user data or null
 */
export const useSession = () => createAsync(() => getSession());
