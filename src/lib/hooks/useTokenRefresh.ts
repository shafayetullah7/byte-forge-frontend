import { createEffect, createSignal, onCleanup } from "solid-js";
import { authApi } from "~/lib/api/endpoints/auth.api";
import { useSession } from "~/lib/auth/session";
import { performLogout } from "~/lib/auth/session";

/**
 * Automatic token refresh hook for ByteForge JWT authentication.
 *
 * ## Architecture Decision: JWT Token Refresh
 *
 * This hook implements automatic JWT token refresh for the web frontend.
 * The refresh mechanism is designed to work with the JWT-based authentication
 * system that also supports mobile apps.
 *
 * ### How It Works
 *
 * - Access tokens have a limited lifetime (typically 15-60 minutes)
 * - Refresh tokens are valid for 7 days
 * - Tokens are refreshed 5 minutes before expiration (REFRESH_LEEWAY)
 * - Refresh happens automatically via HTTP-only cookie exchange
 *
 * ### Mobile App Considerations
 *
 * For native mobile apps, the same refresh endpoint (`/api/v1/auth/refresh`)
 * can be used with the Authorization header instead of cookies:
 *
 * ```
 * POST /api/v1/auth/refresh
 * Authorization: Bearer <refresh_token>
 * ```
 *
 * @remarks
 * - Refresh tokens are valid for 7 days by default
 * - Access tokens are refreshed automatically via the /refresh endpoint
 * - The backend handles race conditions, so multiple tabs won't cause issues
 *
 * @example
 * ```typescript
 * // In app.tsx or a protected route
 * const { isRefreshing, startRefreshCycle, stopRefreshCycle } = useTokenRefresh();
 *
 * createEffect(() => {
 *   if (session()) {
 *     startRefreshCycle();
 *   } else {
 *     stopRefreshCycle();
 *   }
 * });
 * ```
 */
export function useTokenRefresh() {
  const [isRefreshing, setIsRefreshing] = createSignal(false);
  const [lastRefreshTime, setLastRefreshTime] = createSignal<number | null>(
    null
  );
  const session = useSession();
  let refreshTimer: number | null = null;

  // Configuration
  const REFRESH_LEEWAY = 5 * 60 * 1000; // 5 minutes before expiry
  const TOKEN_LIFETIME = 7 * 24 * 60 * 60 * 1000; // 7 days (matches backend)

  /**
   * Perform token refresh
   */
  const performRefresh = async () => {
    if (isRefreshing()) {
      return;
    }

    try {
      setIsRefreshing(true);
      await authApi.refreshTokens();
      setLastRefreshTime(Date.now());
      console.log("[TokenRefresh] Tokens refreshed successfully");
    } catch (error: unknown) {
      console.error("[TokenRefresh] Failed to refresh tokens:", error);

      // Check if this is a session expiry (401 on refresh endpoint)
      // If refresh fails with 401, the session is invalid - trigger logout
      const statusCode =
        typeof error === "object" && error !== null
          ? (error as Record<string, unknown>)?.statusCode
          : undefined;
      if (statusCode === 401) {
        console.log("[TokenRefresh] Session expired - triggering logout flow");
        // Dispatch custom event for session expiry - allows other components to react
        if (!import.meta.env.SSR) {
          window.dispatchEvent(new CustomEvent("session-expired"));
        }
        // Perform logout to clear session state
        await performLogout();
      }
      // For other errors (network issues, etc.), don't logout
      // Let the next API call handle 401 if needed
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Schedule the next token refresh
   * @param tokenExpiryMs - Optional token expiry timestamp in ms. If not provided, uses current time + TOKEN_LIFETIME
   */
  const scheduleRefresh = (tokenExpiryMs?: number) => {
    // Clear any existing timer to prevent duplicate refreshes
    if (refreshTimer) {
      window.clearTimeout(refreshTimer);
      refreshTimer = null;
    }

    // Calculate time until refresh based on actual token expiry or default lifetime
    const now = Date.now();
    const expiryTime = tokenExpiryMs ?? now + TOKEN_LIFETIME;
    const timeUntilRefresh = Math.max(0, expiryTime - now - REFRESH_LEEWAY);

    console.log(
      `[TokenRefresh] Scheduling refresh in ${
        timeUntilRefresh / 1000 / 60
      } minutes`
    );

    refreshTimer = window.setTimeout(async () => {
      await performRefresh();
      // Schedule the next refresh only if session still exists
      // This prevents continuing refresh attempts after logout or session expiry
      if (session()) {
        scheduleRefresh();
      }
    }, timeUntilRefresh);
  };

  /**
   * Cancel any scheduled refresh
   */
  const cancelRefresh = () => {
    if (refreshTimer) {
      window.clearTimeout(refreshTimer);
      refreshTimer = null;
      console.log("[TokenRefresh] Refresh cycle cancelled");
    }
  };

  /**
   * Start the automatic refresh cycle
   * Call this when user is authenticated
   */
  const startRefreshCycle = () => {
    console.log("[TokenRefresh] Starting refresh cycle");
    scheduleRefresh();
  };

  /**
   * Stop the automatic refresh cycle
   * Call this when user logs out
   */
  const stopRefreshCycle = () => {
    cancelRefresh();
    setLastRefreshTime(null);
  };

  // Cleanup on unmount
  onCleanup(() => {
    cancelRefresh();
  });

  return {
    /** Whether a refresh is currently in progress */
    isRefreshing: isRefreshing(),
    /** The timestamp of the last successful refresh */
    lastRefreshTime: lastRefreshTime(),
    /** Start the automatic refresh cycle */
    startRefreshCycle,
    /** Stop the automatic refresh cycle */
    stopRefreshCycle,
    /** Manually trigger a token refresh */
    refreshNow: performRefresh,
  };
}

/**
 * Hook to automatically manage token refresh based on session state.
 *
 * This is a higher-level hook that combines useTokenRefresh with useSession
 * to automatically start/stop the refresh cycle based on authentication state.
 *
 * @example
 * ```typescript
 * // In app.tsx or inside a Route component
 * useAutoTokenRefresh();
 * ```
 */
export function useAutoTokenRefresh() {
  const session = useSession();
  const { startRefreshCycle, stopRefreshCycle } = useTokenRefresh();

  createEffect(() => {
    const user = session();
    if (user) {
      startRefreshCycle();
    } else {
      stopRefreshCycle();
    }
  });
}

/**
 * Provider component to automatically manage token refresh based on session state.
 *
 * This component wraps the useAutoTokenRefresh hook and can be used inside
 * the Router's root component to enable automatic token refresh for all routes.
 *
 * @example
 * ```typescript
 * // In app.tsx, inside Router root
 * <Router
 *   root={(props) => (
 *     <Suspense>
 *       <AutoTokenRefreshProvider />
 *       {props.children}
 *     </Suspense>
 *   )}
 * >
 *   <FileRoutes />
 * </Router>
 * ```
 */
export function AutoTokenRefreshProvider() {
  useAutoTokenRefresh();
  return null;
}

// TODO: Consider decoupling useTokenRefresh from router context
// ---------------------------------------------------------------
// Current: useTokenRefresh() calls useSession() which requires Router context,
// forcing the AutoTokenRefreshProvider workaround in app.tsx.
//
// Option 1: Accept session as parameter instead of calling useSession() directly
//   export function useTokenRefresh(session: () => AuthUser | null) { ... }
//
// Benefit: Removes need for AutoTokenRefreshProvider workaround
// Cost: ~1 hour (refactor + testing)
// Impact: No functional change, code clarity improvement only
//
// Decision: Keep current implementation - works correctly, documented,
// and the workaround is minimal (3 lines). Revisit if refactoring auth system.
// ---------------------------------------------------------------
