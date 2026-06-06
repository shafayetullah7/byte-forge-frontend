import type { OrderFilterParams } from "~/lib/api/types/order.types";
import type { StatusType } from "~/components/ui/StatusBadge";
import type { FilterOption } from "~/components/ui/FilterSelect";

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

export function getOrderStatusOptions(t: TranslateFn): FilterOption[] {
  return [
    { value: "", label: t("buyer.orders.filters.allStatuses") },
    { value: "PENDING_PAYMENT", label: t("buyer.orders.status.pendingPayment"), dotColor: "bg-cream-400" },
    { value: "CONFIRMED", label: t("buyer.orders.status.confirmed"), dotColor: "bg-sage-400" },
    { value: "PROCESSING", label: t("buyer.orders.status.processing"), dotColor: "bg-cream-400" },
    { value: "SHIPPED", label: t("buyer.orders.status.shipped"), dotColor: "bg-forest-400" },
    { value: "DELIVERED", label: t("buyer.orders.status.delivered"), dotColor: "bg-forest-500" },
    { value: "CANCELLED", label: t("buyer.orders.status.cancelled"), dotColor: "bg-terracotta-400" },
    { value: "EXPIRED", label: t("buyer.orders.status.expired"), dotColor: "bg-terracotta-400" },
  ];
}

export function getPaymentStatusOptions(t: TranslateFn): FilterOption[] {
  return [
    { value: "", label: t("buyer.orders.filters.allPayments") },
    { value: "PENDING", label: t("buyer.orders.payment.pending"), dotColor: "bg-cream-400" },
    { value: "PROCESSING", label: t("buyer.orders.payment.processing"), dotColor: "bg-sage-400" },
    { value: "COMPLETED", label: t("buyer.orders.payment.completed"), dotColor: "bg-forest-500" },
    { value: "FAILED", label: t("buyer.orders.payment.failed"), dotColor: "bg-terracotta-400" },
    { value: "REFUNDED", label: t("buyer.orders.payment.refunded"), dotColor: "bg-sage-400" },
    { value: "PARTIALLY_REFUNDED", label: t("buyer.orders.payment.partiallyRefunded"), dotColor: "bg-sage-400" },
  ];
}

export function mapStatus(status: string): StatusType {
  const s = status.toUpperCase();
  if (s === "DELIVERED") return "delivered";
  if (s === "SHIPPED") return "shipped";
  if (s === "CANCELLED") return "cancelled";
  return "pending";
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "PENDING_PAYMENT": return "border-l-cream-400";
    case "CONFIRMED": return "border-l-sage-400";
    case "PROCESSING": return "border-l-cream-400";
    case "SHIPPED": return "border-l-forest-400";
    case "DELIVERED": return "border-l-forest-500";
    case "CANCELLED": return "border-l-terracotta-400";
    case "EXPIRED": return "border-l-terracotta-400";
    default: return "border-l-gray-300";
  }
}

export function formatTotal(total: string): string {
  return `\u09f3${parseFloat(total).toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getOrderItemsPreview(items: { productName: string }[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0].productName;
  return items.slice(0, 2).map((i) => i.productName).join(", ") + (items.length > 2 ? ` +${items.length - 2}` : "");
}

export function buildFilterParams(params: {
  page: number;
  limit: number;
  statusFilter: string;
  paymentFilter: string;
  searchQuery: string;
}): OrderFilterParams {
  return {
    page: params.page,
    limit: params.limit,
    sortBy: "createdAt",
    sortOrder: "desc",
    orderStatus: (params.statusFilter || undefined) as OrderFilterParams["orderStatus"],
    paymentStatus: (params.paymentFilter || undefined) as OrderFilterParams["paymentStatus"],
    search: (params.searchQuery || undefined) as OrderFilterParams["search"],
  };
}
