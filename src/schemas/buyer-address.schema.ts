import { z } from "zod";

/**
 * Zod schema for buyer address form validation.
 * Matches backend CreateAddressDto / UpdateAddressDto (nestjs-zod).
 *
 * For nullable optional fields: accepts string | null | undefined.
 * Empty strings are normalized to null in buildDto, not in the schema.
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
    .regex(/^[a-zA-Z\s\u0980-\u09FF]+$/, "buyer.addresses.validation.recipientNameInvalid"),
  phone: z
    .string()
    .trim()
    .min(1, "buyer.addresses.validation.phoneRequired")
    .max(20, "buyer.addresses.validation.phoneTooLong")
    .regex(/^\+?[1-9]\d{1,14}$/, "buyer.addresses.validation.phoneInvalid"),
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
    .nullable()
    .optional(),
  districtId: z
    .string()
    .uuid("buyer.addresses.validation.districtRequired"),
  divisionId: z
    .string()
    .uuid("buyer.addresses.validation.divisionRequired"),
  postalCode: z
    .string()
    .trim()
    .max(20, "buyer.addresses.validation.postalCodeTooLong")
    .refine(
      (val) => val == null || /^\d{4,10}$/.test(val),
      "buyer.addresses.validation.postalCodeInvalid"
    )
    .nullable()
    .optional(),
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
    .nullable()
    .optional(),
  deliveryInstructions: z
    .string()
    .trim()
    .max(1000, "buyer.addresses.validation.deliveryInstructionsTooLong")
    .nullable()
    .optional(),
  billingNotes: z
    .string()
    .trim()
    .max(1000, "buyer.addresses.validation.billingNotesTooLong")
    .nullable()
    .optional(),
  isDefault: z.boolean().default(false),
});

/**
 * Type inferred from the zod schema
 */
export type BuyerAddressFormData = z.infer<typeof buyerAddressSchema>;
