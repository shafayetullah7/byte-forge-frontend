import { fetcher } from "../api-client";
import type {
  CreateUserRequest,
  LoginRequest,
  VerifyEmailRequest,
  RegisterResponse,
  LoginResponse,
  AuthUser,
  ForgotPasswordRequest,
  VerifyResetOtpRequest,
  ResendResetOtpRequest,
  ResetPasswordRequest,
  RefreshTokenResponse,
} from "../types/auth.types";

/**
 * Authentication API endpoints
 *
 * Refactored to use the functional fetcher with unwrapped responses.
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: CreateUserRequest): Promise<RegisterResponse> => {
    return fetcher<RegisterResponse>("/api/v1/user/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return fetcher<LoginResponse>("/api/v1/user/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Check current authentication status
   */
  checkAuth: async (headers?: HeadersInit): Promise<AuthUser> => {
    return fetcher<AuthUser>("/api/v1/user/auth/check", {
      headers,
      strict: false, // Don't redirect on 401 for manual checks
    });
  },

  /**
   * Verify email with OTP
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<null> => {
    return fetcher<null>("/api/v1/user/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Resend email verification code
   */
  sendVerificationEmail: async (): Promise<{ expiresAt: string }> => {
    return fetcher<{ expiresAt: string }>(
      "/api/v1/user/auth/send-verification-email",
      {
        method: "POST",
      }
    );
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    return fetcher<void>("/api/v1/user/auth/logout", {
      method: "POST",
    });
  },

  // === Password Reset ===

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<{ token: string; expiresAt: string }> => {
    return fetcher<{ token: string; expiresAt: string }>(
      "/api/v1/user/password-reset/forgot",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  verifyResetOtp: async (
    data: VerifyResetOtpRequest
  ): Promise<{ token: string; expiresAt: string }> => {
    return fetcher<{ token: string; expiresAt: string }>(
      "/api/v1/user/password-reset/verify",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  resendResetOtp: async (
    data: ResendResetOtpRequest
  ): Promise<{ token: string; expiresAt: string }> => {
    return fetcher<{ token: string; expiresAt: string }>(
      "/api/v1/user/password-reset/resend",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return fetcher<void>("/api/v1/user/password-reset/reset", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Refresh access and refresh tokens
   * Uses the refresh token cookie to get new tokens.
   * Old tokens are invalidated via session ID rotation.
   */
  refreshTokens: async (): Promise<RefreshTokenResponse> => {
    return fetcher<RefreshTokenResponse>("/api/v1/user/auth/refresh", {
      method: "POST",
    });
  },
};
