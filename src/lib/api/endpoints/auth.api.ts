import { api } from "../api-client";
import type {
  CreateUserRequest,
  LoginRequest,
  VerifyEmailRequest,
  RegisterResponse,
  LoginResponse,
  UserSession,
  AuthUser,
} from "../types/auth.types";
import type { ApiResponse } from "../types";

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: async (
    data: CreateUserRequest
  ): Promise<ApiResponse<RegisterResponse>> => {
    return api.post<ApiResponse<RegisterResponse>>(
      "/api/v1/user/auth/register",
      data
    );
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return api.post<ApiResponse<LoginResponse>>(
      "/api/v1/user/auth/login",
      data
    );
  },

  /**
   * Check current authentication status
   */
  checkAuth: async (): Promise<ApiResponse<AuthUser>> => {
    return api.get<ApiResponse<AuthUser>>("/api/v1/user/auth/check");
  },

  /**
   * Verify email with OTP
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>("/api/v1/user/auth/verify-email", data);
  },

  /**
   * Resend email verification code
   */
  sendVerificationEmail: async (): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>(
      "/api/v1/user/auth/send-verification-email"
    );
  },
};
