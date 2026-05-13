import { PRODUCT_STATUS, PRODUCT_TYPE, type ProductStatus, type ProductType } from "~/lib/api/types/seller.types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getStatusVariant(status: ProductStatus): "forest" | "cream" | "terracotta" | "default" {
  switch (status) {
    case PRODUCT_STATUS.ACTIVE: return "forest";
    case PRODUCT_STATUS.DRAFT: return "cream";
    case PRODUCT_STATUS.ARCHIVED: return "terracotta";
    default: return "default";
  }
}

export function getStatusLabel(status: ProductStatus): string {
  const labels: Record<ProductStatus, string> = {
    [PRODUCT_STATUS.ACTIVE]: "Active",
    [PRODUCT_STATUS.DRAFT]: "Draft",
    [PRODUCT_STATUS.ARCHIVED]: "Archived",
  };
  return labels[status];
}

export function getProductTypeLabel(type: ProductType): string {
  const labels: Record<ProductType, string> = {
    [PRODUCT_TYPE.PLANT]: "Plant",
    [PRODUCT_TYPE.POT]: "Pot",
    [PRODUCT_TYPE.SEED]: "Seed",
    [PRODUCT_TYPE.FERTILIZER]: "Fertilizer",
  };
  return labels[type];
}

export function getProductTypeColor(type: ProductType): { bg: string; text: string; border: string } {
  const colors: Record<ProductType, { bg: string; text: string; border: string }> = {
    [PRODUCT_TYPE.PLANT]: { bg: "bg-forest-100 dark:bg-forest-900/40", text: "text-forest-700 dark:text-forest-300", border: "border-forest-200 dark:border-forest-700" },
    [PRODUCT_TYPE.POT]: { bg: "bg-terracotta-100 dark:bg-terracotta-900/40", text: "text-terracotta-700 dark:text-terracotta-300", border: "border-terracotta-200 dark:border-terracotta-700" },
    [PRODUCT_TYPE.SEED]: { bg: "bg-sage-100 dark:bg-sage-900/40", text: "text-sage-700 dark:text-sage-300", border: "border-sage-200 dark:border-sage-700" },
    [PRODUCT_TYPE.FERTILIZER]: { bg: "bg-cream-100 dark:bg-cream-900/40", text: "text-cream-700 dark:text-cream-300", border: "border-cream-200 dark:border-cream-700" },
  };
  return colors[type];
}

export function getInventoryLabel(count: number, threshold = 10): { label: string; variant: "forest" | "cream" | "terracotta" } {
  if (count === 0) return { label: "Out of Stock", variant: "terracotta" };
  if (count <= threshold) return { label: `Low Stock (${count})`, variant: "cream" };
  return { label: `In Stock (${count})`, variant: "forest" };
}

export function formatPrice(price: string | number | null | undefined): string {
  if (!price) return "\u2014";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `\u09f3${num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = MONTHS[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const month = MONTHS[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minStr = minutes.toString().padStart(2, "0");
  return `${month} ${day}, ${year}, ${hours}:${minStr} ${ampm}`;
}

export function getOrderStatusVariant(status: string): "forest" | "sage" | "cream" | "terracotta" | "default" {
  switch (status) {
    case "DELIVERED": return "forest";
    case "SHIPPED": return "sage";
    case "PROCESSING": return "cream";
    case "CANCELLED": return "terracotta";
    default: return "default";
  }
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DELIVERED: "Delivered",
    SHIPPED: "Shipped",
    PROCESSING: "Processing",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  };
  return labels[status] || status;
}

export function getStockMovementTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    ORDER_RESERVED: "Order Reserved",
    ORDER_FULFILLED: "Order Fulfilled",
    RESTOCK: "Restock",
    STOCK_ADJUSTMENT: "Stock Adjustment",
    RETURN: "Return",
    DAMAGED: "Damaged",
  };
  return labels[type] || type;
}

export function getStockMovementTypeVariant(type: string): { bg: string; text: string } {
  const variants: Record<string, { bg: string; text: string }> = {
    ORDER_RESERVED: { bg: "bg-cream-100 dark:bg-cream-900/40", text: "text-cream-700 dark:text-cream-300" },
    ORDER_FULFILLED: { bg: "bg-forest-100 dark:bg-forest-900/40", text: "text-forest-700 dark:text-forest-300" },
    RESTOCK: { bg: "bg-forest-100 dark:bg-forest-900/40", text: "text-forest-700 dark:text-forest-300" },
    STOCK_ADJUSTMENT: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" },
    RETURN: { bg: "bg-sage-100 dark:bg-sage-900/40", text: "text-sage-700 dark:text-sage-300" },
    DAMAGED: { bg: "bg-terracotta-100 dark:bg-terracotta-900/40", text: "text-terracotta-700 dark:text-terracotta-300" },
  };
  return variants[type] || { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" };
}

export function formatNumber(num: number): string {
  return num.toLocaleString("en-BD");
}

export function formatCurrency(num: number): string {
  return `\u09f3${num.toLocaleString("en-BD")}`;
}
