export interface OrderPaymentFields {
  paymentMethod: string | null;
  paymentMethodId?: string | null;
  paymentMethodKey?: string | null;
  paymentMethodDisplayName?: string | null;
  paymentMethodLogoUrl?: string | null;
}

export interface OrderShipment {
  id: string;
  trackingNumber: string | null;
  carrier: string | null;
  status: string;
  shippedAt: string | null;
  deliveredAt: string | null;
}

export interface OrderItem {
  id: string;
  productName: string;
  variantTitle: string | null;
  quantity: number;
  total: string;
  thumbnail: { id: string; url: string } | null;
}

export interface Order extends OrderPaymentFields {
  id: string;
  orderNumber: string;
  shopId: string;
  shopName: string;
  shopLogo: string | null;
  status: string;
  paymentStatus: string;
  total: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderGroup {
  id: string;
  totalAmount: string;
  createdAt: string;
  orders: Order[];
}

export interface OrderStats {
  total: number;
  active: number;
  delivered: number;
  cancelled: number;
  totalSpent: string;
}

export interface OrderListResponse {
  success: boolean;
  message: string;
  data: OrderGroup[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  orderStatus?: string;
  paymentStatus?: string;
  search?: string;
}

// ─── Detailed Order Group Types ──────────────────────────────────────────────

export interface OrderItemDetail {
  id: string;
  productName: string;
  variantTitle: string | null;
  sku: string | null;
  unitPrice: string;
  quantity: number;
  subtotal: string;
  thumbnail: { id: string; url: string } | null;
}

export interface OrderAddressDetail {
  id: string;
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

export interface OrderStatusHistoryDetail {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  notes: string | null;
  createdAt: string;
}

export interface OrderDetail extends OrderPaymentFields {
  id: string;
  orderNumber: string;
  shopId: string;
  shopName: string;
  shopLogo: string | null;
  status: string;
  paymentStatus: string;
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  notes: string | null;
  cancelledAt: string | null;
  cancelledReason: string | null;
  createdAt: string;
  updatedAt: string;
  address: OrderAddressDetail | null;
  items: OrderItemDetail[];
  statusHistory: OrderStatusHistoryDetail[];
  shipment?: OrderShipment | null;
}

export interface OrderGroupDetail {
  id: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  orders: OrderDetail[];
}

export interface OrderGroupDetailResponse {
  success: boolean;
  message: string;
  data: OrderGroupDetail;
}
