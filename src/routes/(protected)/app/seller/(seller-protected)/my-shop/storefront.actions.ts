import { action } from "@solidjs/router";
import {
  replaceValuePoints,
  replaceWhyChooseUs,
  updateStorefrontProfile,
} from "~/lib/api/endpoints/seller/storefront.api";
import { invalidatePublicShop, invalidatePublicShops } from "~/lib/api/endpoints/public/shops.api";
import { getShop } from "~/lib/context/shop-context";
import type {
  ReplaceStorefrontListPayload,
  UpdateStorefrontProfilePayload,
} from "~/lib/shop/storefront.types";
import { ApiError } from "~/lib/api/types";

export type StorefrontMutationResult =
  | { success: true }
  | { success: false; error: { message: string; statusCode?: number } };

async function invalidatePublicShopCaches() {
  const shop = await getShop();
  if (shop?.slug) {
    invalidatePublicShop(shop.slug);
    invalidatePublicShops();
  }
}

async function runStorefrontMutation(
  mutation: () => Promise<unknown>,
): Promise<StorefrontMutationResult> {
  try {
    await mutation();
    await invalidatePublicShopCaches();
    return { success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.response?.message ?? apiError.message,
      },
    };
  }
}

export const updateStorefrontProfileAction = action(
  async (payload: UpdateStorefrontProfilePayload): Promise<StorefrontMutationResult> => {
    "use server";
    return runStorefrontMutation(() => updateStorefrontProfile(payload));
  },
  "update-storefront-profile",
);

export const replaceWhyChooseUsAction = action(
  async (payload: ReplaceStorefrontListPayload): Promise<StorefrontMutationResult> => {
    "use server";
    return runStorefrontMutation(() => replaceWhyChooseUs(payload));
  },
  "replace-why-choose-us",
);

export const replaceValuePointsAction = action(
  async (payload: ReplaceStorefrontListPayload): Promise<StorefrontMutationResult> => {
    "use server";
    return runStorefrontMutation(() => replaceValuePoints(payload));
  },
  "replace-value-points",
);
