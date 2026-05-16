import { For, Show, createSignal } from "solid-js";
import Badge from "~/components/ui/Badge";
import {
  DotsVerticalIcon,
  PlusIcon,
  ArrowPathIcon,
  AlertTriangleIcon,
} from "~/components/icons";
import type { VariantInventoryDetail } from "~/lib/api/types/seller.types";
import { formatPrice, getInventoryLabel } from "../../helpers";

interface VariantStockTableProps {
  t: (key: string, ...args: any[]) => string;
  variants: VariantInventoryDetail[];
  onRestock: (variant: VariantInventoryDetail) => void;
  onAdjust: (variant: VariantInventoryDetail) => void;
  onDamaged: (variant: VariantInventoryDetail) => void;
}

export default function VariantStockTable(props: VariantStockTableProps) {
  const [expandedRow, setExpandedRow] = createSignal<string | null>(null);

  const getStockBarColor = (status: string) => {
    switch (status) {
      case "out_of_stock": return "bg-terracotta-500";
      case "low_stock": return "bg-cream-500";
      default: return "bg-forest-500";
    }
  };

  return (
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-cream-200 dark:border-forest-700">
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{props.t("seller.products.inventoryDetail.tableHeaders.variant")}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{props.t("seller.products.inventoryDetail.tableHeaders.sku")}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{props.t("seller.products.inventoryDetail.tableHeaders.price")}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{props.t("seller.products.inventoryDetail.tableHeaders.total")}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{props.t("seller.products.inventoryDetail.tableHeaders.reserved")}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{props.t("seller.products.inventoryDetail.tableHeaders.available")}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{props.t("seller.products.inventoryDetail.tableHeaders.stockLevel")}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{props.t("seller.products.inventoryDetail.tableHeaders.status")}</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{props.t("seller.products.inventoryDetail.tableHeaders.actions")}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-cream-100 dark:divide-forest-700/50">
          <For each={props.variants}>
            {(variant) => {
              const stockPct = variant.quantity > 0
                ? Math.round((variant.availableQuantity / variant.quantity) * 100)
                : 0;
              const label = getInventoryLabel(variant.availableQuantity, variant.lowStockThreshold, props.t);

              return (
                <tr class="hover:bg-cream-50 dark:hover:bg-forest-700/30 transition-colors group">
                  {/* Variant Name */}
                  <td class="px-4 py-3">
                    <p class="font-medium text-forest-800 dark:text-cream-50 truncate max-w-[200px]">
                      {variant.variantName || props.t("seller.products.inventoryDetail.unnamedVariant")}
                    </p>
                  </td>

                  {/* SKU */}
                  <td class="px-4 py-3">
                    <span class="font-mono text-xs text-gray-500 dark:text-gray-400">
                      {variant.sku || "\u2014"}
                    </span>
                  </td>

                  {/* Price */}
                  <td class="px-4 py-3 text-forest-800 dark:text-cream-50">
                    {formatPrice(variant.price)}
                  </td>

                  {/* Total */}
                  <td class="px-4 py-3 font-semibold text-forest-800 dark:text-cream-50">
                    {variant.quantity}
                  </td>

                  {/* Reserved */}
                  <td class="px-4 py-3">
                    <span class={variant.reservedQuantity > 0
                      ? "text-cream-600 dark:text-cream-400 font-medium"
                      : "text-gray-400 dark:text-gray-500"
                    }>
                      {variant.reservedQuantity}
                    </span>
                  </td>

                  {/* Available */}
                  <td class="px-4 py-3">
                    <span class={`font-semibold ${
                      variant.availableQuantity === 0
                        ? "text-terracotta-600 dark:text-terracotta-400"
                        : variant.availableQuantity <= variant.lowStockThreshold
                          ? "text-cream-600 dark:text-cream-400"
                          : "text-forest-600 dark:text-forest-400"
                    }`}>
                      {variant.availableQuantity}
                    </span>
                  </td>

                  {/* Stock Level Bar */}
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <div class="w-16 h-1.5 bg-cream-100 dark:bg-forest-700 rounded-full overflow-hidden">
                        <div
                          class={`h-full rounded-full ${getStockBarColor(variant.status)}`}
                          style={{ width: `${stockPct}%` }}
                        />
                      </div>
                      <span class="text-xs text-gray-400 dark:text-gray-500 w-8 text-right">
                        {stockPct}%
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td class="px-4 py-3">
                    <Badge variant={label.variant} class="text-xs">
                      {label.label}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => props.onRestock(variant)}
                        class="p-1.5 rounded-lg text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-forest-50 dark:hover:bg-forest-700 transition-colors"
                        title={props.t("seller.products.inventoryDetail.restock")}
                      >
                        <PlusIcon class="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => props.onAdjust(variant)}
                        class="p-1.5 rounded-lg text-gray-400 hover:text-cream-600 dark:hover:text-cream-400 hover:bg-cream-50 dark:hover:bg-cream-900/30 transition-colors"
                        title={props.t("seller.products.inventoryDetail.adjustStock")}
                      >
                        <ArrowPathIcon class="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => props.onDamaged(variant)}
                        class="p-1.5 rounded-lg text-gray-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-colors"
                        title={props.t("seller.products.inventoryDetail.markDamaged")}
                      >
                        <AlertTriangleIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>

      {/* Empty state */}
      <Show when={props.variants.length === 0}>
        <div class="text-center py-12">
          <p class="text-sm text-gray-500 dark:text-gray-400">{props.t("seller.products.inventoryDetail.noVariantsFound")}</p>
        </div>
      </Show>
    </div>
  );
}
