import { z } from "zod";

/**
 * Zod schema for account verification form (OTP)
 */
export const verifySchema = z.object({
  otp: z
    .string()
    .length(6, "auth.validation.otpLength")
    .regex(/^\d+$/, "auth.validation.otpDigits"),
});

/**
 * Type inferred from the zod schema
 */
export type VerifyFormData = z.infer<typeof verifySchema>;
