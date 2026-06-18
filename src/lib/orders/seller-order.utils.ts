import type { SellerOrderSummary } from "~/lib/api/types/seller-orders.types";

export function orderContainsProduct(order: SellerOrderSummary, productId: string): boolean {
  return order.items.some((item) => item.productId === productId);
}

export function filterOrdersByProduct(
  orders: SellerOrderSummary[],
  productId: string,
): SellerOrderSummary[] {
  return orders.filter((order) => orderContainsProduct(order, productId));
}

export function flattenProductOrderRows(
  orders: SellerOrderSummary[],
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
