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
  if (typeof window === "undefined") {
    const { getRequestEvent } = await import("solid-js/web");
    try {
      const event = getRequestEvent();
      // Guard against undefined events in edge runtimes
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

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
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
    throw new ApiError(
      error instanceof Error ? error.message : "Network request failed",
      500
    );
  }
}

/**
 * Legacy support / Convenience wrappers
 */
export const api = {
  get: <T>(endpoint: string, options?: Omit<FetchOptions, "method" | "body">) => 
    fetcher<T>(endpoint, { ...options, method: "GET" }),
  
  post: <T>(endpoint: string, body?: any, options?: Omit<FetchOptions, "method" | "body">) => 
    fetcher<T>(endpoint, { 
      ...options, 
      method: "POST", 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  
  put: <T>(endpoint: string, body?: any, options?: Omit<FetchOptions, "method" | "body">) => 
    fetcher<T>(endpoint, { 
      ...options, 
      method: "PUT", 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  
  patch: <T>(endpoint: string, body?: any, options?: Omit<FetchOptions, "method" | "body">) => 
    fetcher<T>(endpoint, { 
      ...options, 
      method: "PATCH", 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  
  delete: <T>(endpoint: string, options?: Omit<FetchOptions, "method" | "body">) => 
    fetcher<T>(endpoint, { ...options, method: "DELETE" }),
};

