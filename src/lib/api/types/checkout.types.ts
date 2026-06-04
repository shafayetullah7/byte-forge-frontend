export type StockStatus =
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock';

export interface CheckoutCartItem {
  id: string;
  variantId: string;
  quantity: number;
  price: string;
  lineTotal: string;
  productName: string;
  productSlug: string;
  shopId: string;
  shopName: string;
  thumbnail: { id: string; url: string } | null;
  stockStatus: StockStatus;
  availableQuantity: number | null;
  variantTitle?: string;
  sku?: string;
}

export interface ShopPriceBreakdown {
  shopId: string;
  shopName: string;
  items: CheckoutCartItem[];
  itemsSubtotal: string;
  shippingCost: string;
}

export interface PriceBreakdown {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  shopBreakdowns: ShopPriceBreakdown[];
}

export interface CalculatePriceBreakdownRequest {
  districtId: string;
  addressId?: string;
}

export interface PriceBreakdownResponse {
  breakdown: PriceBreakdown;
}
