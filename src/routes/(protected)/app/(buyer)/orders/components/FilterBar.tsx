import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import { MagnifyingGlassIcon, XCircleIcon } from "~/components/icons";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { FilterChip } from "./FilterChip";
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "./utils";

export function FilterBar(props: {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  paymentFilter: string;
  onPaymentChange: (val: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
      <div class="px-5 py-4">
        <div class="flex flex-col lg:flex-row gap-3">
          <div class="relative flex-1 min-w-0">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("buyer.orders.searchPlaceholder")}
              value={props.searchQuery}
              onInput={(e) => props.onSearchChange(e.currentTarget.value)}
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:border-forest-500 dark:focus:border-forest-400 focus:ring-2 focus:ring-forest-500/20 transition-colors"
            />
          </div>
          <FilterSelect
            options={ORDER_STATUS_OPTIONS}
            value={props.statusFilter}
            onChange={props.onStatusChange}
            placeholder={t("buyer.orders.filters.allStatuses")}
            class="w-full lg:w-52"
          />
          <FilterSelect
            options={PAYMENT_STATUS_OPTIONS}
            value={props.paymentFilter}
            onChange={props.onPaymentChange}
            placeholder={t("buyer.orders.filters.allPayments")}
            class="w-full lg:w-52"
          />
        </div>

        <Show when={props.hasActiveFilters}>
          <div class="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100 dark:border-forest-700">
            <Show when={props.statusFilter}>
              <FilterChip
                label={ORDER_STATUS_OPTIONS.find((o) => o.value === props.statusFilter)?.label || ""}
                onRemove={() => props.onStatusChange("")}
                colorClass="bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300"
              />
            </Show>
            <Show when={props.paymentFilter}>
              <FilterChip
                label={PAYMENT_STATUS_OPTIONS.find((o) => o.value === props.paymentFilter)?.label || ""}
                onRemove={() => props.onPaymentChange("")}
                colorClass="bg-sage-100 text-sage-700 dark:bg-sage-900/40 dark:text-sage-300"
              />
            </Show>
            <Show when={props.statusFilter || props.paymentFilter}>
              <button
                onClick={props.onClearFilters}
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-forest-700 hover:bg-gray-200 dark:hover:bg-forest-600 transition-colors"
              >
                <XCircleIcon class="w-3.5 h-3.5" />
                {t("buyer.orders.filters.clearAll")}
              </button>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}
