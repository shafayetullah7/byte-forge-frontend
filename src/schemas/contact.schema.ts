import { z } from "zod";

/**
 * Zod schema for contact form validation
 * Validates both contact information and social media links
 */
export const contactSchema = z.object({
  // Contact Information
  businessEmail: z
    .string()
    .email("seller.shop.myShop.contactAndSocial.invalidEmail")
    .max(255, "seller.shop.myShop.contactAndSocial.emailTooLong")
    .optional()
    .or(z.literal("")),
  
  phone: z
    .string()
    .min(10, "seller.shop.myShop.contactAndSocial.phoneMin")
    .max(20, "seller.shop.myShop.contactAndSocial.phoneMax")
    .regex(/^[0-9+\-\s()]+$/, "seller.shop.myShop.contactAndSocial.invalidPhone")
    .optional()
    .or(z.literal("")),
  
  alternativePhone: z
    .string()
    .min(10, "seller.shop.myShop.contactAndSocial.phoneMin")
    .max(20, "seller.shop.myShop.contactAndSocial.phoneMax")
    .regex(/^[0-9+\-\s()]+$/, "seller.shop.myShop.contactAndSocial.invalidPhone")
    .optional()
    .or(z.literal("")),
  
  whatsapp: z
    .string()
    .max(20, "seller.shop.myShop.contactAndSocial.whatsappMax")
    .optional(),
  
  telegram: z
    .string()
    .max(50, "seller.shop.myShop.contactAndSocial.telegramMax")
    .optional(),
  
  // Social Media - URLs must start with http:// or https://
  facebook: z
    .string()
    .refine(
      (val) => !val || val === "" || val.startsWith("http://") || val.startsWith("https://"),
      { message: "seller.shop.myShop.contactAndSocial.invalidUrl" }
    )
    .max(255, "seller.shop.myShop.contactAndSocial.urlTooLong")
    .optional()
    .or(z.literal("")),
  
  instagram: z
    .string()
    .refine(
      (val) => !val || val === "" || val.startsWith("http://") || val.startsWith("https://"),
      { message: "seller.shop.myShop.contactAndSocial.invalidUrl" }
    )
    .max(255, "seller.shop.myShop.contactAndSocial.urlTooLong")
    .optional()
    .or(z.literal("")),
  
  x: z
    .string()
    .refine(
      (val) => !val || val === "" || val.startsWith("http://") || val.startsWith("https://"),
      { message: "seller.shop.myShop.contactAndSocial.invalidUrl" }
    )
    .max(255, "seller.shop.myShop.contactAndSocial.urlTooLong")
    .optional()
    .or(z.literal("")),
});

/**
 * Type inferred from the zod schema
 */
export type ContactFormData = z.infer<typeof contactSchema>;
