export interface OrderItem {
  id: string;
  productName: string;
  variantTitle: string | null;
  quantity: number;
  total: string;
  thumbnail: { id: string; url: string } | null;
}

export interface Order {
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
  groups: OrderGroup[];
  stats: OrderStats;
  meta: {
    page: number;
    limit: number;
    total: number;
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
