import { ApiError, type ApiErrorResponse, type ApiResponse } from "./types";
import { config } from "../config";

/**
 * API Client Configuration
 */
interface ApiClientConfig {
  baseURL: string;
  headers?: HeadersInit;
  timeout?: number; // Default timeout in ms (client-side)
  serverTimeout?: number; // Server-specific timeout in ms
  withCredentials?: boolean; // Global default for credentials
}

/**
 * Request options for API calls
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number; // Per-request timeout override in ms
  withCredentials?: boolean; // Per-request credentials override
}

/**
 * Get the API base URL from centralized config
 */
const getBaseURL = (): string => {
  return config.api.baseUrl;
};

/**
 * Build URL with query parameters
 */
const buildURL = (
  baseURL: string,
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string => {
  const url = new URL(endpoint, baseURL);

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
 * Parse error response from API
 */
const parseErrorResponse = async (
  response: Response
): Promise<ApiErrorResponse> => {
  try {
    const data = await response.json();
    return data as ApiErrorResponse;
  } catch {
    return {
      success: false,
      message: response.statusText || "An error occurred",
      statusCode: response.status,
    };
  }
};

/**
 * Core API client class
 *
 * This is a simple, unopinionated HTTP client that:
 * - Makes HTTP requests with proper error handling
 * - Supports timeouts and request cancellation
 * - Handles FormData for file uploads
 * - Includes cookies for session management
 *
 * **Error Handling:**
 * - Throws ApiError for all non-2xx responses
 * - Does NOT automatically redirect on 401
 * - Developers choose how to handle errors (redirect, show UI, ignore, etc.)
 *
 * **Usage:**
 * ```typescript
 * // Direct usage (handle errors yourself)
 * try {
 *   const data = await api.get("/api/v1/user/profile");
 * } catch (error) {
 *   if (error instanceof ApiError && error.statusCode === 401) {
 *     // Handle as you wish: redirect, show login modal, etc.
 *   }
 * }
 *
 * // Or use wrappers for automatic redirect
 * import { withAuthRedirect } from "~/lib/api";
 * const data = await withAuthRedirect(() => api.get("/api/v1/user/profile"));
 * ```
 */
class ApiClient {
  private config: ApiClientConfig;
  private activeRequests = new Set<AbortController>(); // Track active requests for cleanup
  private isRedirecting = false; // Fix #2: Debounce multiple 401 redirects

  constructor(options?: Partial<ApiClientConfig>) {
    this.config = {
      baseURL: options?.baseURL || getBaseURL(),
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      timeout: options?.timeout || config.api.timeout.client,
      serverTimeout: options?.serverTimeout || config.api.timeout.server,
      withCredentials: options?.withCredentials ?? true,
    };
  }

  /**
   * Abort all active requests
   */
  public abortAll(): void {
    if (this.activeRequests.size > 0) {
      console.info(
        `[Api] Aborting ${this.activeRequests.size} active requests`
      );
      this.activeRequests.forEach((controller) => controller.abort());
      this.activeRequests.clear();
    }
  }

  /**
   * Get appropriate timeout based on environment
   * @param requestTimeout - Per-request timeout override
   * @returns Timeout in milliseconds
   */
  private getTimeout(requestTimeout?: number): number {
    // Per-request override takes precedence
    if (requestTimeout !== undefined) {
      return requestTimeout;
    }

    // Use server timeout for SSR, client timeout for browser
    const isServer = typeof window === "undefined";
    return isServer
      ? this.config.serverTimeout || 10000
      : this.config.timeout || 30000;
  }

  /**
   * Handle 401 Unauthorized responses with critical fixes
   * 
   * Critical Fixes Applied:
   * 1. Prevent infinite redirect loop
   * 2. Debounce multiple simultaneous 401s
   * 3. Proper SSR/CSR handling
   * 4. Session cache invalidation
   */
  private async handle401(): Promise<never> {
    const isServer = typeof window === "undefined";

    if (isServer) {
      // SSR: Use SolidStart's redirect
      const { redirect } = await import("@solidjs/router");
      throw redirect("/login");
    }

    // CSR: Client-side handling
    
    // Fix #1: Prevent infinite redirect loop
    const currentPath = window.location.pathname;
    if (currentPath === "/login" || currentPath === "/register") {
      // Already on auth page, don't redirect
      throw new ApiError("Unauthorized", 401);
    }

    // Fix #2: Debounce multiple 401 redirects
    if (this.isRedirecting) {
      throw new ApiError("Already redirecting to login", 401);
    }

    this.isRedirecting = true;

    // Fix #5: Invalidate session cache
    try {
      const { revalidate } = await import("@solidjs/router");
      revalidate("user-session");
    } catch (e) {
      // Revalidate might fail in some contexts, that's okay
      console.warn("[Auth] Could not revalidate session cache");
    }

    // Hard redirect to clear all state
    window.location.href = "/login";
    
    // Throw to stop execution
    throw new ApiError("Unauthorized - redirecting to login", 401);
  }

  /**
   * Handle response and check for errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle 401 Unauthorized with critical fixes
    if (response.status === 401) {
      return this.handle401();
    }

    // Handle other non-OK responses
    if (!response.ok) {
      const errorData = await parseErrorResponse(response);
      throw new ApiError(
        errorData.message || "Request failed",
        response.status,
        errorData
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;
  }

  /**
   * Make an HTTP request
   *
   * This method handles all HTTP communication with the backend.
   * 401 errors are automatically handled with redirect to login.
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      params,
      headers,
      timeout: requestTimeout,
      withCredentials,
      ...fetchOptions
    } = options;

    const url = buildURL(this.config.baseURL, endpoint, params);
    const timeout = this.getTimeout(requestTimeout);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    // Add to active requests tracking
    this.activeRequests.add(controller);

    try {
      // Merge headers and remove undefined values
      const mergedHeaders = {
        ...this.config.headers,
        ...headers,
      } as Record<string, string>;

      // Remove Content-Type if body is FormData to let browser set boundary
      if (fetchOptions.body instanceof FormData) {
        delete mergedHeaders["Content-Type"];
      }

      // Filter out any undefined values that might have been passed
      const finalHeaders = Object.fromEntries(
        Object.entries(mergedHeaders).filter(([_, v]) => v !== undefined)
      );

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal, // Add abort signal for timeout
        headers: finalHeaders,
        credentials:
          withCredentials ?? this.config.withCredentials ? "include" : "omit",
      });

      // Use centralized response handler (includes 401 handling)
      return this.handleResponse<T>(response);

    } catch (error: any) {
      // Fix #3 & #4: Don't catch Response objects (SSR redirects)
      if (error instanceof Response) {
        throw error;
      }
      // Handle timeout/abort errors
      if (error.name === "AbortError") {
        const isServer = typeof window === "undefined";
        const envLabel = isServer ? "[SSR]" : "[Client]";

        throw new ApiError(`Request timeout after ${timeout}ms`, 408, {
          success: false,
          message: `${envLabel} Request to ${endpoint} timed out after ${timeout}ms`,
          statusCode: 408,
          error: "Request Timeout",
        });
      }

      // Re-throw other errors
      throw error;
    } finally {
      // Cleanup: clear timeout and remove from active requests
      clearTimeout(timeoutId);
      this.activeRequests.delete(controller);
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    options?: Omit<RequestOptions, "body" | "method">
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body" | "method">
  ): Promise<T> {
    const isFormData = body instanceof FormData;
    const headers: HeadersInit = { ...options?.headers };

    // Remove Content-Type if using FormData to let fetch set it with boundary
    if (isFormData && (this.config.headers as any)?.["Content-Type"]) {
      // Create a copy of headers without Content-Type for this request
    }

    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: isFormData
        ? (body as any)
        : body
        ? JSON.stringify(body)
        : undefined,
      headers: isFormData
        ? { ...headers, "Content-Type": undefined as any } // Let browser set boundary
        : headers,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body" | "method">
  ): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: isFormData
        ? (body as any)
        : body
        ? JSON.stringify(body)
        : undefined,
      headers: isFormData
        ? { ...options?.headers, "Content-Type": undefined as any }
        : options?.headers,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body" | "method">
  ): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: isFormData
        ? (body as any)
        : body
        ? JSON.stringify(body)
        : undefined,
      headers: isFormData
        ? { ...options?.headers, "Content-Type": undefined as any }
        : options?.headers,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options?: Omit<RequestOptions, "body" | "method">
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

/**
 * Singleton API client instance
 */
export const api = new ApiClient();
