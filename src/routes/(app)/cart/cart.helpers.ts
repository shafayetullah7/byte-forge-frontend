import type { StockStatus } from "~/lib/api/types/cart.types";
import type { Translator } from "~/i18n";

export function getStockStatusLabel(
  status: StockStatus,
  available: number | null,
  t: Translator,
): { label: string; color: string } {
  switch (status) {
    case "in_stock":
      return { label: t("cart.inStock"), color: "text-forest-600 dark:text-forest-400" };
    case "low_stock":
      return {
        label: t("cart.lowStock", { count: available ?? 0 }),
        color: "text-cream-600 dark:text-cream-400",
      };
    case "out_of_stock":
      return { label: t("cart.outOfStock"), color: "text-terracotta-600 dark:text-terracotta-400" };
  }
}
