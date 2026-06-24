import { createAsync, action, useAction, useSubmission } from "@solidjs/router";
import { Suspense, createMemo, createEffect, createSignal, Show, For } from "solid-js";
import { ErrorBoundary } from "solid-js";
import Badge from "~/components/ui/Badge";
import { toaster } from "~/components/ui/Toast";
import { SectionErrorFallback } from "~/components/seller/SectionErrorFallback";
import {
  CubeIcon,
  AlertTriangleIcon,
  PlusIcon,
  ClockIcon,
  TrendingUpIcon,
  SpinnerIcon,
} from "~/components/icons";
import { getInventoryLabel } from "../[productId]/helpers";
import {
  getProductInventory,
  getStockMovements,
  invalidateInventory,
  invalidateMovements,
} from "~/lib/api/endpoints/seller/inventory.api";
import { inventoryApi } from "~/lib/api/endpoints/seller/inventory.api";
import type {
  VariantInventoryDetail,
  InventoryMovementFilter,
} from "~/lib/api/types/seller.types";
import VariantStockTable from "../[productId]/inventory/components/VariantStockTable";
import StockMovementsTimeline, { type MovementFilters } from "../[productId]/inventory/components/StockMovementsTimeline";
import RestockModal from "../[productId]/inventory/components/RestockModal";
import AdjustStockModal from "../[productId]/inventory/components/AdjustStockModal";
import MarkDamagedModal from "../[productId]/inventory/components/MarkDamagedModal";
import { useI18n } from "~/i18n";

const restockVariantAction = action(async (data: { productId: string; variantId: string; quantity: number; reference?: string; note?: string }) => {
  "use server";
  try {
    await inventoryApi.restock(data.productId, {
      variantId: data.variantId,
      quantity: data.quantity,
      referenceType: data.reference || undefined,
      reason: data.note || undefined,
    });
    return { success: true as const };
  } catch (error) {
    const apiError = error as { message?: string; statusCode?: number; validationErrors?: unknown };
    return {
      success: false as const,
      error: {
        message: apiError.message || "Failed to restock stock",
        statusCode: apiError.statusCode,
        validationErrors: apiError.validationErrors,
      },
    };
  }
}, "restock-variant-action");

const adjustStockAction = action(async (data: { productId: string; variantId: string; quantityChange: number; reference?: string; note: string }) => {
  "use server";
  try {
    await inventoryApi.adjust(data.productId, {
      variantId: data.variantId,
      quantityChange: data.quantityChange,
      referenceType: data.reference || undefined,
      reason: data.note || undefined,
    });
    return { success: true as const };
  } catch (error) {
    const apiError = error as { message?: string; statusCode?: number; validationErrors?: unknown };
    return {
      success: false as const,
      error: {
        message: apiError.message || "Failed to adjust stock",
        statusCode: apiError.statusCode,
        validationErrors: apiError.validationErrors,
      },
    };
  }
}, "adjust-stock-action");

const markDamagedAction = action(async (data: { productId: string; variantId: string; quantity: number; note?: string }) => {
  "use server";
  try {
    await inventoryApi.damaged(data.productId, {
      variantId: data.variantId,
      quantity: data.quantity,
      reason: data.note || undefined,
    });
    return { success: true as const };
  } catch (error) {
    const apiError = error as { message?: string; statusCode?: number; validationErrors?: unknown };
    return {
      success: false as const,
      error: {
        message: apiError.message || "Failed to mark stock as damaged",
        statusCode: apiError.statusCode,
        validationErrors: apiError.validationErrors,
      },
    };
  }
}, "mark-damaged-action");

export interface ProductInventoryPanelProps {
  productId: string;
}

export function ProductInventoryPanel(props: ProductInventoryPanelProps) {
  const { t } = useI18n();
  const productId = () => props.productId;

  const inventory = createAsync(
    () => getProductInventory(productId()),
    { deferStream: true },
  );

  const [movementPage, setMovementPage] = createSignal(1);
  const [movementFilters, setMovementFilters] = createSignal<MovementFilters>({});

  const movements = createAsync(
    () => getStockMovements(productId(), {
      page: movementPage(),
      limit: 20,
      variantId: movementFilters().variantId,
      movementType: movementFilters().movementType as InventoryMovementFilter["movementType"],
    }),
    { deferStream: true },
  );

  const restockTrigger = useAction(restockVariantAction);
  const restockSubmission = useSubmission(restockVariantAction);
  const adjustTrigger = useAction(adjustStockAction);
  const adjustSubmission = useSubmission(adjustStockAction);
  const damagedTrigger = useAction(markDamagedAction);
  const damagedSubmission = useSubmission(markDamagedAction);

  const [activeModal, setActiveModal] = createSignal<"restock" | "adjust" | "damaged" | null>(null);
  const [selectedVariant, setSelectedVariant] = createSignal<VariantInventoryDetail | null>(null);
  const [shouldCloseModal, setShouldCloseModal] = createSignal(false);

  const lowStockVariants = createMemo(() =>
    (inventory()?.variants ?? []).filter(
      (v) => v.status === "low_stock" || v.status === "out_of_stock",
    ),
  );

  const outOfStockVariants = createMemo(() =>
    (inventory()?.variants ?? []).filter((v) => v.status === "out_of_stock"),
  );

  const totalMovementPages = createMemo(() => movements()?.meta?.pages ?? 1);

  createEffect(() => {
    if (restockSubmission.result?.success === false && restockSubmission.result?.error) {
      const msg = restockSubmission.result.error.message;
      toaster.error(msg.includes(".") ? msg : msg || t("seller.products.inventoryDetail.restockFailed"));
    }
  });

  createEffect(() => {
    if (restockSubmission.result?.success === true && !restockSubmission.pending) {
      toaster.success(t("seller.products.inventoryDetail.restockSuccess"));
      setShouldCloseModal(true);
    }
  });

  createEffect(() => {
    if (adjustSubmission.result?.success === false && adjustSubmission.result?.error) {
      const msg = adjustSubmission.result.error.message;
      toaster.error(msg.includes(".") ? msg : msg || t("seller.products.inventoryDetail.adjustFailed"));
    }
  });

  createEffect(() => {
    if (adjustSubmission.result?.success === true && !adjustSubmission.pending) {
      toaster.success(t("seller.products.inventoryDetail.adjustSuccess"));
      setShouldCloseModal(true);
    }
  });

  createEffect(() => {
    if (damagedSubmission.result?.success === false && damagedSubmission.result?.error) {
      const msg = damagedSubmission.result.error.message;
      toaster.error(msg.includes(".") ? msg : msg || t("seller.products.inventoryDetail.damagedFailed"));
    }
  });

  createEffect(() => {
    if (damagedSubmission.result?.success === true && !damagedSubmission.pending) {
      toaster.success(t("seller.products.inventoryDetail.damagedSuccess"));
      setShouldCloseModal(true);
    }
  });

  const handleOpenRestock = (variant: VariantInventoryDetail) => {
    setSelectedVariant(variant);
    setActiveModal("restock");
  };

  const handleOpenAdjust = (variant: VariantInventoryDetail) => {
    setSelectedVariant(variant);
    setActiveModal("adjust");
  };

  const handleOpenDamaged = (variant: VariantInventoryDetail) => {
    setSelectedVariant(variant);
    setActiveModal("damaged");
  };

  const handleRestock = async (data: { quantity: number; reference: string; note: string }) => {
    if (!selectedVariant()) {
      return { success: false, error: { message: t("seller.products.inventoryDetail.noVariantSelected") } };
    }
    const result = await restockTrigger({
      productId: productId(),
      variantId: selectedVariant()!.variantId,
      quantity: data.quantity,
      reference: data.reference,
      note: data.note,
    });
    if (result?.success) {
      await invalidateInventory(productId());
      await invalidateMovements(productId());
    }
    return result;
  };

  const handleAdjust = async (data: { quantityChange: number; reference: string; note: string }) => {
    if (!selectedVariant()) {
      return { success: false, error: { message: t("seller.products.inventoryDetail.noVariantSelected") } };
    }
    const result = await adjustTrigger({
      productId: productId(),
      variantId: selectedVariant()!.variantId,
      quantityChange: data.quantityChange,
      reference: data.reference,
      note: data.note,
    });
    if (result?.success) {
      await invalidateInventory(productId());
      await invalidateMovements(productId());
    }
    return result;
  };

  const handleDamaged = async (data: { quantity: number; note: string }) => {
    if (!selectedVariant()) {
      return { success: false, error: { message: t("seller.products.inventoryDetail.noVariantSelected") } };
    }
    const result = await damagedTrigger({
      productId: productId(),
      variantId: selectedVariant()!.variantId,
      quantity: data.quantity,
      note: data.note,
    });
    if (result?.success) {
      await invalidateInventory(productId());
      await invalidateMovements(productId());
    }
    return result;
  };

  const handleFilterChange = (filters: MovementFilters) => {
    setMovementFilters(filters);
    setMovementPage(1);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedVariant(null);
    setShouldCloseModal(false);
  };

  createEffect(() => {
    if (shouldCloseModal()) {
      handleCloseModal();
    }
  });

  return (
    <ErrorBoundary fallback={(error) => <SectionErrorFallback error={error} title="inventory" />}>
      <Suspense fallback={
        <div class="flex items-center justify-center py-12">
          <SpinnerIcon class="h-8 w-8 text-gray-400 animate-spin" />
          <span class="ml-3 text-sm text-gray-500 dark:text-gray-400">{t("seller.products.inventoryDetail.loading")}</span>
        </div>
      }>
        <Show when={inventory()}>
          {(inv) => (
            <div class="space-y-6">
              <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("seller.products.inventoryDetail.totalStock")}</p>
                  <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">{inv().totalStock}</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{inv().variants.length} {t("seller.products.inventoryDetail.variants")}</p>
                </div>
                <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("seller.products.inventoryDetail.available")}</p>
                  <p class="text-2xl font-bold text-forest-600 dark:text-forest-400 mt-1">{inv().availableStock}</p>
                  <div class="flex items-center gap-1 mt-1">
                    <TrendingUpIcon class="w-3 h-3 text-forest-500" />
                    <p class="text-xs text-gray-400 dark:text-gray-500">{t("seller.products.inventoryDetail.readyToSell")}</p>
                  </div>
                </div>
                <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("seller.products.inventoryDetail.reserved")}</p>
                  <p class="text-2xl font-bold text-cream-600 dark:text-cream-400 mt-1">{inv().reservedStock}</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{t("seller.products.inventoryDetail.inActiveOrders")}</p>
                </div>
                <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("seller.products.inventoryDetail.lowStock")}</p>
                  <p class="text-2xl font-bold text-cream-600 dark:text-cream-400 mt-1">{inv().lowStockCount}</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{t("seller.products.inventoryDetail.variants")}</p>
                </div>
                <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("seller.products.inventoryDetail.outOfStock")}</p>
                  <p class="text-2xl font-bold text-terracotta-600 dark:text-terracotta-400 mt-1">{inv().outOfStockCount}</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{t("seller.products.inventoryDetail.variants")}</p>
                </div>
              </div>

              <ErrorBoundary fallback={() => null}>
                <Show when={lowStockVariants().length > 0 || outOfStockVariants().length > 0}>
                  <div class={`rounded-xl border shadow-sm p-4 ${
                    outOfStockVariants().length > 0
                      ? "bg-terracotta-50 dark:bg-terracotta-900/20 border-terracotta-200 dark:border-terracotta-800"
                      : "bg-cream-50 dark:bg-cream-900/20 border-cream-200 dark:border-cream-800"
                  }`}>
                    <div class="flex items-start gap-3">
                      <AlertTriangleIcon class={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        outOfStockVariants().length > 0 ? "text-terracotta-600 dark:text-terracotta-400" : "text-cream-600 dark:text-cream-400"
                      }`} />
                      <div class="flex-1">
                        <p class={`text-sm font-semibold ${
                          outOfStockVariants().length > 0 ? "text-terracotta-800 dark:text-terracotta-300" : "text-cream-800 dark:text-cream-300"
                        }`}>
                          {outOfStockVariants().length > 0
                            ? t("seller.products.inventoryDetail.outOfStockVariants", outOfStockVariants().length)
                            : t("seller.products.inventoryDetail.lowOnStockVariants", lowStockVariants().length)}
                        </p>
                        <div class="mt-2 flex flex-wrap gap-2">
                          <For each={[...outOfStockVariants(), ...lowStockVariants()]}>
                            {(v) => {
                              const label = getInventoryLabel(v.availableQuantity, v.lowStockThreshold, t as unknown as (key: string, ...args: unknown[]) => string);
                              return (
                                <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-forest-800 rounded-lg border border-cream-200 dark:border-forest-700">
                                  <span class="text-xs font-medium text-forest-800 dark:text-cream-50 truncate max-w-[150px]">
                                    {v.variantName || t("seller.products.inventoryDetail.unnamedVariant")}
                                  </span>
                                  <Badge variant={label.variant} class="text-xs">
                                    {v.availableQuantity} {t("seller.products.inventory.left", v.availableQuantity)}
                                  </Badge>
                                  <button type="button" onClick={() => handleOpenRestock(v)} class="text-xs text-forest-600 dark:text-forest-400 hover:underline font-medium">
                                    {t("seller.products.inventoryDetail.restock")}
                                  </button>
                                </div>
                              );
                            }}
                          </For>
                        </div>
                      </div>
                    </div>
                  </div>
                </Show>
              </ErrorBoundary>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                  <ErrorBoundary fallback={(error) => <SectionErrorFallback error={error} title="variant stock" />}>
                    <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
                      <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <CubeIcon class="w-4 h-4 text-gray-400" />
                          <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">{t("seller.products.inventoryDetail.variantStockLevels")}</h3>
                          <Badge variant="default" class="text-xs">{inv().variants.length}</Badge>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const firstVariant = inv().variants[0];
                            if (firstVariant) handleOpenRestock(firstVariant);
                          }}
                          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-600 hover:bg-forest-700 text-white text-xs font-medium transition-colors"
                        >
                          <PlusIcon class="w-3.5 h-3.5" />
                          {t("seller.products.inventoryDetail.quickRestock")}
                        </button>
                      </div>
                      <VariantStockTable
                        t={t as unknown as (key: string, ...args: unknown[]) => string}
                        variants={inv().variants}
                        onRestock={handleOpenRestock}
                        onAdjust={handleOpenAdjust}
                        onDamaged={handleOpenDamaged}
                      />
                    </div>
                  </ErrorBoundary>
                </div>
                <div>
                  <ErrorBoundary fallback={(error) => <SectionErrorFallback error={error} title="stock movements" />}>
                    <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
                      <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <ClockIcon class="w-4 h-4 text-gray-400" />
                          <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">{t("seller.products.inventoryDetail.stockMovements")}</h3>
                        </div>
                      </div>
                      <div class="p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                        <StockMovementsTimeline
                          t={t as unknown as (key: string, ...args: unknown[]) => string}
                          movements={movements()?.movements}
                          isLoading={!movements()}
                          error={null}
                          currentPage={movementPage()}
                          totalPages={totalMovementPages()}
                          onPageChange={setMovementPage}
                          onFilterChange={handleFilterChange}
                          activeFilters={movementFilters()}
                        />
                      </div>
                    </div>
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          )}
        </Show>
      </Suspense>

      <RestockModal
        t={t as unknown as (key: string, ...args: unknown[]) => string}
        isOpen={activeModal() === "restock"}
        onClose={handleCloseModal}
        variant={selectedVariant()}
        onSubmit={handleRestock}
        isSubmitting={restockSubmission.pending === true}
      />
      <AdjustStockModal
        t={t as unknown as (key: string, ...args: unknown[]) => string}
        isOpen={activeModal() === "adjust"}
        onClose={handleCloseModal}
        variant={selectedVariant()}
        onSubmit={handleAdjust}
        isSubmitting={adjustSubmission.pending === true}
      />
      <MarkDamagedModal
        t={t as unknown as (key: string, ...args: unknown[]) => string}
        isOpen={activeModal() === "damaged"}
        onClose={handleCloseModal}
        variant={selectedVariant()}
        onSubmit={handleDamaged}
        isSubmitting={damagedSubmission.pending === true}
      />
    </ErrorBoundary>
  );
}
