import { z } from "zod";

/**
 * Zod schema for login form validation
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "auth.validation.emailRequired")
    .email("auth.validation.invalidEmail")
    .max(255, "auth.validation.emailTooLong"),
  password: z
    .string()
    .min(1, "auth.validation.passwordRequired")
    .min(8, "auth.validation.passwordMin"),
  rememberMe: z.boolean().optional(),
});

/**
 * Type inferred from the zod schema
 */
export type LoginFormData = z.infer<typeof loginSchema>;
