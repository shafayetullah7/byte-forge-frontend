import type { Component, Accessor } from "solid-js";
import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import { GlobeAltIcon, CheckCircleIcon, SpinnerIcon, CheckIcon } from "~/components/icons";
import { CurrencyInput } from "./CurrencyInput";

interface DistrictItem {
  districtId: string;
  districtName: string;
  divisionName: string;
  cost: string;
  costPerKg: string;
}

type PendingEntry = { cost?: string; costPerKg?: string };

interface DivisionGroupProps {
  divisionName: string;
  districts: DistrictItem[];
  pendingCosts: Record<string, PendingEntry>;
  selectedIds: Accessor<Set<string>>;
  isSaving: boolean;
  onToggleSelect: (id: string) => void;
  onCostChange: (id: string, val: string) => void;
  onCostPerKgChange: (id: string, val: string) => void;
  onSave: (id: string) => void;
  onBlur: (id: string) => void;
}

export const DivisionGroup: Component<DivisionGroupProps> = (props) => {
  const { t } = useI18n();
  const configuredCount = () => props.districts.filter((d) => d.cost !== "0" || (d.costPerKg !== "0" && d.costPerKg !== undefined && d.costPerKg !== "")).length;

  const getPending = (districtId: string): PendingEntry => {
    return props.pendingCosts[districtId] || {};
  };

  const getDisplayCost = (item: DistrictItem) => {
    const pending = getPending(item.districtId);
    return pending.cost ?? item.cost;
  };

  const getDisplayCostPerKg = (item: DistrictItem) => {
    const pending = getPending(item.districtId);
    return pending.costPerKg ?? item.costPerKg;
  };

  const hasChanges = (item: DistrictItem) => {
    const pending = getPending(item.districtId);
    const costChanged = pending.cost !== undefined && pending.cost !== item.cost;
    const costPerKgChanged = pending.costPerKg !== undefined && pending.costPerKg !== item.costPerKg;
    return costChanged || costPerKgChanged;
  };

  const isConfigured = (item: DistrictItem) => item.cost !== "0";
  const isCostPerKgConfigured = (item: DistrictItem) => item.costPerKg !== "0" && item.costPerKg !== undefined && item.costPerKg !== "";
  const isSavingThis = (item: DistrictItem) => props.isSaving && hasChanges(item);

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden">
      <div class="px-5 py-3 bg-cream-50 dark:bg-forest-900/50 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <GlobeAltIcon class="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">{props.divisionName}</h3>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {configuredCount()}/{props.districts.length} {props.districts.length === 1 ? t("seller.shippingRates.districtSingular") : t("seller.shippingRates.districtPlural")}
        </span>
      </div>

      {/* Column headers */}
      <div class="hidden sm:grid grid-cols-12 gap-3 px-5 py-2 bg-cream-50/50 dark:bg-forest-900/30 border-b border-cream-100 dark:border-forest-700/50 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <div class="col-span-1"></div>
        <div class="col-span-4">{t("seller.shippingRates.columnDistrict")}</div>
        <div class="col-span-2 text-right">{t("seller.shippingRates.columnBaseCost")}</div>
        <div class="col-span-2 text-right">{t("seller.shippingRates.columnCostPerKg")}</div>
        <div class="col-span-3"></div>
      </div>

      <div class="divide-y divide-cream-100 dark:divide-forest-700/50">
        <For each={props.districts}>
          {(item) => {
            const displayCost = () => getDisplayCost(item);
            const displayCostPerKg = () => getDisplayCostPerKg(item);
            const itemHasChanges = () => hasChanges(item);
            const itemConfigured = () => isConfigured(item);
            const isSelected = () => props.selectedIds().has(item.districtId);
            const savingThis = () => isSavingThis(item);

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
                <Show when={itemConfigured()}>
                  <span class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-900/40 text-sm font-medium text-forest-700 dark:text-forest-400">
                    <CheckCircleIcon class="w-3 h-3" />
                    ৳{item.cost}
                  </span>
                </Show>
                <Show when={isCostPerKgConfigured(item)}>
                  <span class="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cream-200 dark:bg-cream-800/40 text-sm font-medium text-cream-800 dark:text-cream-300">
                    <CheckCircleIcon class="w-3 h-3" />
                    ৳{item.costPerKg}/kg
                  </span>
                </Show>
                <div class="flex items-center gap-2">
                  <Show when={itemHasChanges()}>
                    <button
                      onClick={() => props.onSave(item.districtId)}
                      disabled={props.isSaving}
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex-shrink-0 text-xs font-semibold"
                    >
                      {savingThis() ? (
                        <SpinnerIcon class="animate-spin h-4 w-4" />
                      ) : (
                        <CheckIcon class="w-4 h-4" />
                      )}
                    </button>
                  </Show>
                  <div class="flex items-center gap-2 w-36 sm:w-40">
                    <CurrencyInput
                      size="sm"
                      placeholder="—"
                      value={displayCost()}
                      onInput={(e) => props.onCostChange(item.districtId, e.currentTarget.value)}
                      onBlur={() => props.onBlur(item.districtId)}
                      class={`${
                        itemConfigured()
                          ? "border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-800"
                          : "border-dashed border-cream-300 dark:border-forest-500 bg-cream-50 dark:bg-forest-900/50 text-gray-500 dark:text-gray-400"
                      }`}
                    />
                  </div>
                  <div class="flex items-center gap-2 w-32">
                    <CurrencyInput
                      size="sm"
                      placeholder="0"
                      value={displayCostPerKg()}
                      onInput={(e) => props.onCostPerKgChange(item.districtId, e.currentTarget.value)}
                      onBlur={() => props.onBlur(item.districtId)}
                      class={`${
                        isCostPerKgConfigured(item)
                          ? "border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-800"
                          : "border-dashed border-cream-300 dark:border-forest-500 bg-cream-50 dark:bg-forest-900/50 text-gray-500 dark:text-gray-400"
                      }`}
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
