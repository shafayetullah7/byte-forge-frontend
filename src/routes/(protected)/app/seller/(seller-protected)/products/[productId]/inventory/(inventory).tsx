import { createMemo, For } from "solid-js";
import { ErrorBoundary } from "solid-js";
import Badge from "~/components/ui/Badge";
import { SectionErrorFallback } from "~/components/seller/SectionErrorFallback";
import { CubeIcon, ArrowUpIcon, ArrowDownIcon, ClockIcon, AlertTriangleIcon } from "~/components/icons";
import { SectionCard } from "../components/SectionCard";
import { DetailRow } from "../components/DetailRow";
import { formatPrice, formatDate, formatDateTime, getStockMovementTypeLabel, getStockMovementTypeVariant, getInventoryLabel } from "../helpers";
import { MOCK_INVENTORY } from "../mock-data";

export default function ProductInventoryRoute() {
  const inventory = MOCK_INVENTORY;

  const totalReserved = createMemo(() => inventory.variants.reduce((sum, v) => sum + v.reservedStock, 0));
  const totalAvailable = createMemo(() => inventory.variants.reduce((sum, v) => sum + v.availableStock, 0));

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Inventory Summary & Variants */}
      <div class="lg:col-span-2 space-y-6">
        {/* Inventory Overview */}
        <SectionCard
          title="Inventory Overview"
          icon={<CubeIcon class="w-4 h-4 text-gray-400" />}
        >
          <div class="grid grid-cols-3 gap-6 mb-6">
            <div class="text-center p-4 bg-cream-50 dark:bg-forest-900/30 rounded-lg">
              <p class="text-3xl font-bold text-forest-800 dark:text-cream-50">{inventory.totalStock}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Stock</p>
            </div>
            <div class="text-center p-4 bg-cream-50 dark:bg-forest-900/30 rounded-lg">
              <p class="text-3xl font-bold text-cream-600 dark:text-cream-400">{totalReserved()}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Reserved</p>
            </div>
            <div class="text-center p-4 bg-cream-50 dark:bg-forest-900/30 rounded-lg">
              <p class="text-3xl font-bold text-forest-600 dark:text-forest-400">{totalAvailable()}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Available</p>
            </div>
          </div>

          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <AlertTriangleIcon class="w-4 h-4 text-cream-500" />
            <span>Low stock threshold: {inventory.lowStockThreshold} units</span>
          </div>
        </SectionCard>

        {/* Variants Stock */}
        <SectionCard
          title="Variant Stock Levels"
          icon={<CubeIcon class="w-4 h-4 text-gray-400" />}
        >
          <div class="space-y-4">
            <For each={inventory.variants}>
              {(variant) => {
                const stockPercentage = (variant.availableStock / variant.totalStock) * 100;
                const isLowStock = variant.availableStock <= variant.lowStockThreshold;
                const isOutOfStock = variant.availableStock === 0;

                const inventory = getInventoryLabel(variant.availableStock, variant.lowStockThreshold);

                return (
                  <div class="p-4 rounded-lg border border-cream-200 dark:border-forest-700">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">{variant.name}</h4>
                        <Badge variant={inventory.variant} class="text-xs">
                          {inventory.label}
                        </Badge>
                      </div>
                      <span class="text-xs font-mono text-gray-500 dark:text-gray-400">{variant.sku}</span>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
                        <p class="text-lg font-bold text-forest-800 dark:text-cream-50">{variant.totalStock}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Reserved</p>
                        <p class="text-lg font-bold text-cream-600 dark:text-cream-400">{variant.reservedStock}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Available</p>
                        <p class="text-lg font-bold text-forest-600 dark:text-forest-400">{variant.availableStock}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Price</p>
                        <p class="text-lg font-bold text-forest-800 dark:text-cream-50">{formatPrice(variant.price)}</p>
                      </div>
                    </div>

                    {/* Stock Level Bar */}
                    <div class="flex items-center gap-3">
                      <div class="flex-1 h-2 bg-cream-100 dark:bg-forest-700 rounded-full overflow-hidden">
                        <div
                          class={`h-full rounded-full transition-all ${
                            isOutOfStock ? "bg-terracotta-500" : isLowStock ? "bg-cream-500" : "bg-forest-500"
                          }`}
                          style={{ width: `${stockPercentage}%` }}
                        />
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap w-10 text-right">
                        {Math.round(stockPercentage)}%
                      </span>
                    </div>

                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Last updated: {formatDate(variant.lastStockUpdate)}
                    </p>
                  </div>
                );
              }}
            </For>
          </div>
        </SectionCard>
      </div>

      {/* Right Column - Stock Movements */}
      <div class="space-y-6">
        <SectionCard
          title="Stock Movements"
          icon={<ClockIcon class="w-4 h-4 text-gray-400" />}
        >
          <div class="space-y-0">
            <For each={inventory.stockMovements}>
              {(movement) => {
                const typeVariant = getStockMovementTypeVariant(movement.type);
                const isPositive = movement.quantity > 0;

                return (
                  <ErrorBoundary fallback={(error) => <SectionErrorFallback error={error} title="stock movement" />}>
                    <div class="py-3 border-b border-cream-100 dark:border-forest-700/50 last:border-b-0">
                      <div class="flex items-start gap-3">
                        <div class={`mt-0.5 w-7 h-7 rounded-lg ${typeVariant.bg} flex items-center justify-center flex-shrink-0`}>
                          {isPositive ? (
                            <ArrowUpIcon class={`w-3.5 h-3.5 ${typeVariant.text}`} />
                          ) : (
                            <ArrowDownIcon class={`w-3.5 h-3.5 ${typeVariant.text}`} />
                          )}
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between">
                            <span class={`text-xs font-medium px-2 py-0.5 rounded-full ${typeVariant.bg} ${typeVariant.text}`}>
                              {getStockMovementTypeLabel(movement.type)}
                            </span>
                            <span class={`text-sm font-semibold ${isPositive ? "text-forest-600 dark:text-forest-400" : "text-terracotta-600 dark:text-terracotta-400"}`}>
                              {isPositive ? "+" : ""}{movement.quantity}
                            </span>
                          </div>
                          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{movement.note}</p>
                          <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {movement.variantSku} \u00b7 {formatDateTime(movement.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ErrorBoundary>
                );
              }}
            </For>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
