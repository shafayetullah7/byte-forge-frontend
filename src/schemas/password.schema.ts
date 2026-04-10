import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "auth.validation.passwordMin")
  .max(255, "auth.validation.passwordMax")
  .regex(/[a-z]/, "auth.validation.passwordLowercase")
  .regex(/[A-Z]/, "auth.validation.passwordUppercase")
  .regex(/[0-9]/, "auth.validation.passwordNumber")
  .regex(
    /[^A-Za-z0-9]/,
    "auth.validation.passwordSpecial"
  );
