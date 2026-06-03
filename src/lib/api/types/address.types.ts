import { PaginationParams } from "../types";

export type AddressType = "shipping" | "billing";

export interface Address {
  id: string;
  type: AddressType;
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  districtId: string;
  divisionId: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  companyName: string | null;
  deliveryInstructions: string | null;
  billingNotes: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  type?: AddressType;
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  districtId: string;
  divisionId: string;
  postalCode?: string | null;
  country?: string;
  companyName?: string | null;
  deliveryInstructions?: string | null;
  billingNotes?: string | null;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  type?: AddressType;
  label?: string;
  recipientName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  districtId?: string;
  divisionId?: string;
  postalCode?: string | null;
  country?: string;
  companyName?: string | null;
  deliveryInstructions?: string | null;
  billingNotes?: string | null;
  isDefault?: boolean;
}

export interface ListAddressesParams extends PaginationParams {
  type?: AddressType | "both";
}
