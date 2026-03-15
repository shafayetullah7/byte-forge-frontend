import { ApiError } from "./types";
import { config } from "../config";
import { defaultAuthErrorConfig } from "./config";

/**
 * Request options for API calls
 */
export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  strict?: boolean; // If true, redirects to /login on 401. Default: true
  responseType?: "json" | "blob" | "text";
  unwrapData?: boolean; // If false, returns full response (with meta). Default: true

  // Callbacks for specialized error handling
  /**
   * Called on 401 Unauthorized.
   * Return false to prevent the default redirect behavior.
   */
  onAuthError?: (error: ApiError) => void | boolean;
  /**
   * Called on any non-2xx response.
   */
  onError?: (error: ApiError) => void;
}

/**
 * Build URL with query parameters
 */
export const buildURL = (
  baseURL: string,
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string => {
  const base = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
  const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = new URL(path, base);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

/**
 * Utility to extract a cookie from a cookie string
 */
function getCookieFromStr(cookieStr: string, name: string): string | undefined {
  if (!cookieStr) return undefined;
  const regex = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`);
  const match = cookieStr.match(regex);
  return match ? match[1] : undefined;
}

/**
 * Universal cookie getter (Works in Browser and during SSR)
 */
function getUniversalCookie(
  name: string,
  headers?: Headers
): string | undefined {
  if (!import.meta.env.SSR) {
    return getCookieFromStr(document.cookie, name);
  }

  if (headers) {
    const cookieHeader = headers.get("cookie");
    if (cookieHeader) return getCookieFromStr(cookieHeader, name);
  }

  return undefined;
}

/**
 * Global functional fetcher
 *
 * Features:
 * - SSR Cookie Handling: Automatically injects cookies from RequestEvent on server.
 * - 401 Rerouting: Idiomatic SolidStart redirect on unauthorized.
 * - Multi-Locale Support: Automatically injects x-locale header.
 * - Flexible Hooks: Supports request-level and global error callbacks.
 */
export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    params,
    strict = true,
    responseType = "json",
    unwrapData = true,
    onAuthError,
    onError,
    ...fetchOptions
  } = options;

  const baseURL = config.api.baseUrl;
  const url = buildURL(baseURL, endpoint, params);

  const headers = new Headers(fetchOptions.headers || {});

  if (
    !headers.has("Content-Type") &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  // 1. SSR Context & Cookie Injection
  let event: any;
  if (import.meta.env.SSR) {
    const { getRequestEvent } = await import("solid-js/web");
    try {
      event = getRequestEvent();
      if (event && !headers.has("cookie")) {
        const cookie = event.request.headers.get("cookie");
        if (cookie) headers.set("cookie", cookie);
      }
    } catch (e) {
      console.warn("[API] SSR event missing", e);
    }
  }

  // 2. Automatic Locale Injection
  const locale = getUniversalCookie("locale", headers) || "en";
  // Sanitize locale value to prevent invalid header characters
  const sanitizedLocale = locale.replace(/[^a-zA-Z0-9-_]/g, "");
  headers.set("x-locale", sanitizedLocale || "en");

  // 3. CSRF Protection (if token exists)
  const method = fetchOptions.method?.toUpperCase() || "GET";
  const stateChangingMethods = ["POST", "PUT", "DELETE", "PATCH"];
  if (stateChangingMethods.includes(method)) {
    const xsrfToken = getUniversalCookie("xsrf-token", headers);
    if (xsrfToken) headers.set("X-XSRF-TOKEN", xsrfToken);
  }

  const makeRequest = (opts: RequestInit, currentHeaders: Headers) =>
    fetch(url, {
      ...opts,
      headers: currentHeaders,
      credentials: "include",
    });

  try {
    const response = await makeRequest(fetchOptions, headers);

    // 4. Hierarchical Error Handling
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const apiError = new ApiError(
        errorData.message || `API Error: ${response.status}`,
        response.status,
        errorData
      );

      // 4a. Specific 401 Unauthorized Handling
      if (response.status === 401) {
        const isExcluded = defaultAuthErrorConfig.excludedEndpoints?.some((e) =>
          endpoint.includes(e)
        );

        if (!isExcluded) {
          // 1. Request-level hook
          const preventDefault = onAuthError?.(apiError) === false;

          // 2. Global hook
          defaultAuthErrorConfig.onAuthError?.(endpoint, apiError);

          // 3. Storage Cleanup (if configured)
          if (
            defaultAuthErrorConfig.clearStorageOnAuthError &&
            !import.meta.env.SSR
          ) {
            const keys = defaultAuthErrorConfig.storageKeysToClear || [];
            keys.forEach((k) => {
              localStorage.removeItem(k);
              sessionStorage.removeItem(k);
            });
          }

          // 4. Default Action (Redirect)
          if (strict && !preventDefault) {
            if (import.meta.env.SSR) {
              const { redirect } = await import("@solidjs/router");
              throw redirect(defaultAuthErrorConfig.loginUrl || "/login");
            } else {
              window.location.href =
                defaultAuthErrorConfig.loginUrl || "/login";
              return {} as T;
            }
          }
        }
      }

      // 4b. General Error Hooks
      onError?.(apiError);
      throw apiError;
    }

    // 5. SSR Cookie Propagation (Safety First)
    if (import.meta.env.SSR && event) {
      try {
        const { appendResponseHeader } = await import("vinxi/http");
        const isResponseFinished =
          event.nativeEvent.node.res.headersSent ||
          event.nativeEvent.node.res.writableEnded;

        if (!isResponseFinished) {
          const headersAny = response.headers as any;
          const setCookies =
            headersAny.getSetCookie?.() ||
            response.headers.get("set-cookie")?.split(", ") ||
            [];

          setCookies.forEach((cookie: string) => {
            appendResponseHeader(event.nativeEvent, "Set-Cookie", cookie);
          });
        }
      } catch (e) {
        console.warn("[API] Failed to propagate cookies during SSR", e);
      }
    }

    if (response.status === 204) return {} as T;

    // 6. Polymorphic Body Parsing
    if (responseType === "blob") {
      return (await response.blob()) as unknown as T;
    }

    if (responseType === "text") {
      return (await response.text()) as unknown as T;
    }

    // Default to JSON with automatic unwrapping
    const result = await response.json().catch(() => ({}));

    if (unwrapData === false) {
      return result as T;
    }

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      "data" in result
    ) {
      return result.data as T;
    }

    return result as T;
  } catch (error) {
    if (error instanceof Response || error instanceof ApiError) throw error;

    throw new ApiError(
      error instanceof Error ? error.message : "Network request failed",
      0
    );
  }
}

export const api = fetcher;
