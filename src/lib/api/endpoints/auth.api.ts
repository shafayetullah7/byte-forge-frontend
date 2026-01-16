import { api } from "../api-client";
import type {
  CreateUserRequest,
  LoginRequest,
  VerifyEmailRequest,
  RegisterResponse,
  LoginResponse,
  UserSession,
  AuthUser,
  ForgotPasswordRequest,
  VerifyResetOtpRequest,
  ResendResetOtpRequest,
  ResetPasswordRequest,
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
  checkAuth: async (headers?: HeadersInit): Promise<ApiResponse<AuthUser>> => {
    return api.get<ApiResponse<AuthUser>>("/api/v1/user/auth/check", {
      headers,
    });
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
  sendVerificationEmail: async (): Promise<ApiResponse<{ expiresAt: string }>> => {
    return api.post<ApiResponse<{ expiresAt: string }>>(
      "/api/v1/user/auth/send-verification-email"
    );
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    return api.post("/api/v1/user/auth/logout");
  },

  // === Password Reset ===
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<{ token: string; expiresAt: string }>> => {
    return api.post("/api/v1/user/password-reset/forgot", data);
  },

  verifyResetOtp: async (
    data: VerifyResetOtpRequest
  ): Promise<ApiResponse<{ token: string; expiresAt: string }>> => {
    return api.post("/api/v1/user/password-reset/verify", data);
  },

  resendResetOtp: async (
    data: ResendResetOtpRequest
  ): Promise<ApiResponse<{ token: string; expiresAt: string }>> => {
    return api.post("/api/v1/user/password-reset/resend", data);
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ApiResponse<void>> => {
    return api.post("/api/v1/user/password-reset/reset", data);
  },
};
