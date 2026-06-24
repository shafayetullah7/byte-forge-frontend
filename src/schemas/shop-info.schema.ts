import { z } from "zod";

const optionalText = (max: number) =>
  z.string().max(max, "message.validation.maxLength").optional().or(z.literal(""));

export const shopInfoSchema = z.object({
  slug: z
    .string()
    .min(3, "message.validation.shop.slugMin")
    .max(50, "message.validation.maxLength")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "message.validation.shop.slugFormat")
    .optional()
    .or(z.literal("")),
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

export type ShopInfoFormData = z.infer<typeof shopInfoSchema>;

export const storefrontProfileSchema = z.object({
  taglineEn: optionalText(255),
  taglineBn: optionalText(255),
  aboutEn: optionalText(5000),
  aboutBn: optionalText(5000),
  sellerStoryEn: optionalText(5000),
  sellerStoryBn: optionalText(5000),
  brandMissionEn: optionalText(2000),
  brandMissionBn: optionalText(2000),
});

export type StorefrontProfileFormData = z.infer<typeof storefrontProfileSchema>;
