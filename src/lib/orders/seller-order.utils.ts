import type { SellerOrderActionDescriptor } from "~/lib/api/types/seller-orders.types";

export function buildSellerOrderHref(
  orderId: string,
  filterParams?: Record<string, string | number | boolean | undefined>,
): string {
  if (!filterParams) {
    return `/app/seller/orders/${orderId}`;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filterParams)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }

  const returnTo = params.toString();
  const base = `/app/seller/orders/${orderId}`;
  return returnTo ? `${base}?returnTo=${encodeURIComponent(returnTo)}` : base;
}

export function buildSellerOrdersListHref(returnTo?: string | null): string {
  if (!returnTo) return "/app/seller/orders";
  return `/app/seller/orders?${returnTo}`;
}

export function hasSellerOrderAction(
  actions: SellerOrderActionDescriptor[],
  key: SellerOrderActionDescriptor["key"],
): boolean {
  return actions.some((action) => action.key === key && !action.disabled);
}

export function getSellerOrderAction(
  actions: SellerOrderActionDescriptor[],
  key: SellerOrderActionDescriptor["key"],
): SellerOrderActionDescriptor | undefined {
  return actions.find((action) => action.key === key);
}

export function orderContainsProduct(
  order: { items: Array<{ productId: string }> },
  productId: string,
): boolean {
  return order.items.some((item) => item.productId === productId);
}

export function filterOrdersByProduct<T extends { items: Array<{ productId: string }> }>(
  orders: T[],
  productId: string,
): T[] {
  return orders.filter((order) => orderContainsProduct(order, productId));
}

export function flattenProductOrderRows(
  orders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string | null;
    total: string;
    status: string;
    paymentMethodKey: string | null;
    createdAt: string;
    items: Array<{
      productId: string;
      variantTitle: string | null;
      quantity: number;
    }>;
  }>,
  productId: string,
) {
  return orders.flatMap((order) => {
    const matchingItems = order.items.filter((item) => item.productId === productId);
    return matchingItems.map((item) => ({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      variantTitle: item.variantTitle,
      quantity: item.quantity,
      total: order.total,
      status: order.status,
      paymentMethodKey: order.paymentMethodKey,
      createdAt: order.createdAt,
    }));
  });
}
