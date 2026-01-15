/**
 * Common API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  validationErrors?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
  details?: string;
}

/**
 * Pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Custom API Error class
 *
 * Thrown by the API client for all non-2xx responses.
 * Contains the HTTP status code and the parsed error response from the server.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: ApiErrorResponse
  ) {
    super(message);
    this.name = "ApiError";
  }
}
