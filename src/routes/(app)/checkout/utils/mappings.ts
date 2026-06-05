import type { PriceBreakdown } from "~/lib/api/types/checkout.types";

export function mapShopBreakdownToShopOrderReview(breakdown: PriceBreakdown["shopBreakdowns"][number]) {
  return {
    shopId: breakdown.shopId,
    shopName: breakdown.shopName,
    items: breakdown.items.map((item) => ({
      id: item.id,
      shopId: item.shopId,
      shopName: item.shopName,
      productName: item.productName,
      productSlug: item.productSlug,
      variantTitle: item.variantTitle ?? "",
      quantity: item.quantity,
      price: parseFloat(item.price),
      lineTotal: parseFloat(item.lineTotal),
      thumbnailUrl: item.thumbnail?.url ?? null,
      stockStatus: item.stockStatus as 'in_stock' | 'low_stock' | 'out_of_stock',
    })),
    itemsSubtotal: parseFloat(breakdown.itemsSubtotal),
    shippingCost: parseFloat(breakdown.shippingCost),
    districtId: "",
    districtName: "",
  };
}
