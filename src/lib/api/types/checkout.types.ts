export interface PriceBreakdown {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  shopBreakdowns: ShopPriceBreakdown[];
}

export interface ShopPriceBreakdown {
  shopId: string;
  shopName: string;
  items: CheckoutCartItem[];
  itemsSubtotal: string;
  shippingCost: string;
}

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
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  availableQuantity: number | null;
  variantTitle?: string;
  sku?: string;
}

export interface PriceBreakdownResponse {
  breakdown: PriceBreakdown;
}

export interface PlaceOrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productId: string;
  productName: string;
  variantTitle: string | null;
  sku: string | null;
  unitPrice: string;
  quantity: number;
  subtotal: string;
}

export interface PlaceOrderAddress {
  id: string;
  orderId: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  companyName: string | null;
  deliveryInstructions: string | null;
}

export interface PlaceOrderStatusHistory {
  id: string;
  orderId: string;
  fromStatus: string | null;
  toStatus: string;
  notes: string | null;
  changedBy: string | null;
}

export interface PlaceOrder {
  id: string;
  orderNumber: string;
  shopId: string;
  shopName: string;
  status: string;
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  paymentStatus: string;
  paymentMethod: string | null;
  items: PlaceOrderItem[];
  address: PlaceOrderAddress | null;
  statusHistory: PlaceOrderStatusHistory[];
}

export interface PlaceOrderGroup {
  id: string;
  orderGroupId: string;
  orderNumbers: string[];
  totalAmount: string;
  orders: {
    orderId: string;
    orderNumber: string;
    shopId: string;
    shopName: string;
    total: string;
    itemCount: number;
  }[];
}

export interface PlaceOrderResponse {
  orderGroup: PlaceOrderGroup;
}
