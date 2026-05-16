import { For, Show, createMemo, createSignal } from "solid-js";
import { ChevronDownIcon, FilterIcon, XIcon, SpinnerIcon, ClockIcon, ArrowUpIcon, ArrowDownIcon, ArrowsRightLeftIcon } from "~/components/icons";
import {
  getStockMovementTypeLabel,
  getStockMovementTypeVariant,
  formatDateTime,
} from "../../helpers";
import type { InventoryMovement } from "~/lib/api/types/seller.types";
import { INVENTORY_MOVEMENT_TYPE } from "~/lib/api/types/seller.types";

interface StockMovementsTimelineProps {
  movements: InventoryMovement[] | undefined;
  isLoading: boolean;
  error?: Error | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: MovementFilters) => void;
  activeFilters: MovementFilters;
}

export interface MovementFilters {
  variantId?: string;
  movementType?: string;
}

const MOVEMENT_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: INVENTORY_MOVEMENT_TYPE.INITIAL_STOCK, label: "Initial Stock" },
  { value: INVENTORY_MOVEMENT_TYPE.RESTOCK, label: "Restock" },
  { value: INVENTORY_MOVEMENT_TYPE.ORDER_RESERVED, label: "Order Reserved" },
  { value: INVENTORY_MOVEMENT_TYPE.ORDER_FULFILLED, label: "Order Fulfilled" },
  { value: INVENTORY_MOVEMENT_TYPE.ORDER_CANCELLED, label: "Order Cancelled" },
  { value: INVENTORY_MOVEMENT_TYPE.CUSTOMER_RETURN, label: "Customer Return" },
  { value: INVENTORY_MOVEMENT_TYPE.DAMAGED, label: "Damaged" },
  { value: INVENTORY_MOVEMENT_TYPE.LOST, label: "Lost" },
  { value: INVENTORY_MOVEMENT_TYPE.ADJUSTMENT, label: "Adjustment" },
  { value: INVENTORY_MOVEMENT_TYPE.TRANSFER_OUT, label: "Transfer Out" },
  { value: INVENTORY_MOVEMENT_TYPE.TRANSFER_IN, label: "Transfer In" },
];

export default function StockMovementsTimeline(props: StockMovementsTimelineProps) {
  const [showFilters, setShowFilters] = createSignal(false);

  const hasActiveFilters = createMemo(
    () => !!(props.activeFilters.variantId || props.activeFilters.movementType)
  );

  const timeAgo = (dateStr: string): string => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const handleTypeFilter = (value: string) => {
    props.onFilterChange({
      ...props.activeFilters,
      movementType: value || undefined,
    });
  };

  return (
    <div class="space-y-4">
      {/* Filter Bar */}
      <div class="flex items-center gap-2">
        <button
          onClick={() => setShowFilters(!showFilters())}
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cream-200 dark:border-forest-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors"
        >
          <FilterIcon class="w-4 h-4" />
          Filters
          <Show when={hasActiveFilters()}>
            <span class="w-2 h-2 rounded-full bg-forest-500" />
          </Show>
          <ChevronDownIcon
            class={`w-3.5 h-3.5 transition-transform ${showFilters() ? "rotate-180" : ""}`}
          />
        </button>

        <Show when={hasActiveFilters()}>
          <button
            onClick={() => props.onFilterChange({})}
            class="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors"
          >
            <XIcon class="w-3 h-3" />
            Clear all
          </button>
        </Show>
      </div>

      {/* Filter Panel */}
      <Show when={showFilters()}>
        <div class="p-4 bg-cream-50 dark:bg-forest-900/30 rounded-lg border border-cream-200 dark:border-forest-700 space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Movement Type
              </label>
              <select
                value={props.activeFilters.movementType || ""}
                onChange={(e) => handleTypeFilter(e.currentTarget.value)}
                class="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-forest-700 text-sm bg-white dark:bg-forest-900/50 text-gray-700 dark:text-gray-300 focus:border-forest-500 dark:focus:border-forest-400 focus:outline-none"
              >
                <For each={MOVEMENT_TYPE_OPTIONS}>
                  {(opt) => <option value={opt.value}>{opt.label}</option>}
                </For>
              </select>
            </div>
          </div>
        </div>
      </Show>

      {/* Loading State */}
      <Show when={props.isLoading}>
        <div class="flex items-center justify-center py-12">
          <SpinnerIcon class="w-6 h-6 text-gray-400 animate-spin" />
          <span class="ml-3 text-sm text-gray-500 dark:text-gray-400">Loading movements...</span>
        </div>
      </Show>

      {/* Error State */}
      <Show when={props.error}>
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-700 dark:text-red-400">
            Failed to load stock movements: {props.error?.message}
          </p>
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!props.isLoading && (!props.movements || props.movements.length === 0)}>
        <div class="text-center py-12">
          <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-forest-700 flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">No stock movements found</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {hasActiveFilters()
              ? "Try adjusting your filters"
              : "Stock movements will appear here when inventory changes"}
          </p>
        </div>
      </Show>

      {/* Timeline */}
      <Show when={!props.isLoading && props.movements && props.movements.length > 0}>
        <div class="space-y-0">
          <For each={props.movements}>
            {(movement) => {
              const typeVariant = getStockMovementTypeVariant(movement.movementType);
              const isPositive = movement.quantityChange > 0;
              const isNeutral = movement.quantityChange === 0;

              return (
                <div class="py-3 border-b border-cream-100 dark:border-forest-700/50 last:border-b-0 group hover:bg-cream-50/50 dark:hover:bg-forest-700/20 -mx-2 px-2 rounded-lg transition-colors">
                  <div class="flex items-start gap-3">
                    {/* Icon */}
                    <div class={`mt-0.5 w-7 h-7 rounded-lg ${typeVariant.bg} flex items-center justify-center flex-shrink-0`}>
                      {isPositive ? (
                        <ArrowDownIcon class={`w-3.5 h-3.5 ${typeVariant.text}`} />
                      ) : isNeutral ? (
                        <ArrowsRightLeftIcon class={`w-3.5 h-3.5 ${typeVariant.text}`} />
                      ) : (
                        <ArrowUpIcon class={`w-3.5 h-3.5 ${typeVariant.text}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                          <span class={`text-xs font-medium px-2 py-0.5 rounded-full ${typeVariant.bg} ${typeVariant.text} whitespace-nowrap`}>
                            {getStockMovementTypeLabel(movement.movementType)}
                          </span>
                          <Show when={movement.variantSku}>
                            <span class="text-xs text-gray-400 dark:text-gray-500 truncate font-mono">
                              {movement.variantSku}
                            </span>
                          </Show>
                        </div>
                        <span class={`text-sm font-semibold whitespace-nowrap ${
                          isPositive
                            ? "text-forest-600 dark:text-forest-400"
                            : isNeutral
                              ? "text-gray-500 dark:text-gray-400"
                              : "text-terracotta-600 dark:text-terracotta-400"
                        }`}>
                          {isPositive ? "+" : ""}{movement.quantityChange}
                        </span>
                      </div>

                      {/* Details */}
                      <Show when={movement.reason}>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{movement.reason}</p>
                      </Show>

                      <div class="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                        <span>{timeAgo(movement.createdAt)}</span>
                        <span>\u00b7</span>
                        <span>{formatDateTime(movement.createdAt)}</span>
                        <Show when={movement.referenceType}>
                          <span>\u00b7</span>
                          <span class="font-mono">{movement.referenceType}: {movement.referenceId}</span>
                        </Show>
                      </div>

                      {/* Stock snapshot */}
                      <div class="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                        <span>Qty: <span class="font-medium text-gray-600 dark:text-gray-400">{movement.previousQuantity}</span> \u2192 <span class="font-medium text-gray-600 dark:text-gray-400">{movement.newQuantity}</span></span>
                        <span>Reserved: <span class="font-medium text-gray-600 dark:text-gray-400">{movement.previousReserved}</span> \u2192 <span class="font-medium text-gray-600 dark:text-gray-400">{movement.newReserved}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </For>
        </div>

        {/* Pagination */}
        <Show when={props.totalPages > 1}>
          <div class="flex items-center justify-between pt-4 border-t border-cream-200 dark:border-forest-700">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Page {props.currentPage} of {props.totalPages}
            </p>
            <div class="flex items-center gap-1">
              <button
                onClick={() => props.onPageChange(props.currentPage - 1)}
                disabled={props.currentPage <= 1}
                class="px-3 py-1.5 rounded-lg text-xs font-medium border border-cream-200 dark:border-forest-700 text-gray-600 dark:text-gray-400 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => props.onPageChange(props.currentPage + 1)}
                disabled={props.currentPage >= props.totalPages}
                class="px-3 py-1.5 rounded-lg text-xs font-medium border border-cream-200 dark:border-forest-700 text-gray-600 dark:text-gray-400 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
}
