import { For } from "solid-js";
import { ErrorBoundary } from "solid-js";
import Badge from "~/components/ui/Badge";
import { PencilIcon, PackageIcon } from "~/components/icons";
import { formatPrice, getGrowthStageLabel, getPlantFormLabel, getVariegationLabel, getLeafDensityLabel, getPropagationLabel, getContainerTypeLabel } from "../helpers";
import { DetailRow } from "../components/DetailRow";
import { MOCK_PLANT } from "../mock-data";

export default function VariantsRoute() {
  return (
    <div class="space-y-6">
      <For each={MOCK_PLANT.variants}>
        {(variant, index) => (
          <ErrorBoundary
            fallback={(error) => (
              <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p class="text-sm text-amber-700 dark:text-amber-300">
                  Failed to load variant {index() + 1}: {error.message}
                </p>
              </div>
            )}
          >
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
              <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">
                    Variant {index() + 1}
                  </h3>
                  {variant.isBase && (
                    <Badge variant="forest" class="text-xs">Base</Badge>
                  )}
                  <Badge variant={variant.isActive ? "forest" : "cream"} class="text-xs">
                    {variant.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <button class="inline-flex items-center gap-1.5 text-sm text-forest-600 dark:text-forest-400 hover:underline font-medium">
                  <PencilIcon class="w-3.5 h-3.5" />
                  Edit
                </button>
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
                    <DetailRow label="Growth Stage" value={getGrowthStageLabel(variant.attributes.growthStage)} />
                    <DetailRow label="Plant Form" value={getPlantFormLabel(variant.attributes.plantForm)} />
                    <DetailRow label="Variegation" value={getVariegationLabel(variant.attributes.variegation)} />
                    <DetailRow label="Leaf Density" value={getLeafDensityLabel(variant.attributes.leafDensity)} />
                  </div>
                  <div>
                    <DetailRow label="Stem Count" value={variant.attributes.stemCount} />
                    <DetailRow label="Current Height" value={variant.attributes.currentHeight} />
                    <DetailRow label="Current Spread" value={variant.attributes.currentSpread} />
                    <DetailRow label="Propagation" value={getPropagationLabel(variant.attributes.propagationType)} />
                    <DetailRow label="Container" value={`${getContainerTypeLabel(variant.attributes.containerType)} (${variant.attributes.containerSize})`} />
                  </div>
                </div>
                <div class="mt-6 pt-4 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Images ({variant.images.length})</p>
                  {variant.images.length > 0 ? (
                    <div class="flex gap-3">
                      <For each={variant.images}>
                        {(img) => (
                          <div class="w-20 h-20 rounded-lg bg-cream-100 dark:bg-forest-700 border border-cream-200 dark:border-forest-600 flex items-center justify-center">
                            <PackageIcon class="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </For>
                    </div>
                  ) : (
                    <p class="text-sm text-gray-400 dark:text-gray-500">No images uploaded for this variant.</p>
                  )}
                </div>
              </div>
            </div>
          </ErrorBoundary>
        )}
      </For>
    </div>
  );
}
