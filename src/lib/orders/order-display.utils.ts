import type { OrderPaymentFields } from "~/lib/api/types/order.types";

export type OrderStatusVariant = "forest" | "sage" | "cream" | "terracotta" | "default";

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

export function getPaymentMethodLabel(payment: OrderPaymentFields): string {
  if (payment.paymentMethodDisplayName) return payment.paymentMethodDisplayName;
  if (payment.paymentMethodKey) return payment.paymentMethodKey.replace(/_/g, " ");
  if (payment.paymentMethod) return payment.paymentMethod.replace(/_/g, " ");
  return "—";
}

export function getOrderStatusVariant(status: string): OrderStatusVariant {
  switch (status) {
    case "DELIVERED":
    case "SHIPPED":
      return "forest";
    case "CONFIRMED":
      return "sage";
    case "PROCESSING":
    case "PENDING_PAYMENT":
      return "cream";
    case "CANCELLED":
    case "EXPIRED":
      return "terracotta";
    default:
      return "default";
  }
}

export function getOrderStatusLabel(
  status: string,
  t: TranslateFn,
  paymentMethodKey?: string | null,
): string {
  if (status === "PENDING_PAYMENT" && paymentMethodKey === "COD") {
    return t("buyer.orders.status.pendingPaymentCod");
  }

  const keyMap: Record<string, string> = {
    PENDING_PAYMENT: "buyer.orders.status.pendingPayment",
    CONFIRMED: "buyer.orders.status.confirmed",
    PROCESSING: "buyer.orders.status.processing",
    SHIPPED: "buyer.orders.status.shipped",
    DELIVERED: "buyer.orders.status.delivered",
    CANCELLED: "buyer.orders.status.cancelled",
    EXPIRED: "buyer.orders.status.expired",
  };

  const key = keyMap[status];
  return key ? t(key) : status.replace(/_/g, " ");
}

export function getPaymentStatusLabel(status: string, t: TranslateFn): string {
  const keyMap: Record<string, string> = {
    PENDING: "buyer.orders.payment.pending",
    PROCESSING: "buyer.orders.payment.processing",
    COMPLETED: "buyer.orders.payment.completed",
    FAILED: "buyer.orders.payment.failed",
    REFUNDED: "buyer.orders.payment.refunded",
    PARTIALLY_REFUNDED: "buyer.orders.payment.partiallyRefunded",
  };

  const key = keyMap[status];
  return key ? t(key) : status.replace(/_/g, " ");
}

export function getOrderStatusBorderColor(status: string): string {
  switch (status) {
    case "PENDING_PAYMENT":
      return "border-l-cream-400";
    case "CONFIRMED":
      return "border-l-sage-400";
    case "PROCESSING":
      return "border-l-cream-400";
    case "SHIPPED":
      return "border-l-forest-400";
    case "DELIVERED":
      return "border-l-forest-500";
    case "CANCELLED":
    case "EXPIRED":
      return "border-l-terracotta-400";
    default:
      return "border-l-gray-300";
  }
}

export function mapSidebarStatusParam(status: string | undefined): string | undefined {
  if (!status) return undefined;
  switch (status.toLowerCase()) {
    case "pending":
      return "PENDING_PAYMENT";
    case "delivered":
      return "DELIVERED";
    case "processing":
      return "PROCESSING";
    case "shipped":
      return "SHIPPED";
    case "cancelled":
      return "CANCELLED";
    default:
      return status.toUpperCase();
  }
}
