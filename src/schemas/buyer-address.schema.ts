import { z } from "zod";

/**
 * Validation error keys for buyer address form
 * These correspond to translation keys in i18n files
 */
export type BuyerAddressValidationKey =
  | "buyer.addresses.validation.labelRequired"
  | "buyer.addresses.validation.labelTooLong"
  | "buyer.addresses.validation.labelInvalid"
  | "buyer.addresses.validation.recipientNameRequired"
  | "buyer.addresses.validation.recipientNameTooLong"
  | "buyer.addresses.validation.recipientNameInvalid"
  | "buyer.addresses.validation.phoneRequired"
  | "buyer.addresses.validation.phoneTooLong"
  | "buyer.addresses.validation.phoneInvalid"
  | "buyer.addresses.validation.addressLine1Required"
  | "buyer.addresses.validation.addressLine1TooLong"
  | "buyer.addresses.validation.addressLine1Invalid"
  | "buyer.addresses.validation.addressLine2TooLong"
  | "buyer.addresses.validation.addressLine2Invalid"
  | "buyer.addresses.validation.cityRequired"
  | "buyer.addresses.validation.cityTooLong"
  | "buyer.addresses.validation.cityInvalid"
  | "buyer.addresses.validation.stateTooLong"
  | "buyer.addresses.validation.stateInvalid"
  | "buyer.addresses.validation.postalCodeTooLong"
  | "buyer.addresses.validation.postalCodeInvalid"
  | "buyer.addresses.validation.countryRequired"
  | "buyer.addresses.validation.countryTooLong"
  | "buyer.addresses.validation.companyNameTooLong"
  | "buyer.addresses.validation.companyNameInvalid"
  | "buyer.addresses.validation.deliveryInstructionsTooLong"
  | "buyer.addresses.validation.billingNotesTooLong";

// Helper regex patterns (matching backend)
const NAME_PATTERN = /^[a-zA-Z\s\u0980-\u09FF]+$/; // English letters, spaces, and Bengali Unicode range
const PHONE_PATTERN = /^\+?[1-9]\d{1,14}$/; // E.164 format, allows + and 1-15 digits
const POSTAL_CODE_PATTERN = /^\d{4,10}$/; // 4-10 digits for Bangladesh and international
const COMPANY_NAME_PATTERN = /^[a-zA-Z0-9\s\u0980-\u09FF\.\-\&\(\)\,]+$/; // Alphanumeric, spaces, Bengali, and common company name chars

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
    .max(50, "buyer.addresses.validation.labelTooLong")
    .regex(/^[a-zA-Z0-9\s\u0980-\u09FF\-_]+$/, "buyer.addresses.validation.labelInvalid"),
  recipientName: z
    .string()
    .trim()
    .min(1, "buyer.addresses.validation.recipientNameRequired")
    .max(100, "buyer.addresses.validation.recipientNameTooLong")
    .regex(NAME_PATTERN, "buyer.addresses.validation.recipientNameInvalid"),
  phone: z
    .string()
    .trim()
    .min(1, "buyer.addresses.validation.phoneRequired")
    .max(20, "buyer.addresses.validation.phoneTooLong")
    .regex(PHONE_PATTERN, "buyer.addresses.validation.phoneInvalid"),
  addressLine1: z
    .string()
    .trim()
    .min(1, "buyer.addresses.validation.addressLine1Required")
    .max(255, "buyer.addresses.validation.addressLine1TooLong")
    .regex(/^[a-zA-Z0-9\s\u0980-\u09FF\.\-\#\,\/\\]+$/, "buyer.addresses.validation.addressLine1Invalid"),
  addressLine2: z
    .string()
    .trim()
    .max(255, "buyer.addresses.validation.addressLine2TooLong")
    .regex(/^[a-zA-Z0-9\s\u0980-\u09FF\.\-\#\,\/\\]*$/, "buyer.addresses.validation.addressLine2Invalid")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .trim()
    .min(1, "buyer.addresses.validation.cityRequired")
    .max(100, "buyer.addresses.validation.cityTooLong")
    .regex(NAME_PATTERN, "buyer.addresses.validation.cityInvalid"),
  state: z
    .string()
    .trim()
    .max(100, "buyer.addresses.validation.stateTooLong")
    .regex(/^[a-zA-Z\s\u0980-\u09FF]*$/, "buyer.addresses.validation.stateInvalid")
    .optional()
    .or(z.literal("")),
  postalCode: z
    .string()
    .trim()
    .max(20, "buyer.addresses.validation.postalCodeTooLong")
    .regex(POSTAL_CODE_PATTERN, "buyer.addresses.validation.postalCodeInvalid")
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
    .regex(COMPANY_NAME_PATTERN, "buyer.addresses.validation.companyNameInvalid")
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
