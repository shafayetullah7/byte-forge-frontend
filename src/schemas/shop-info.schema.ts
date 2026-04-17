import { z } from "zod";

/**
 * Zod schema for shop info form validation
 * Validates shop name, description, business hours (bilingual) and branding colors
 */
export const shopInfoSchema = z.object({
  // Shop slug
  slug: z
    .string()
    .min(3, "message.validation.shop.slugMin")
    .max(50, "message.validation.maxLength")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "message.validation.shop.slugFormat")
    .optional()
    .or(z.literal("")),
  
  // English translations
  nameEn: z
    .string()
    .min(1, "message.validation.notEmpty")
    .max(255, "message.validation.maxLength"),
  descriptionEn: z
    .string()
    .min(10, "message.validation.shop.descriptionMin")
    .max(2000, "message.validation.maxLength")
    .optional()
    .or(z.literal("")),
  businessHoursEn: z
    .string()
    .max(500, "message.validation.maxLength")
    .optional(),
  
  // Bengali translations
  nameBn: z
    .string()
    .min(1, "message.validation.notEmpty")
    .max(255, "message.validation.maxLength"),
  descriptionBn: z
    .string()
    .min(10, "message.validation.shop.descriptionMin")
    .max(2000, "message.validation.maxLength")
    .optional()
    .or(z.literal("")),
  businessHoursBn: z
    .string()
    .max(500, "message.validation.maxLength")
    .optional(),
  
  // Branding colors
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "message.validation.invalidHexColor")
    .optional()
    .or(z.literal("")),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "message.validation.invalidHexColor")
    .optional()
    .or(z.literal("")),
  accentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "message.validation.invalidHexColor")
    .optional()
    .or(z.literal("")),
});

/**
 * Type inferred from the zod schema
 */
export type ShopInfoFormData = z.infer<typeof shopInfoSchema>;
