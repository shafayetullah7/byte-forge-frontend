import { z } from "zod";

/**
 * Zod schema for buyer address form validation
 * Matches backend CreateAddressDto (nestjs-zod)
 */
export const buyerAddressSchema = z.object({
  type: z.enum(["shipping", "billing"]).default("shipping"),
  label: z
    .string()
    .trim()
    .min(1, "buyer.addresses.validation.labelRequired")
    .max(50, "buyer.addresses.validation.labelTooLong"),
  recipientName: z
    .string()
    .trim()
    .min(1, "buyer.addresses.validation.recipientNameRequired")
    .max(100, "buyer.addresses.validation.recipientNameTooLong"),
  phone: z
    .string()
    .trim()
    .min(1, "buyer.addresses.validation.phoneRequired")
    .max(20, "buyer.addresses.validation.phoneTooLong"),
  addressLine1: z
    .string()
    .trim()
    .min(1, "buyer.addresses.validation.addressLine1Required")
    .max(255, "buyer.addresses.validation.addressLine1TooLong"),
  addressLine2: z
    .string()
    .trim()
    .max(255, "buyer.addresses.validation.addressLine2TooLong")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .trim()
    .min(1, "buyer.addresses.validation.cityRequired")
    .max(100, "buyer.addresses.validation.cityTooLong"),
  state: z
    .string()
    .trim()
    .max(100, "buyer.addresses.validation.stateTooLong")
    .optional()
    .or(z.literal("")),
  postalCode: z
    .string()
    .trim()
    .max(20, "buyer.addresses.validation.postalCodeTooLong")
    .optional()
    .or(z.literal("")),
  country: z
    .string()
    .trim()
    .min(1, "buyer.addresses.validation.countryRequired")
    .max(100, "buyer.addresses.validation.countryTooLong")
    .default("Bangladesh"),
  companyName: z
    .string()
    .trim()
    .max(255, "buyer.addresses.validation.companyNameTooLong")
    .optional()
    .or(z.literal("")),
  deliveryInstructions: z
    .string()
    .trim()
    .max(1000, "buyer.addresses.validation.deliveryInstructionsTooLong")
    .optional()
    .or(z.literal("")),
  billingNotes: z
    .string()
    .trim()
    .max(1000, "buyer.addresses.validation.billingNotesTooLong")
    .optional()
    .or(z.literal("")),
  isDefault: z.boolean().default(false),
});

/**
 * Type inferred from the zod schema
 */
export type BuyerAddressFormData = z.infer<typeof buyerAddressSchema>;
