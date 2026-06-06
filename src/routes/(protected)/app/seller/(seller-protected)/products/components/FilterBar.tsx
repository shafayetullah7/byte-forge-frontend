import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import {
  MagnifyingGlassIcon,
  SortIcon,
  FilterIcon,
  XIcon,
} from "~/components/icons";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { FilterChip } from "./FilterChip";
import { SORT_OPTIONS, getTypeLabel } from "./utils";

export function FilterBar(props: {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  productTypeFilter: string;
  onProductTypeChange: (val: string) => void;
  sortLabel: string;
  showSortPanel: boolean;
  onToggleSortPanel: () => void;
  sortOptions: { value: string; labelKey: string }[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (option: { value: string; labelKey: string }) => void;
  onResetSort: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onClearFilters: () => void;
  onCloseSortPanel: () => void;
}) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm mb-6">
      <div class="p-4">
        <div class="flex flex-col lg:flex-row gap-3">
          <div class="flex-1 relative">
            <input
              type="text"
              placeholder={t("seller.products.searchPlaceholder")}
              value={props.searchQuery}
              onInput={(e) => props.onSearchChange(e.currentTarget.value)}
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 placeholder-gray-400 dark:placeholder-gray-500 transition-standard focus-ring-flat"
            />
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <FilterSelect
            options={[
              { value: "", label: t("seller.products.filters.allStatus") },
              { value: "ACTIVE", label: t("seller.products.filters.statusActive"), dotColor: "bg-forest-500" },
              { value: "DRAFT", label: t("seller.products.filters.statusDraft"), dotColor: "bg-cream-500" },
              { value: "ARCHIVED", label: t("seller.products.filters.statusArchived"), dotColor: "bg-terracotta-500" },
            ]}
            value={props.statusFilter}
            onChange={props.onStatusChange}
          />

          <FilterSelect
            options={[
              { value: "", label: t("seller.products.filters.allTypes") },
              { value: "plant", label: t("seller.products.filters.typePlants") },
              { value: "pot", label: t("seller.products.filters.typePots") },
              { value: "seed", label: t("seller.products.filters.typeSeeds") },
              { value: "fertilizer", label: t("seller.products.filters.typeFertilizers") },
            ]}
            value={props.productTypeFilter}
            onChange={props.onProductTypeChange}
          />

          <div data-sort-panel class="hidden lg:block relative">
            <button
              onClick={props.onToggleSortPanel}
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 transition-standard focus-ring-flat min-w-[200px]"
            >
              <SortIcon class="w-4 h-4 text-gray-400" />
              <span class="text-sm truncate">{props.sortLabel}</span>
            </button>

            <Show when={props.showSortPanel}>
              <div class="absolute right-0 mt-2 w-64 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-lg z-50 overflow-hidden">
                <div class="p-3 border-b border-cream-200 dark:border-forest-700">
                  <p class="text-sm font-semibold text-forest-800 dark:text-cream-100">{t("seller.products.sort.sortBy")}</p>
                </div>
                <div class="p-2">
                  <For each={props.sortOptions}>
                    {(option) => (
                      <button
                        onClick={() => props.onSortChange(option)}
                        class={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                          props.sortBy === option.value
                            ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-700"
                        }`}
                      >
                        <span class="flex items-center gap-2">
                          <span>{t(option.labelKey)}</span>
                        </span>
                        {props.sortBy === option.value && (
                          <span class="text-xs">
                            {props.sortOrder === "asc" ? t("seller.products.sort.asc") : t("seller.products.sort.desc")}
                          </span>
                        )}
                      </button>
                    )}
                  </For>
                </div>
                <div class="p-3 border-t border-cream-200 dark:border-forest-700">
                  <button
                    onClick={props.onResetSort}
                    class="w-full text-center text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
                  >
                    {t("seller.products.sort.resetToDefault")}
                  </button>
                </div>
              </div>
            </Show>
          </div>
        </div>

        <Show when={props.hasActiveFilters}>
          <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FilterIcon class="w-4 h-4 text-gray-400" />
                {t("seller.products.activeFilters")} ({props.activeFilterCount})
              </p>
              <button
                onClick={props.onClearFilters}
                class="text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
              >
                {t("seller.products.clearAll")}
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <Show when={props.searchQuery}>
                <FilterChip
                  label={t("seller.products.filterLabels.search", { query: props.searchQuery })}
                  onRemove={() => props.onSearchChange("")}
                />
              </Show>
              <Show when={props.statusFilter}>
                <FilterChip
                  label={t("seller.products.filterLabels.status", {
                    status: props.statusFilter === "ACTIVE" ? t("seller.products.filters.statusActive") : props.statusFilter === "DRAFT" ? t("seller.products.filters.statusDraft") : t("seller.products.filters.statusArchived"),
                  })}
                  onRemove={() => props.onStatusChange("")}
                />
              </Show>
              <Show when={props.productTypeFilter}>
                <FilterChip
                  label={t("seller.products.filterLabels.type", { type: getTypeLabel(props.productTypeFilter) })}
                  onRemove={() => props.onProductTypeChange("")}
                />
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
