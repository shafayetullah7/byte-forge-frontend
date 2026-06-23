import { For, Show } from "solid-js";
import { ErrorBoundary } from "solid-js";
import { A, useParams, createAsync } from "@solidjs/router";
import { getPlantById } from "~/lib/api/endpoints/seller/plants.api";
import Badge from "~/components/ui/Badge";
import { PencilIcon, PackageIcon, ImageIcon } from "~/components/icons";
import {
  formatPrice,
  getGrowthStageLabel,
  getPlantFormLabel,
  getVariegationLabel,
  getLeafDensityLabel,
  getPropagationLabel,
  getContainerTypeLabel,
} from "../helpers";
import { DetailRow } from "../components/DetailRow";

export default function VariantsRoute() {
  const params = useParams();

  const plant = createAsync(
    () => getPlantById(params.plantId as string),
    { deferStream: true }
  );

  return (
    <ErrorBoundary fallback={(error) => (
      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <p class="text-sm text-amber-700 dark:text-amber-300">
          Failed to load variants: {error.message}
        </p>
      </div>
    )}>
      <Show when={plant()}>
        {(plantData) => (
          <Show when={(plantData().variants ?? []).length > 0} fallback={
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 p-8 text-center">
              <PackageIcon class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
              <p class="text-gray-500 dark:text-gray-400 mt-3">No variants found for this plant.</p>
            </div>
          }>
            <div class="space-y-6">
              <For each={plantData().variants ?? []}>
                {(variant) => (
                  <ErrorBoundary
                    fallback={(error) => (
                      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <p class="text-sm text-amber-700 dark:text-amber-300">
                          Failed to load variant: {error.message}
                        </p>
                      </div>
                    )}
                  >
                    <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
                      <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <div>
                            <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">
                              {variant.translations?.find(t => t.locale === "en")?.title
                                ?? variant.translations?.[0]?.title ?? `Variant ${variant.id}`}
                            </h3>
                            <Show when={variant.translations?.find(t => t.locale === "bn")?.title}>
                              {(titleBn) => (
                                <p class="text-sm font-medium text-forest-600 dark:text-forest-400">{titleBn()}</p>
                              )}
                            </Show>
                          </div>
                          {variant.isBase && (
                            <Badge variant="forest" class="text-xs">Base</Badge>
                          )}
                          <Badge variant={variant.isActive ? "forest" : "cream"} class="text-xs">
                            {variant.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <A
                          href={`/app/seller/products/plants/${plantData().id}/edit?step=4`}
                          class="inline-flex items-center gap-1.5 text-sm text-forest-600 dark:text-forest-400 hover:underline font-medium"
                        >
                          <PencilIcon class="w-3.5 h-3.5" />
                          Edit
                        </A>
                      </div>
                      <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div>
                            <DetailRow label="SKU" value={variant.sku || "—"} />
                            <DetailRow label="Price" value={formatPrice(variant.price)} />
                          </div>
                          <div>
                            <DetailRow
                              label="Stock"
                              value={
                                <div class="flex items-center gap-2">
                                  <span>{variant.inventoryCount}</span>
                                  <Badge
                                    variant={variant.inventoryCount === 0 ? "terracotta" : variant.inventoryCount <= (variant.lowStockThreshold || 3) ? "cream" : "forest"}
                                    class="text-xs"
                                  >
                                    {variant.inventoryCount === 0 ? "Out of Stock" : variant.inventoryCount <= (variant.lowStockThreshold || 3) ? "Low" : "In Stock"}
                                  </Badge>
                                </div>
                              }
                            />
                            <DetailRow label="Track Inventory" value={variant.trackInventory ? "Yes" : "No"} />
                            <DetailRow label="Low Stock Alert" value={variant.lowStockThreshold || "—"} />
                          </div>
                          <div>
                            <Show when={variant.plantAttributes}>
                              {(attrs) => (
                                <>
                                  <DetailRow label="Growth Stage" value={getGrowthStageLabel(attrs().growthStage as any)} />
                                  <DetailRow label="Plant Form" value={getPlantFormLabel(attrs().plantForm as any)} />
                                  <DetailRow label="Variegation" value={getVariegationLabel(attrs().variegation as any)} />
                                  <DetailRow label="Leaf Density" value={getLeafDensityLabel(attrs().leafDensity as any)} />
                                </>
                              )}
                            </Show>
                          </div>
                          <div>
                            <Show when={variant.plantAttributes}>
                              {(attrs) => (
                                <>
                                  <DetailRow label="Stem Count" value={attrs().stemCount} />
                                  <DetailRow label="Current Height" value={attrs().currentHeight || "—"} />
                                  <DetailRow label="Current Spread" value={attrs().currentSpread || "—"} />
                                  <DetailRow label="Propagation" value={getPropagationLabel(attrs().propagationType as any)} />
                                  <DetailRow label="Container" value={`${getContainerTypeLabel(attrs().containerType as any)} (${attrs().containerSize || "—"})`} />
                                </>
                              )}
                            </Show>
                          </div>
                        </div>

                        {/* Media Thumbnails */}
                        <div class="mt-6 pt-4 border-t border-cream-100 dark:border-forest-700/50">
                          {(() => {
                            const mediaCount = variant.media.length;
                            return (
                              <>
                                <div class="flex items-center gap-2 mb-3">
                                  <ImageIcon class="w-4 h-4 text-gray-400" />
                                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Images ({mediaCount})</p>
                                </div>
                                {mediaCount > 0 ? (
                                  <div class="flex gap-3">
                                    <For each={variant.media}>
                                      {(media) => (
                                        <div class="w-20 h-20 rounded-lg overflow-hidden border border-cream-200 dark:border-forest-600">
                                          <img
                                            src={media.url}
                                            alt={`Variant image ${media.displayOrder}`}
                                            class="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                    </For>
                                  </div>
                                ) : (
                                  <div class="flex gap-3">
                                    <div class="w-20 h-20 rounded-lg bg-cream-100 dark:bg-forest-700 border border-cream-200 dark:border-forest-600 flex items-center justify-center">
                                      <PackageIcon class="w-6 h-6 text-gray-400" />
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </ErrorBoundary>
                )}
              </For>
            </div>
          </Show>
        )}
      </Show>
    </ErrorBoundary>
  );
}
