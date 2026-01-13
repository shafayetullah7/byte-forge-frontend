import { ApiError, type ApiErrorResponse, type ApiResponse } from "./types";
import { type AuthErrorConfig, defaultAuthErrorConfig } from "./config";
import { config } from "../config";

/**
 * API Client Configuration
 */
interface ApiClientConfig {
  baseURL: string;
  headers?: HeadersInit;
  authErrorConfig?: AuthErrorConfig;
  timeout?: number; // Default timeout in ms (client-side)
  serverTimeout?: number; // Server-specific timeout in ms
}

/**
 * Request options for API calls
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number; // Per-request timeout override in ms
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
 */
class ApiClient {
  private config: ApiClientConfig;
  private authErrorConfig: AuthErrorConfig;
  private isRedirecting = false; // Prevent multiple simultaneous redirects
  private activeRequests = new Set<AbortController>(); // Track active requests for cleanup

  constructor(options?: Partial<ApiClientConfig>) {
    this.config = {
      baseURL: options?.baseURL || getBaseURL(),
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      timeout: options?.timeout || config.api.timeout.client,
      serverTimeout: options?.serverTimeout || config.api.timeout.server,
    };
    this.authErrorConfig = {
      ...defaultAuthErrorConfig,
      ...options?.authErrorConfig,
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
   * Handle authentication errors by redirecting to login
   */
  private handleAuthError(endpoint: string, error: ApiError): void {
    // Check if endpoint is excluded from auth redirect
    const isExcluded = this.authErrorConfig.excludedEndpoints?.some(
      (excludedEndpoint) => endpoint.includes(excludedEndpoint)
    );

    if (isExcluded) {
      return; // Don't redirect for excluded endpoints
    }

    // Use custom handler if provided
    if (this.authErrorConfig.onAuthError) {
      this.authErrorConfig.onAuthError(endpoint, error);
      return;
    }

    const loginUrl = this.authErrorConfig.loginUrl || "/login";

    // Server-side (SSR) - mark error for proper handling
    if (typeof window === "undefined") {
      error.isAuthRedirect = true;
      error.redirectUrl = loginUrl;

      // Add helpful error message for developers
      error.message =
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🔒 SSR Authentication Error\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `\n` +
        `Endpoint: ${endpoint}\n` +
        `Status: 401 Unauthorized\n` +
        `Redirect: ${loginUrl}\n` +
        `\n` +
        `This error occurred during server-side rendering.\n` +
        `To handle it properly, wrap your API call:\n` +
        `\n` +
        `❌ Current (won't redirect):\n` +
        `   export const route = {\n` +
        `     load: () => api.get("${endpoint}")\n` +
        `   };\n` +
        `\n` +
        `✅ Correct (will redirect):\n` +
        `   import { protectedLoader } from "~/lib/auth/middleware-auth";\n` +
        `   \n` +
        `   export const route = {\n` +
        `     load: protectedLoader(() => api.get("${endpoint}"))\n` +
        `   };\n` +
        `\n` +
        `Or use withServerAuthRedirect:\n` +
        `   import { withServerAuthRedirect } from "~/lib/api";\n` +
        `   \n` +
        `   export const route = {\n` +
        `     load: () => withServerAuthRedirect(() => api.get("${endpoint}"))\n` +
        `   };\n` +
        `\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

      return; // Let the error propagate
    }

    // Client-side - perform redirect
    // Prevent multiple simultaneous redirects
    if (this.isRedirecting) {
      console.warn(
        `[Auth] Redirect already in progress to ${loginUrl}. ` +
          `Ignoring duplicate 401 from ${endpoint}`
      );
      return;
    }

    this.isRedirecting = true;

    // Clear storage if configured
    if (this.authErrorConfig.clearStorageOnAuthError) {
      const keysToClear = this.authErrorConfig.storageKeysToClear || [];
      console.info(
        `[Auth] Clearing ${keysToClear.length} storage keys before redirect`
      );
      keysToClear.forEach((key) => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (e) {
          console.warn(`Failed to clear storage key: ${key}`, e);
        }
      });
    }

    // Redirect to login page
    console.info(
      `[Auth] Redirecting to ${loginUrl} due to 401 from ${endpoint}`
    );
    window.location.href = loginUrl;
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
   * Make an HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      params,
      headers,
      timeout: requestTimeout,
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
        credentials: "include", // Include cookies for session management
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await parseErrorResponse(response);

        const error = new ApiError(
          errorData.message || "Request failed",
          response.status,
          errorData
        );

        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
          this.handleAuthError(endpoint, error);
        }

        throw error;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (error: any) {
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
