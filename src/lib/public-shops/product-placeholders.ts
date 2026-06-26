import type { PublicShopProduct } from "~/lib/types/public/shops.types";

/** Temporary static UI fields until the public products API exposes them. */
const PLACEHOLDER_CATEGORY = "Indoor";

export function mergeProductWithPlaceholders(
  product: PublicShopProduct,
): PublicShopProduct {
  return {
    ...product,
    category: product.category || PLACEHOLDER_CATEGORY,
    isTrending: product.isTrending,
    isStaffPick: product.isStaffPick,
    isCampaignProduct: product.isCampaignProduct,
  };
}
