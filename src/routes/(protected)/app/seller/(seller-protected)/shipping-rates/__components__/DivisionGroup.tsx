import type { Component, Accessor } from "solid-js";
import { For, Show } from "solid-js";
import { GlobeAltIcon, CheckCircleIcon } from "~/components/icons";

interface DistrictItem {
  districtId: string;
  districtName: string;
  divisionName: string;
  cost: string;
}

interface DivisionGroupProps {
  divisionName: string;
  districts: DistrictItem[];
  pendingCosts: Accessor<Record<string, string>>;
  selectedIds: Set<string>;
  isSaving: boolean;
  onToggleSelect: (id: string) => void;
  onCostChange: (id: string, val: string) => void;
  onSave: (id: string) => void;
  onBlur: (id: string) => void;
}

export const DivisionGroup: Component<DivisionGroupProps> = (props) => {
  const configuredCount = () => props.districts.filter((d) => d.cost !== "0").length;

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden">
      <div class="px-5 py-3 bg-cream-50 dark:bg-forest-900/50 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <GlobeAltIcon class="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">{props.divisionName}</h3>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {configuredCount()}/{props.districts.length} {props.districts.length === 1 ? "district" : "districts"}
        </span>
      </div>

      <div class="divide-y divide-cream-100 dark:divide-forest-700/50">
        <For each={props.districts}>
          {(item) => {
            const pending = () => props.pendingCosts()[item.districtId];
            const displayCost = () => pending() ?? item.cost;
            const hasChanges = () => pending() !== undefined && pending() !== item.cost;
            const isConfigured = () => item.cost !== "0";
            const isSelected = () => props.selectedIds.has(item.districtId);
            const isSavingThis = () => props.isSaving && hasChanges();

            return (
              <div
                class={`flex items-center gap-3 px-5 py-3 transition-colors ${
                  isSelected() ? "bg-terracotta-50 dark:bg-terracotta-900/20" : "hover:bg-cream-50 dark:hover:bg-forest-900/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected()}
                  onChange={() => props.onToggleSelect(item.districtId)}
                  class="w-4 h-4 rounded border-cream-300 dark:border-forest-600 text-terracotta-600 dark:text-terracotta-500 accent-terracotta-600 dark:accent-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30 cursor-pointer flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.districtName}</p>
                </div>
                <Show when={isConfigured()}>
                  <span class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-900/40 text-xs font-medium text-forest-700 dark:text-forest-400">
                    <CheckCircleIcon class="w-3 h-3" />
                    ৳{item.cost}
                  </span>
                </Show>
                <div class="flex items-center gap-2 w-36 sm:w-40">
                  <Show when={hasChanges()}>
                    <button
                      onClick={() => props.onSave(item.districtId)}
                      disabled={props.isSaving}
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex-shrink-0 text-xs font-semibold"
                    >
                      {isSavingThis() ? (
                        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                          <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h11A1.5 1.5 0 0 1 17 3.5v9l-5 5H4.5A1.5 1.5 0 0 1 3 16v-12.5zM14 2.5a.5.5 0 0 0-.5.5V7h4.5V2.5H14ZM5 12.75a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5H5.75a.75.75 0 0 1-.75-.75Z" />
                        </svg>
                      )}
                    </button>
                  </Show>
                  <div class="relative flex-1">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs">৳</span>
                    <input
                      type="number" step="1" min="0" placeholder="—"
                      value={displayCost()}
                      onInput={(e) => props.onCostChange(item.districtId, e.currentTarget.value)}
                      onBlur={() => props.onBlur(item.districtId)}
                      class={`w-full pl-6 pr-2 py-1.5 rounded-lg border text-sm transition-colors ${
                        isConfigured()
                          ? "border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50"
                          : "border-dashed border-cream-300 dark:border-forest-500 bg-cream-50 dark:bg-forest-900/50 text-gray-500 dark:text-gray-400"
                      } focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20 outline-none`}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};
