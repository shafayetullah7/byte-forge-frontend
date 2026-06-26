import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  ReplaceStorefrontListPayload,
  SellerStorefrontData,
  UpdateStorefrontProfilePayload,
} from "~/lib/shop/storefront.types";

type SuccessEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const getSellerStorefront = query(async () => {
  "use server";
  return fetcher<SuccessEnvelope<SellerStorefrontData>>(
    "/api/v1/user/seller/storefront",
    { unwrapData: false },
  );
}, "seller-storefront");

export async function updateStorefrontProfile(
  payload: UpdateStorefrontProfilePayload,
): Promise<SellerStorefrontData> {
  const response = await fetcher<SuccessEnvelope<SellerStorefrontData>>(
    "/api/v1/user/seller/storefront/profile",
    { method: "PUT", body: JSON.stringify(payload), unwrapData: false },
  );
  invalidateSellerStorefront();
  return response.data;
}

export async function replaceWhyChooseUs(
  payload: ReplaceStorefrontListPayload,
): Promise<SellerStorefrontData> {
  const response = await fetcher<SuccessEnvelope<SellerStorefrontData>>(
    "/api/v1/user/seller/storefront/why-choose-us",
    { method: "PUT", body: JSON.stringify(payload), unwrapData: false },
  );
  invalidateSellerStorefront();
  return response.data;
}

export async function replaceValuePoints(
  payload: ReplaceStorefrontListPayload,
): Promise<SellerStorefrontData> {
  const response = await fetcher<SuccessEnvelope<SellerStorefrontData>>(
    "/api/v1/user/seller/storefront/value-points",
    { method: "PUT", body: JSON.stringify(payload), unwrapData: false },
  );
  invalidateSellerStorefront();
  return response.data;
}

export const invalidateSellerStorefront = () => {
  revalidate(getSellerStorefront.keyFor());
};
