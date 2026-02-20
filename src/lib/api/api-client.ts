import { ApiError, type ApiErrorResponse } from "./types";
import { config } from "../config";

/**
 * Request options for API calls
 */
export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  strict?: boolean; // If true, throws redirect("/login") on 401. Default: true
}

/**
 * Build URL with query parameters
 */
export const buildURL = (
  baseURL: string,
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string => {
  // Handle absolute URLs or relative paths
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
 * Global header management
 */
const getDefaultHeaders = () => ({
  "Content-Type": "application/json",
});

/**
 * Robust functional fetcher
 * 
 * Features:
 * - SSR Cookie Handling: Automatically injects cookies from RequestEvent on server.
 * - 401 Rerouting: Idiomatic SolidStart redirect on unauthorized.
 * - Strict Type Safety: Typed response and safe param record.
 * - Consistent Error Handling: Throws ApiError for non-2xx with type narrowing support.
 */
export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, strict = true, ...fetchOptions } = options;
  const baseURL = config.api.baseUrl;
  const url = buildURL(baseURL, endpoint, params);

  const headers = { ...getDefaultHeaders(), ...fetchOptions.headers } as Record<string, string>;

  // 1. Defensive SSR Cookie Handling
  let event: any;
  if (typeof window === "undefined") {
    const { getRequestEvent } = await import("solid-js/web");
    try {
      event = getRequestEvent();
      if (event) {
        const cookie = event.request.headers.get("cookie");
        if (cookie) {
          headers.cookie = cookie;
        }
      }
    } catch (e) {
      console.warn("[API] Failed to get request event for SSR cookie injection", e);
    }
  }

  // Handle FormData (let browser set boundary)
  if (fetchOptions.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      // Audit tip: redundant during SSR but harmless; kept for browser consistency
      credentials: "include",
    });

    // 2. Specialized 401 Handling (throws for router context)
    if (response.status === 401 && strict) {
      const { redirect } = await import("@solidjs/router");
      throw redirect("/login");
    }

    // 3. Error Parsing with consistent ApiError narrowing
    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || "Internal Server Error" };
      }
      
      throw new ApiError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    // 4. Propagate Cookies from Backend to Browser (SSR only)
    if (event) {
      try {
        const { appendResponseHeader } = await import("vinxi/http");
        // Audit tip: Using getSetCookie() is safer than manual splitting
        const setCookies = (response.headers as any).getSetCookie?.() || 
                           response.headers.get("set-cookie")?.split(", ") || [];
        
        setCookies.forEach((cookie: string) => {
          appendResponseHeader(event.nativeEvent, "Set-Cookie", cookie);
        });
      } catch (e) {
        console.warn("[API] Failed to propagate cookies during SSR", e);
      }
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    // 5. Unwrapped Response Handling
    const result = await response.json();
    
    // If the response follows our standard ApiResponse wrapper, unwrap the data
    if (result && typeof result === "object" && "success" in result && "data" in result) {
      return result.data as T;
    }

    return result as T;
  } catch (error) {
    // Re-throw SolidStart redirects/responses
    if (error instanceof Response) {
      throw error;
    }
    
    // Ensure all thrown errors are wrapped or re-thrown properly
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors or other unexpected failures
    // Audit tip: Use status 0 for transport/network failures
    throw new ApiError(
      error instanceof Error ? error.message : "Network request failed",
      0
    );
  }
}


