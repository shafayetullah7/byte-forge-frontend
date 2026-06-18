export type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "EXPIRED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface SellerOrderItem {
  id: string;
  productId: string;
  productName: string;
  variantTitle: string | null;
  sku: string | null;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  imageUrl: string | null;
}

export interface SellerOrderAddress {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
}

export interface SellerOrderShipment {
  id: string;
  trackingNumber: string | null;
  carrier: string | null;
  status: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  estimatedDelivery: string | null;
}

export interface SellerOrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethodKey: string | null;
  paymentMethodDisplayName: string | null;
  total: string;
  createdAt: string;
  customerName: string;
  customerEmail: string | null;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    variantTitle: string | null;
    quantity: number;
    imageUrl: string | null;
  }>;
}

export interface SellerOrderDetail extends SellerOrderSummary {
  paymentMethod: string | null;
  paymentMethodId: string | null;
  paymentMethodLogoUrl: string | null;
  subtotal: string;
  shippingCost: string;
  tax: string;
  notes: string | null;
  cancelledAt: string | null;
  cancelledReason: string | null;
  updatedAt: string;
  customerPhone: string;
  address: SellerOrderAddress | null;
  items: SellerOrderItem[];
  statusHistory: Array<{
    id: string;
    fromStatus: string | null;
    toStatus: string;
    notes: string | null;
    createdAt: string;
  }>;
  shipment: SellerOrderShipment | null;
}

export interface SellerOrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: string;
}

export interface SellerOrderFilterParams {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "total";
  sortOrder?: "asc" | "desc";
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SellerOrderListResponse {
  data: SellerOrderSummary[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UpdateSellerOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
}

export interface ShipSellerOrderRequest {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery?: string;
}

export interface CancelSellerOrderRequest {
  reason: string;
}
