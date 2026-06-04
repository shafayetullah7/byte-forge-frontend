import { createAsync, action, useAction, useSubmission, revalidate } from "@solidjs/router";
import {
  createSignal,
  createMemo,
  createEffect,
  Show,
  Suspense,
  For,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
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
  SpinnerIcon,
} from "~/components/icons";
import { StatCard } from "./__components__/StatCard";
import { DivisionGroup } from "./__components__/DivisionGroup";
import { CurrencyInput } from "./__components__/CurrencyInput";

const updateShippingRatesAction = action(
  async (input: { rates: Array<{ districtId: string; cost: string; costPerKg?: string }>; successMessage?: string }) => {
    "use server";
    const { rates, successMessage } = input;
    try {
      await bulkUpdateShippingRates({ rates });
      revalidate(getShippingRates.keyFor());
      return { success: true, message: successMessage };
    } catch (error) {
      const apiError = error as any;
      return {
        success: false,
        error: {
          message: apiError.message || "Failed to update shipping rates",
        },
      };
    }
  },
  "update-shipping-rates-action"
);

type PendingEntry = { cost?: string; costPerKg?: string };

export default function ShippingRatesPage() {
  const { t } = useI18n();
  const ratesData = createAsync(() => getShippingRates(), { deferStream: true });
  const [searchQuery, setSearchQuery] = createSignal("");
  const [setAllCost, setSetAllCost] = createSignal("");
  const [setAllCostPerKg, setSetAllCostPerKg] = createSignal("");
  const [bulkCost, setBulkCost] = createSignal("");
  const [bulkCostPerKg, setBulkCostPerKg] = createSignal("");
  const [selectedIds, setSelectedIds] = createSignal<Set<string>>(new Set());
  const [pendingCosts, setPendingCosts] = createStore<Record<string, PendingEntry>>({});

  const updateRatesAction = useAction(updateShippingRatesAction);
  const submission = useSubmission(updateShippingRatesAction);

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

  createEffect(() => {
    const result = submission.result;
    if (result && result.success === false && result.error) {
      toaster.error(result.error.message || t("seller.shippingRates.updateFailed"));
    }
  });

  createEffect(() => {
    if (submission.result?.success && !submission.pending) {
      toaster.success(submission.result.message || t("seller.shippingRates.ratesUpdated"));
    }
  });

  const getPending = (districtId: string): PendingEntry => {
    return pendingCosts[districtId] || {};
  };

  const handleSetAll = async () => {
    const cost = setAllCost();
    const costPerKg = setAllCostPerKg();
    if (!cost && !costPerKg) return;
    const rates = allDistricts().map((item) => ({
      districtId: item.districtId,
      cost: cost || item.cost,
      costPerKg: costPerKg || undefined,
    }));
    await updateRatesAction({ rates, successMessage: t("seller.shippingRates.allUpdated") });
    setSetAllCost("");
    setSetAllCostPerKg("");
    setPendingCosts(produce((prev) => { for (const key of Object.keys(prev)) delete prev[key]; }));
  };

  const handleBulkUpdate = async () => {
    const cost = bulkCost();
    const costPerKg = bulkCostPerKg();
    if ((!cost && !costPerKg) || selectedIds().size === 0) return;
    const rates = Array.from(selectedIds()).map((id) => ({
      districtId: id,
      cost: cost || allDistricts().find((d) => d.districtId === id)?.cost || "0",
      costPerKg: costPerKg || undefined,
    }));
    await updateRatesAction({ rates, successMessage: t("seller.shippingRates.bulkUpdated", { count: rates.length }) });
    setSelectedIds(new Set<string>());
    setBulkCost("");
    setBulkCostPerKg("");
    setPendingCosts(produce((prev) => { for (const key of Object.keys(prev)) delete prev[key]; }));
  };

  const handleSave = async (districtId: string) => {
    const pending = getPending(districtId);
    if (pending.cost === undefined && pending.costPerKg === undefined) return;
    const district = allDistricts().find((d) => d.districtId === districtId);
    const cost = pending.cost !== undefined ? pending.cost : district?.cost || "0";
    const costPerKg = pending.costPerKg;
    await updateRatesAction({
      rates: [{ districtId, cost, costPerKg }],
      successMessage: t("seller.shippingRates.rateUpdated"),
    });
    setPendingCosts(produce((prev) => { delete prev[districtId]; }));
  };

  const handleBlur = (districtId: string) => {
    const pending = getPending(districtId);
    if (pending.cost === undefined && pending.costPerKg === undefined) return;
    const district = allDistricts().find((d) => d.districtId === districtId);
    const costChanged = pending.cost !== undefined && pending.cost !== district?.cost;
    const costPerKgChanged = pending.costPerKg !== undefined && pending.costPerKg !== district?.costPerKg;
    if (!costChanged && !costPerKgChanged) {
      setPendingCosts(produce((prev) => { delete prev[districtId]; }));
      return;
    }
    handleSave(districtId);
  };

  const handleCostChange = (districtId: string, val: string) => {
    setPendingCosts(districtId, (prev) => ({ ...(prev || {}), cost: val }));
  };

  const handleCostPerKgChange = (districtId: string, val: string) => {
    setPendingCosts(districtId, (prev) => ({ ...(prev || {}), costPerKg: val }));
  };

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label={t("seller.shippingRates.title")} />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-8 pb-24">
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

          <Suspense fallback={
            <div class="space-y-4">
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map(() => (
                  <div class="h-20 bg-white dark:bg-forest-800 rounded-2xl animate-pulse" />
                ))}
              </div>
              <div class="h-24 bg-white dark:bg-forest-800 rounded-2xl animate-pulse" />
              <div class="h-20 bg-white dark:bg-forest-800 rounded-2xl animate-pulse" />
              <div class="space-y-4">
                {Array.from({ length: 3 }).map(() => (
                  <div class="h-48 bg-white dark:bg-forest-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          }>
            {(() => {
              const districts = ratesData();
              if (!districts) return null;

              return (
                <>
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
                          <div class="flex-1">
                            <CurrencyInput
                              placeholder={t("seller.shippingRates.placeholder")}
                              value={setAllCost()}
                              onInput={(e) => setSetAllCost(e.currentTarget.value)}
                            />
                          </div>
                          <div class="flex-1">
                            <CurrencyInput
                              placeholder={t("seller.shippingRates.costPerKg")}
                              value={setAllCostPerKg()}
                              onInput={(e) => setSetAllCostPerKg(e.currentTarget.value)}
                            />
                          </div>
                          <button
                            onClick={handleSetAll}
                            disabled={!setAllCost() && !setAllCostPerKg() || submission.pending}
                            class="px-5 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                          >
                            {submission.pending && (setAllCost() || setAllCostPerKg()) ? (
                              <SpinnerIcon class="animate-spin h-4 w-4" />
                            ) : null}
                            {t("seller.shippingRates.applyAll")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-4 mb-4 shadow-sm">
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
                            pendingCosts={pendingCosts}
                            selectedIds={selectedIds}
                            isSaving={submission.pending || false}
                            onToggleSelect={(id) =>
                              setSelectedIds((prev) => {
                                const next = new Set(prev);
                                next.has(id) ? next.delete(id) : next.add(id);
                                return next;
                              })
                            }
                            onCostChange={handleCostChange}
                            onCostPerKgChange={handleCostPerKgChange}
                            onSave={handleSave}
                            onBlur={handleBlur}
                          />
                        )}
                      </For>
                    </div>
                  </Show>

                  <Show when={selectedIds().size > 0}>
                    <div class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-forest-800/95 backdrop-blur-lg border-t border-cream-200 dark:border-forest-700 shadow-lg">
                      <div class="max-w-6xl mx-auto px-4 py-3">
                        <div class="flex items-center gap-3 flex-wrap">
                          <span class="text-sm font-semibold text-forest-800 dark:text-cream-50 whitespace-nowrap">
                            {selectedIds().size} selected
                          </span>
                          <div class="w-28">
                            <CurrencyInput
                              placeholder={t("seller.shippingRates.bulkPlaceholder")}
                              value={bulkCost()}
                              onInput={(e) => setBulkCost(e.currentTarget.value)}
                            />
                          </div>
                          <div class="w-28">
                            <CurrencyInput
                              placeholder={t("seller.shippingRates.costPerKg")}
                              value={bulkCostPerKg()}
                              onInput={(e) => setBulkCostPerKg(e.currentTarget.value)}
                            />
                          </div>
                          <button
                            onClick={handleBulkUpdate}
                            disabled={!bulkCost() && !bulkCostPerKg() || submission.pending}
                            class="px-5 py-2 rounded-lg bg-forest-600 hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-2"
                          >
                            {submission.pending ? (
                              <SpinnerIcon class="animate-spin h-4 w-4" />
                            ) : null}
                            Apply to {selectedIds().size}
                          </button>
                          <button
                            onClick={() => { setSelectedIds(new Set<string>()); setBulkCost(""); setBulkCostPerKg(""); }}
                            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-forest-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-forest-700 text-sm font-medium transition-colors whitespace-nowrap"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </Show>
                </>
              );
            })()}
          </Suspense>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
