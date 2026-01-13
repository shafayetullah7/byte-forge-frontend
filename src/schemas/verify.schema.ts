import { z } from "zod";

/**
 * Zod schema for account verification form (OTP)
 */
export const verifySchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

/**
 * Type inferred from the zod schema
 */
export type VerifyFormData = z.infer<typeof verifySchema>;
