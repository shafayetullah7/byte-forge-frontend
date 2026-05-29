import { createAsync, action, useAction, revalidate } from "@solidjs/router";
import {
  createSignal,
  createMemo,
  For,
  Show,
} from "solid-js";
import { useI18n } from "~/i18n";
import { getShippingRates, bulkUpdateShippingRates } from "~/lib/api/endpoints/seller/shipping-rates.api";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { toaster } from "~/components/ui/Toast";
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  DollarSignIcon,
  SparklesIcon,
} from "~/components/icons";

const updateShippingRatesAction = action(
  async (rates: Array<{ districtId: string; cost: string }>) => {
    "use server";
    await bulkUpdateShippingRates({ rates });
    revalidate(getShippingRates.keyFor());
  },
  "update-shipping-rates-action"
);

export default function ShippingRatesPage() {
  const { t } = useI18n();
  const ratesData = createAsync(() => getShippingRates());
  const [searchQuery, setSearchQuery] = createSignal("");
  const [setAllCost, setSetAllCost] = createSignal("");
  const [bulkCost, setBulkCost] = createSignal("");
  const [selectedIds, setSelectedIds] = createSignal<Set<string>>(new Set());
  const [pendingCosts, setPendingCosts] = createSignal<Record<string, string>>({});
  const [isSaving, setIsSaving] = createSignal(false);

  const updateRatesAction = useAction(updateShippingRatesAction);

  const allDistricts = createMemo(() => ratesData() || []);

  const groupedDistricts = createMemo(() => {
    const q = searchQuery().toLowerCase();
    const filtered = allDistricts().filter((item) => {
      if (!q) return true;
      const name = item.districtName.toLowerCase();
      const division = item.divisionName.toLowerCase();
      return name.includes(q) || division.includes(q);
    });

    const groups = new Map<string, typeof filtered>();
    for (const item of filtered) {
      const existing = groups.get(item.divisionName) || [];
      existing.push(item);
      groups.set(item.divisionName, existing);
    }

    return Array.from(groups.entries()).map(([divisionName, districts]) => ({
      divisionName,
      districts,
    }));
  });

  const stats = createMemo(() => {
    const total = allDistricts().length;
    let configured = 0;
    let freeCount = 0;
    let costSum = 0;
    for (const item of allDistricts()) {
      const num = parseFloat(item.cost);
      if (!isNaN(num)) {
        configured++;
        if (num === 0) freeCount++;
        costSum += num;
      }
    }
    return { total, configured, freeCount, avg: configured > 0 ? Math.round(costSum / configured) : 0 };
  });

  const handleSetAll = async () => {
    const cost = setAllCost();
    if (!cost) return;
    const num = parseFloat(cost);
    if (isNaN(num) || num < 0) return;
    const rates = allDistricts().map((item) => ({ districtId: item.districtId, cost }));
    setIsSaving(true);
    try {
      await updateRatesAction(rates);
      toaster.success(t("seller.shippingRates.allUpdated"));
    } catch (error: any) {
      toaster.error(error.message || t("seller.shippingRates.updateFailed"));
    } finally {
      setIsSaving(false);
    }
    setSetAllCost("");
  };

  const handleBulkUpdate = async () => {
    const cost = bulkCost();
    if (!cost || selectedIds().size === 0) return;
    const num = parseFloat(cost);
    if (isNaN(num) || num < 0) return;
    const rates = Array.from(selectedIds()).map((id) => ({ districtId: id, cost }));
    setIsSaving(true);
    try {
      await updateRatesAction(rates);
      toaster.success(t("seller.shippingRates.bulkUpdated", { count: rates.length }));
    } catch (error: any) {
      toaster.error(error.message || t("seller.shippingRates.updateFailed"));
    } finally {
      setIsSaving(false);
    }
    setSelectedIds(new Set<string>());
    setBulkCost("");
  };

  const handleSave = async (districtId: string) => {
    const cost = pendingCosts()[districtId];
    if (cost === undefined) return;
    setIsSaving(true);
    try {
      await updateRatesAction([{ districtId, cost: cost || "0" }]);
      toaster.success(t("seller.shippingRates.rateUpdated"));
    } catch (error: any) {
      toaster.error(error.message || t("seller.shippingRates.updateFailed"));
    } finally {
      setIsSaving(false);
    }
    setPendingCosts((prev) => {
      const next = { ...prev };
      delete next[districtId];
      return next;
    });
  };

  const handleBlur = (districtId: string) => {
    const pending = pendingCosts()[districtId];
    if (pending === undefined) return;
    const original = allDistricts().find((d) => d.districtId === districtId)?.cost;
    if (pending === original) {
      setPendingCosts((prev) => {
        const next = { ...prev };
        delete next[districtId];
        return next;
      });
      return;
    }
    handleSave(districtId);
  };

  const handleCostChange = (districtId: string, val: string) => {
    setPendingCosts((prev) => ({ ...prev, [districtId]: val }));
  };

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label={t("seller.shippingRates.title")} />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-8">
        <div class="max-w-6xl mx-auto px-4">
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-xl bg-terracotta-100 dark:bg-terracotta-900/40 flex items-center justify-center">
                <MapPinIcon class="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                  {t("seller.shippingRates.title")}
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {t("seller.shippingRates.subtitle")}
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={GlobeAltIcon} label={t("seller.shippingRates.totalDistricts")} value={stats().total} color="forest" />
            <StatCard icon={CheckCircleIcon} label={t("seller.shippingRates.configured")} value={stats().configured} color="terracotta" />
            <StatCard icon={SparklesIcon} label={t("seller.shippingRates.freeShipping")} value={stats().freeCount} color="cream" />
            <StatCard icon={DollarSignIcon} label={t("seller.shippingRates.averageCost")} value={`৳${stats().avg}`} color="forest" />
          </div>

          <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-5 mb-4 shadow-sm">
            <div class="flex flex-col sm:flex-row items-start sm:items-end gap-3">
              <div class="flex-1 min-w-0">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("seller.shippingRates.setAllLabel")}
                </label>
                <div class="flex gap-2">
                  <div class="relative flex-1">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">৳</span>
                    <input
                      type="number" step="1" min="0"
                      placeholder={t("seller.shippingRates.placeholder")}
                      value={setAllCost()}
                      onInput={(e) => setSetAllCost(e.currentTarget.value)}
                      class="w-full pl-7 pr-3 py-2.5 rounded-xl border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-forest-800 dark:text-cream-50 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleSetAll}
                    disabled={!setAllCost() || isSaving()}
                    class="px-5 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    {isSaving() && setAllCost() ? (
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : null}
                    {t("seller.shippingRates.applyAll")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-4 mb-4 shadow-sm">
            <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div class="flex-1 min-w-0">
                <div class="relative">
                  <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder={t("seller.shippingRates.searchPlaceholder")}
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-forest-800 dark:text-cream-50 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20 transition-colors"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">৳</span>
                  <input
                    type="number" step="1" min="0"
                    placeholder={t("seller.shippingRates.bulkPlaceholder")}
                    value={bulkCost()}
                    onInput={(e) => setBulkCost(e.currentTarget.value)}
                    class="w-32 pl-7 pr-3 py-2.5 rounded-xl border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-forest-800 dark:text-cream-50 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20 transition-colors"
                  />
                </div>
                <button
                  onClick={handleBulkUpdate}
                  disabled={selectedIds().size === 0 || !bulkCost() || isSaving()}
                  class="px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  {t("seller.shippingRates.applySelected", { count: selectedIds().size })}
                </button>
              </div>
            </div>
          </div>

          <Show
            when={groupedDistricts().length > 0}
            fallback={
              <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-12 shadow-sm text-center">
                <MapPinIcon class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p class="text-gray-500 dark:text-gray-400 font-medium">{t("seller.shippingRates.noResults")}</p>
              </div>
            }
          >
            <div class="space-y-4">
              <For each={groupedDistricts()}>
                {(group) => (
                  <DivisionGroup
                    divisionName={group.divisionName}
                    districts={group.districts}
                    pendingCosts={pendingCosts()}
                    selectedIds={selectedIds()}
                    isSaving={isSaving()}
                    onToggleSelect={(id) =>
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        next.has(id) ? next.delete(id) : next.add(id);
                        return next;
                      })
                    }
                    onCostChange={handleCostChange}
                    onSave={handleSave}
                    onBlur={handleBlur}
                  />
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}

function StatCard(props: { icon: any; label: string; value: string | number; color: string }) {
  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    forest: { bg: "bg-forest-100 dark:bg-forest-900/40", icon: "text-forest-600 dark:text-forest-400", text: "text-forest-800 dark:text-cream-50" },
    terracotta: { bg: "bg-terracotta-100 dark:bg-terracotta-900/40", icon: "text-terracotta-600 dark:text-terracotta-400", text: "text-terracotta-800 dark:text-cream-50" },
    cream: { bg: "bg-cream-200 dark:bg-cream-800/40", icon: "text-cream-700 dark:text-cream-300", text: "text-cream-800 dark:text-cream-100" },
  };
  const c = colorClasses[props.color] || colorClasses.forest;
  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-4 shadow-sm">
      <div class="flex items-center gap-3">
        <div class={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <props.icon class={`w-4 h-4 ${c.icon}`} />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{props.label}</p>
          <p class={`text-lg font-bold ${c.text} truncate`}>{props.value}</p>
        </div>
      </div>
    </div>
  );
}

function DivisionGroup(props: {
  divisionName: string;
  districts: Array<{ districtId: string; districtName: string; divisionName: string; cost: string }>;
  pendingCosts: Record<string, string>;
  selectedIds: Set<string>;
  isSaving: boolean;
  onToggleSelect: (id: string) => void;
  onCostChange: (id: string, val: string) => void;
  onSave: (id: string) => void;
  onBlur: (id: string) => void;
}) {
  const configuredCount = props.districts.filter((d) => d.cost !== "0").length;

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden">
      <div class="px-5 py-3 bg-cream-50 dark:bg-forest-900/50 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <GlobeAltIcon class="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">{props.divisionName}</h3>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {configuredCount}/{props.districts.length} {props.districts.length === 1 ? "district" : "districts"}
        </span>
      </div>

      <div class="divide-y divide-cream-100 dark:divide-forest-700/50">
        <For each={props.districts}>
          {(item) => {
            const displayCost = props.pendingCosts[item.districtId] ?? item.cost;
            const hasChanges = props.pendingCosts[item.districtId] !== undefined && props.pendingCosts[item.districtId] !== item.cost;
            const isConfigured = item.cost !== "0";
            const isSelected = props.selectedIds.has(item.districtId);
            const isSavingThis = props.isSaving && hasChanges;

            return (
              <div
                class={`flex items-center gap-3 px-5 py-3 transition-colors ${
                  isSelected ? "bg-terracotta-50 dark:bg-terracotta-900/20" : "hover:bg-cream-50 dark:hover:bg-forest-900/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => props.onToggleSelect(item.districtId)}
                  class="w-4 h-4 rounded border-cream-300 dark:border-forest-600 text-terracotta-600 dark:text-terracotta-500 accent-terracotta-600 dark:accent-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30 cursor-pointer flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.districtName}</p>
                </div>
                <Show when={isConfigured}>
                  <span class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-900/40 text-xs font-medium text-forest-700 dark:text-forest-400">
                    <CheckCircleIcon class="w-3 h-3" />
                    ৳{item.cost}
                  </span>
                </Show>
                <div class="flex items-center gap-2 w-36 sm:w-40">
                  <div class="relative flex-1">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs">৳</span>
                    <input
                      type="number" step="1" min="0" placeholder="—"
                      value={displayCost}
                      onInput={(e) => props.onCostChange(item.districtId, e.currentTarget.value)}
                      onBlur={() => props.onBlur(item.districtId)}
                      class={`w-full pl-6 pr-2 py-1.5 rounded-lg border text-sm transition-colors ${
                        isConfigured
                          ? "border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50"
                          : "border-dashed border-cream-300 dark:border-forest-500 bg-cream-50 dark:bg-forest-900/50 text-gray-500 dark:text-gray-400"
                      } focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20 outline-none`}
                    />
                  </div>
                  <Show when={hasChanges}>
                    <button
                      onClick={() => props.onSave(item.districtId)}
                      disabled={props.isSaving}
                      class="p-1.5 rounded-lg text-terracotta-600 dark:text-terracotta-400 hover:bg-terracotta-100 dark:hover:bg-terracotta-900/40 disabled:opacity-40 transition-colors"
                    >
                      {isSavingThis ? (
                        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <CheckCircleIcon class="w-4 h-4" />
                      )}
                    </button>
                  </Show>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
