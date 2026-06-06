import type { ProductFilter } from "~/lib/api/types/seller.types";
import { PRODUCT_STATUS } from "~/lib/api/types/seller.types";
import type { ProductType, ProductStatus } from "~/lib/api/types/seller.types";
import {
  CubeIcon,
  HeartIcon,
  DropletIcon,
} from "~/components/icons";

export interface ProductTypeConfig {
  type: ProductType;
  nameKey: string;
  icon: any;
  href: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBg: string;
}

export const PRODUCT_TYPE_CONFIGS: ProductTypeConfig[] = [
  {
    type: "plant",
    nameKey: "seller.products.types.plants",
    icon: CubeIcon,
    href: "/app/seller/products/plants",
    color: "text-forest-600 dark:text-forest-400",
    bgColor: "bg-forest-50 dark:bg-forest-900/30",
    borderColor: "border-forest-200 dark:border-forest-700",
    hoverBg: "hover:bg-forest-50 dark:hover:bg-forest-900/20",
  },
  {
    type: "pot",
    nameKey: "seller.products.types.pots",
    icon: CubeIcon,
    href: "/app/seller/products/pots",
    color: "text-terracotta-600 dark:text-terracotta-400",
    bgColor: "bg-terracotta-50 dark:bg-terracotta-900/30",
    borderColor: "border-terracotta-200 dark:border-terracotta-700",
    hoverBg: "hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20",
  },
  {
    type: "seed",
    nameKey: "seller.products.types.seeds",
    icon: HeartIcon,
    href: "/app/seller/products/seeds",
    color: "text-sage-600 dark:text-sage-400",
    bgColor: "bg-sage-50 dark:bg-sage-900/30",
    borderColor: "border-sage-200 dark:border-sage-700",
    hoverBg: "hover:bg-sage-50 dark:hover:bg-sage-900/20",
  },
  {
    type: "fertilizer",
    nameKey: "seller.products.types.fertilizer",
    icon: DropletIcon,
    href: "/app/seller/products/fertilizer",
    color: "text-cream-600 dark:text-cream-400",
    bgColor: "bg-cream-50 dark:bg-cream-900/30",
    borderColor: "border-cream-200 dark:border-cream-700",
    hoverBg: "hover:bg-cream-50 dark:hover:bg-cream-900/20",
  },
];

export const SORT_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "createdAt", labelKey: "seller.products.sort.dateCreated" },
  { value: "updatedAt", labelKey: "seller.products.sort.dateUpdated" },
  { value: "name", labelKey: "seller.products.sort.name" },
  { value: "price", labelKey: "seller.products.sort.price" },
  { value: "inventory", labelKey: "seller.products.sort.inventory" },
];

export function getStatusVariant(status: string): "forest" | "cream" | "terracotta" | "default" {
  switch (status) {
    case "ACTIVE": return "forest";
    case "DRAFT": return "cream";
    case "ARCHIVED": return "terracotta";
    default: return "default";
  }
}

export function formatPrice(price: string | number | null | undefined): string {
  if (!price) return "\u2014";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `\u09f3${num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getTypeLabel(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getInventoryLabel(
  count: number,
  t: (key: string, params?: Record<string, any>) => string
): { label: string; variant: "forest" | "cream" | "terracotta" } {
  if (count === 0) return { label: t("seller.products.inventory.outOfStock"), variant: "terracotta" };
  if (count <= 10) return { label: t("seller.products.inventory.left", { count }), variant: "cream" };
  return { label: t("seller.products.inventory.inStock", { count }), variant: "forest" };
}

export function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

export function buildFilterParams(params: {
  page: number;
  limit: number;
  search: string;
  status: string;
  productType: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}): ProductFilter {
  return {
    page: params.page,
    limit: params.limit,
    search: params.search || undefined,
    status: (params.status || undefined) as ProductFilter["status"],
    productType: (params.productType || undefined) as ProductFilter["productType"],
    sortBy: params.sortBy as ProductFilter["sortBy"],
    sortOrder: params.sortOrder,
  };
}

export function computeTypeStats(
  typeConfigs: ProductTypeConfig[],
  data: { productType: string; status: string }[] | undefined
) {
  return typeConfigs.map((config) => {
    const typeProducts = (data ?? []).filter((p) => p.productType === config.type);
    return {
      ...config,
      total: typeProducts.length,
      active: typeProducts.filter((p) => p.status === PRODUCT_STATUS.ACTIVE).length,
      draft: typeProducts.filter((p) => p.status === PRODUCT_STATUS.DRAFT).length,
      archived: typeProducts.filter((p) => p.status === PRODUCT_STATUS.ARCHIVED).length,
    };
  });
}

export function computeStats(data: { status: string }[] | undefined) {
  const items = data ?? [];
  return {
    total: items.length,
    active: items.filter((p) => p.status === PRODUCT_STATUS.ACTIVE).length,
    draft: items.filter((p) => p.status === PRODUCT_STATUS.DRAFT).length,
    archived: items.filter((p) => p.status === PRODUCT_STATUS.ARCHIVED).length,
  };
}
