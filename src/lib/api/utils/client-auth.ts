import { ApiError } from "../types";

/**
 * Client-Side Auth Redirect Wrapper
 *
 * Wraps an API call and automatically redirects to login on 401 errors (CSR only).
 * This is a convenience wrapper for when you want automatic redirect behavior.
 *
 * **When to use:**
 * - Client-side API calls that require authentication
 * - When you want automatic redirect on session expiry
 * - In event handlers, effects, or client-only code
 *
 * **When NOT to use:**
 * - Server-side code (use withServerAuthRedirect instead)
 * - When you want custom 401 handling (show modal, toast, etc.)
 * - Public endpoints that don't require auth
 *
 * @param apiCall - The API call function to execute
 * @param redirectUrl - URL to redirect to on 401 (default: "/login")
 * @returns The result of the API call
 * @throws Redirects on 401, re-throws other errors
 *
 * @example
 * ```typescript
 * // In a component event handler
 * async function handleSubmit() {
 *   const data = await withAuthRedirect(() =>
 *     api.post("/api/v1/user/seller/plants", formData)
 *   );
 *   console.log("Plant created:", data);
 * }
 * ```
 */
export async function withAuthRedirect<T>(
  apiCall: () => Promise<T>,
  redirectUrl: string = "/login"
): Promise<T> {
  // Only works on client-side
  if (typeof window === "undefined") {
    throw new Error(
      "withAuthRedirect() can only be used on the client. " +
        "Use withServerAuthRedirect() for server-side code."
    );
  }

  try {
    return await apiCall();
  } catch (error) {
    // Redirect on 401 Unauthorized
    if (error instanceof ApiError && error.statusCode === 401) {
      console.info(`[Auth] Redirecting to ${redirectUrl} due to 401 error`);
      window.location.href = redirectUrl;

      // Throw error anyway (though redirect will happen first)
      // This prevents code from continuing after redirect
      throw error;
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * Client-Side Auth Redirect Wrapper with Custom Handler
 *
 * Similar to withAuthRedirect, but allows custom logic before redirect.
 * Useful for analytics, cleanup, or showing a message before redirecting.
 *
 * @param apiCall - The API call function to execute
 * @param onUnauthorized - Custom handler called before redirect
 * @param redirectUrl - URL to redirect to on 401 (default: "/login")
 * @returns The result of the API call
 *
 * @example
 * ```typescript
 * const data = await withAuthRedirect(
 *   () => api.get("/api/v1/user/profile"),
 *   (error) => {
 *     // Custom logic before redirect
 *     analytics.track("session_expired");
 *     showToast("Your session has expired. Please log in again.");
 *   }
 * );
 * ```
 */
export async function withAuthRedirectCustom<T>(
  apiCall: () => Promise<T>,
  onUnauthorized: (error: ApiError) => void,
  redirectUrl: string = "/login"
): Promise<T> {
  if (typeof window === "undefined") {
    throw new Error(
      "withAuthRedirectCustom() can only be used on the client. " +
        "Use withServerAuthRedirect() for server-side code."
    );
  }

  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      // Call custom handler
      onUnauthorized(error);

      // Then redirect
      console.info(`[Auth] Redirecting to ${redirectUrl} due to 401 error`);
      window.location.href = redirectUrl;
      throw error;
    }

    throw error;
  }
}
