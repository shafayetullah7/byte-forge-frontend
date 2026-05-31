import { PaginationParams } from "../types";

/**
 * Address type enum matching backend AddressTypeEnum
 */
export type AddressType = "shipping" | "billing";

/**
 * Address response from the API
 * Matches backend AddressResponseDto
 */
export interface Address {
  id: string;
  type: AddressType;
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  companyName: string | null;
  gstin: string | null;
  deliveryInstructions: string | null;
  billingNotes: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create address request body
 * Matches backend CreateAddressDto (Zod schema)
 */
export interface CreateAddressRequest {
  type?: AddressType;
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  companyName?: string;
  gstin?: string;
  deliveryInstructions?: string;
  billingNotes?: string;
  isDefault?: boolean;
}

/**
 * Update address request body
 * Matches backend UpdateAddressDto (Zod schema) - all fields optional
 */
export interface UpdateAddressRequest {
  type?: AddressType;
  label?: string;
  recipientName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string | null;
  postalCode?: string | null;
  country?: string;
  companyName?: string | null;
  gstin?: string | null;
  deliveryInstructions?: string | null;
  billingNotes?: string | null;
  isDefault?: boolean;
}

/**
 * Query params for listing addresses
 * Extends PaginationParams with type filter
 */
export interface ListAddressesParams extends PaginationParams {
  type?: AddressType | "both";
}
