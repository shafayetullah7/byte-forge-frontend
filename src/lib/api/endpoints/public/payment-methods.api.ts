import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type { PaymentMethod } from "../../types/checkout.types";

export interface PublicPaymentMethod {
  id: string;
  key: PaymentMethod;
  displayName: string;
  logoId: string | null;
  logoUrl: string | null;
  description: string | null;
}

export const getActivePaymentMethods = query(
  async (): Promise<PublicPaymentMethod[]> => {
    "use server";
    return fetcher<PublicPaymentMethod[]>("/api/v1/payment-methods");
  },
  "public-payment-methods"
);
