import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z]+$/, "First name must contain only letters"),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z]+$/, "Last name must contain only letters"),

    userName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(
        /^[a-z0-9_]+$/,
        "Username must contain only lowercase letters, numbers, and underscores"
      ),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(255, "Email must be less than 255 characters"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(255, "Password must be less than 255 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    agreeToTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
