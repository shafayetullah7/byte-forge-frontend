import { z } from "zod";
import { passwordSchema } from "./password.schema";

// Note: Validation keys are placeholders. Ensuring they exist in dictionaries is next step.
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "auth.validation.firstNameRequired")
      .max(50, "auth.validation.firstNameTooLong")
      .regex(/^[a-zA-Z]+$/, "auth.validation.firstNameAlpha"),

    lastName: z
      .string()
      .min(1, "auth.validation.lastNameRequired")
      .max(50, "auth.validation.lastNameTooLong")
      .regex(/^[a-zA-Z]+$/, "auth.validation.lastNameAlpha"),

    userName: z
      .string()
      .min(3, "auth.validation.userNameMin")
      .max(50, "auth.validation.userNameMax")
      .regex(
        /^[a-z0-9_]+$/,
        "auth.validation.userNameRegex"
      ),

    email: z
      .string()
      .min(1, "auth.validation.emailRequired")
      .email("auth.validation.invalidEmail")
      .max(255, "auth.validation.emailTooLong"),

    password: passwordSchema,

    confirmPassword: z.string().min(1, "auth.validation.confirmPasswordRequired"),

    agreeToTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "auth.validation.agreeToTermsRequired"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.validation.passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
