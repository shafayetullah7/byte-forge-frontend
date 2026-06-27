import { action } from "@solidjs/router";
import {
  sellerShopApi,
  type UpdateAddressDto,
  type UpdateContactDto,
  type UpdateShopInfoDto,
} from "~/lib/api/endpoints/seller/shop-detail.api";
import { invalidatePublicShop, invalidatePublicShops } from "~/lib/api/endpoints/public/shops.api";
import { getShop, refetchShop, refetchShopStatus } from "~/lib/context/shop-context";
import { ApiError } from "~/lib/api/types";

export type ShopMutationResult =
  | { success: true }
  | {
      success: false;
      error: {
        message: string;
        statusCode?: number;
        validationErrors?: Array<{ field: string; message: string }>;
      };
    };

async function invalidatePublicShopCaches() {
  const shop = await getShop();
  if (shop?.slug) {
    invalidatePublicShop(shop.slug);
    invalidatePublicShops();
  }
}

function shopMutationError(error: unknown): ShopMutationResult {
  const apiError = error as ApiError;
  return {
    success: false,
    error: {
      statusCode: apiError.statusCode,
      message: apiError.response?.message ?? apiError.message,
      validationErrors: apiError.response?.validationErrors,
    },
  };
}

async function runShopMutation(
  mutation: () => Promise<unknown>,
): Promise<ShopMutationResult> {
  try {
    await mutation();
    refetchShop();
    refetchShopStatus();
    await invalidatePublicShopCaches();
    return { success: true };
  } catch (error) {
    return shopMutationError(error);
  }
}

export const updateAddressAction = action(
  async (data: UpdateAddressDto): Promise<ShopMutationResult> => {
    "use server";
    return runShopMutation(() => sellerShopApi.updateAddress(data));
  },
  "update-address-action",
);

export const updateContactAction = action(
  async (data: UpdateContactDto): Promise<ShopMutationResult> => {
    "use server";
    return runShopMutation(() => sellerShopApi.updateContact(data));
  },
  "update-contact-action",
);

export const updateBrandingAction = action(
  async (data: { logoId?: string; bannerId?: string }): Promise<ShopMutationResult> => {
    "use server";
    return runShopMutation(async () => {
      const currentShop = await getShop();
      const enTrans = currentShop?.translations?.find((tr) => tr.locale === "en");
      const bnTrans = currentShop?.translations?.find((tr) => tr.locale === "bn");

      await sellerShopApi.updateShopInfo({
        branding:
          data.logoId || data.bannerId
            ? { logoId: data.logoId, bannerId: data.bannerId }
            : undefined,
        translations: {
          en: {
            name: enTrans?.name || "",
            description: enTrans?.description || "",
            businessHours: enTrans?.businessHours || "",
          },
          bn: {
            name: bnTrans?.name || "",
            description: bnTrans?.description || "",
            businessHours: bnTrans?.businessHours || "",
          },
        },
      });
    });
  },
  "update-branding-action",
);

export const updateShopInfoAction = action(
  async (dto: UpdateShopInfoDto): Promise<ShopMutationResult> => {
    "use server";
    return runShopMutation(() => sellerShopApi.updateShopInfo(dto));
  },
  "update-shop-info",
);

export const submitShopForReviewAction = action(
  async (dto: UpdateShopInfoDto): Promise<ShopMutationResult> => {
    "use server";
    return runShopMutation(() => sellerShopApi.submitForReview(dto));
  },
  "submit-shop-for-review",
);

export const deleteShopAction = action(async (): Promise<ShopMutationResult> => {
  "use server";
  try {
    await sellerShopApi.delete();
    refetchShop();
    refetchShopStatus();
    return { success: true };
  } catch (error) {
    return shopMutationError(error);
  }
}, "delete-shop");
