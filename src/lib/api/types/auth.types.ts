import { z } from "zod";

/**
 * User Registration Schema (mirrors backend CreateLocalUserDto)
 */
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name cannot be empty" })
    .max(50, { message: "First name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z]+$/, { message: "First name can only contain letters" }),

  lastName: z
    .string()
    .min(1, { message: "Last name cannot be empty" })
    .max(50, { message: "Last name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z]+$/, { message: "Last name can only contain letters" }),

  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username cannot exceed 50 characters" })
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Username can only contain lowercase letters, numbers, and underscores",
    }),

  email: z
    .string()
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email cannot exceed 255 characters" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(255, { message: "Password cannot exceed 255 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;

/**
 * Login Schema (mirrors backend LocalLoginDto)
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .max(255, { message: "Email must not exceed 255 characters" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(255, { message: "Password must not exceed 255 characters" }),
});

export type LoginRequest = z.infer<typeof loginSchema>;

/**
 * Verify Email Schema (mirrors backend VerifyEmailDto)
 */
export const verifyEmailSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only digits" }),
});

export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>;

/**
 * User data returned from authentication endpoints
 */
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Session data returned from login
 */
export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: {
    browser?: string;
    os?: string;
    device?: string;
  };
  ip: string;
  createdAt: string;
  expiresAt: string;
}

/**
 * Registration response
 */
export interface RegisterResponse {
  user: AuthUser;
}

/**
 * Login response
 */
export interface LoginResponse {
  session: UserSession;
  user: AuthUser;
}
// === Password Reset ===
export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  token: string;
  otp: string;
}

export interface ResendResetOtpRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
