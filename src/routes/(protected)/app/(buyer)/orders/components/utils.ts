import type { OrderFilterParams } from "~/lib/api/types/order.types";
import type { StatusType } from "~/components/ui/StatusBadge";

export const ORDER_STATUS_OPTIONS: { value: string; label: string; dotColor?: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "PENDING_PAYMENT", label: "Pending Payment", dotColor: "bg-cream-400" },
  { value: "CONFIRMED", label: "Confirmed", dotColor: "bg-sage-400" },
  { value: "PROCESSING", label: "Processing", dotColor: "bg-cream-400" },
  { value: "SHIPPED", label: "Shipped", dotColor: "bg-forest-400" },
  { value: "DELIVERED", label: "Delivered", dotColor: "bg-forest-500" },
  { value: "CANCELLED", label: "Cancelled", dotColor: "bg-terracotta-400" },
  { value: "EXPIRED", label: "Expired", dotColor: "bg-terracotta-400" },
];

export const PAYMENT_STATUS_OPTIONS: { value: string; label: string; dotColor?: string }[] = [
  { value: "", label: "All Payments" },
  { value: "PENDING", label: "Pending", dotColor: "bg-cream-400" },
  { value: "PROCESSING", label: "Processing", dotColor: "bg-sage-400" },
  { value: "COMPLETED", label: "Completed", dotColor: "bg-forest-500" },
  { value: "FAILED", label: "Failed", dotColor: "bg-terracotta-400" },
  { value: "REFUNDED", label: "Refunded", dotColor: "bg-sage-400" },
  { value: "PARTIALLY_REFUNDED", label: "Partially Refunded", dotColor: "bg-sage-400" },
];

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
