import { For, Show, createSignal } from "solid-js";
import { ErrorBoundary } from "solid-js";
import { A, useParams, createAsync } from "@solidjs/router";
import { getPlantById } from "~/lib/api/endpoints/seller/plants.api";
import { usePlantSectionEdit } from "~/lib/plants/usePlantSectionEdit";
import { fromPlantDetailToForm, createEmptyVariant } from "~/lib/types/plant-form";
import { cloneForm as clonePlantForm } from "~/lib/plants/plant-section-edit";
import { invalidateInventory } from "~/lib/api/endpoints/seller/inventory.api";
import Badge from "~/components/ui/Badge";
import Button from "~/components/ui/Button";
import { PlusIcon, PackageIcon, ImageIcon, TrashIcon } from "~/components/icons";
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
import { EditableSectionCard } from "../components/EditableSectionCard";
import { PlantSectionFieldEditor } from "../../components/PlantSectionFieldEditor";
import { useI18n } from "~/i18n";
import type { PlantSectionId } from "~/lib/plants/plant-section-edit";

export default function VariantsRoute() {
  const { t } = useI18n();
  const params = useParams();
  const [addingVariant, setAddingVariant] = createSignal(false);

  const plant = createAsync(
    () => getPlantById(params.plantId as string),
    { deferStream: true }
  );

  const sectionEdit = usePlantSectionEdit(params.plantId as string, plant);

  const variantSectionId = (id: string): PlantSectionId => `variant:${id}`;

  const handleAddVariant = () => {
    const data = plant();
    if (!data) return;
    const form = clonePlantForm(fromPlantDetailToForm(data));
    const newVariant = createEmptyVariant();
    newVariant.isBase = form.variants.length === 0;
    form.variants = [...form.variants, newVariant];
    sectionEdit.setDraftForm(form);
    sectionEdit.startEdit(variantSectionId(newVariant.id));
    setAddingVariant(true);
  };

  const handleRemoveVariant = async (variantId: string) => {
    const data = plant();
    if (!data) return;
    if (!confirm(t("seller.products.plantVariants.confirmRemove"))) return;

    const form = clonePlantForm(fromPlantDetailToForm(data));
    if (form.variants.length <= 1) return;
    form.variants = form.variants.filter((v) => v.id !== variantId);
    const removedWasBase = !form.variants.some((v) => v.isBase);
    if (removedWasBase && form.variants.length > 0) {
      form.variants[0].isBase = true;
    }

    const sectionId = variantSectionId(variantId);
    const ok = await sectionEdit.saveForm(sectionId, form);
    if (ok) {
      invalidateInventory(params.plantId as string);
      sectionEdit.cancelEdit();
    }
  };

  const handleSaveNewVariant = async () => {
    await sectionEdit.save();
    setAddingVariant(false);
    invalidateInventory(params.plantId as string);
  };

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
          <div class="space-y-6">
            <div class="flex justify-end">
              <Button variant="outline" class="inline-flex items-center gap-2" onClick={handleAddVariant}>
                <PlusIcon class="w-4 h-4" />
                {t("seller.products.plantVariants.addVariant")}
              </Button>
            </div>

            <Show when={(plantData().variants ?? []).length > 0 || addingVariant()} fallback={
              <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 p-8 text-center">
                <PackageIcon class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
                <p class="text-gray-500 dark:text-gray-400 mt-3">{t("seller.products.plantVariants.noVariants")}</p>
                <Button variant="accent" class="mt-4 inline-flex items-center gap-2" onClick={handleAddVariant}>
                  <PlusIcon class="w-4 h-4" />
                  {t("seller.products.plantVariants.addVariant")}
                </Button>
              </div>
            }>
              <Show when={addingVariant() && sectionEdit.editingSectionId()?.startsWith("variant:")}>
                <EditableSectionCard
                  title={t("seller.products.plantVariants.addVariant")}
                  icon={<PlusIcon class="w-4 h-4 text-gray-400" />}
                  isEditing
                  isSaving={sectionEdit.isSaving()}
                  onEdit={() => {}}
                  onCancel={() => {
                    sectionEdit.cancelEdit();
                    setAddingVariant(false);
                  }}
                  onSave={handleSaveNewVariant}
                  canEdit={false}
                >
                  <PlantSectionFieldEditor
                    sectionId={sectionEdit.editingSectionId()!}
                    form={sectionEdit.draftForm}
                    setForm={sectionEdit.setDraftForm}
                    errors={sectionEdit.errors()}
                    plantId={plantData().id}
                  />
                </EditableSectionCard>
              </Show>

              <For each={plantData().variants ?? []}>
                {(variant) => {
                  const sectionId = variantSectionId(variant.id);
                  const isEditing = () => sectionEdit.isEditing(sectionId);

                  return (
                    <EditableSectionCard
                      title={
                        variant.translations?.find(tr => tr.locale === "en")?.title
                          ?? variant.translations?.[0]?.title ?? `Variant ${variant.id}`
                      }
                      icon={<PackageIcon class="w-4 h-4 text-gray-400" />}
                      headerAction={
                        <div class="flex items-center gap-2">
                          {variant.isBase && <Badge variant="forest" class="text-xs">Base</Badge>}
                          <Badge variant={variant.isActive ? "forest" : "cream"} class="text-xs">
                            {variant.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      }
                      isEditing={isEditing()}
                      isSaving={sectionEdit.isSaving()}
                      onEdit={() => {
                        setAddingVariant(false);
                        sectionEdit.startEdit(sectionId);
                      }}
                      onCancel={() => {
                        sectionEdit.cancelEdit();
                        setAddingVariant(false);
                      }}
                      onSave={sectionEdit.save}
                    >
                      <Show
                        when={isEditing()}
                        fallback={
                          <>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div>
                                <DetailRow label="SKU" value={variant.sku || "—"} />
                                <DetailRow label="Price" value={formatPrice(variant.price)} />
                              </div>
                              <div>
                                <DetailRow
                                  label={t("seller.products.plantOverview.stock")}
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
                                <A
                                  href={`/app/seller/products/plants/${plantData().id}/inventory`}
                                  class="inline-flex items-center gap-1 text-xs text-forest-600 dark:text-forest-400 hover:underline mt-1"
                                >
                                  {t("seller.products.plantOverview.manageStock")}
                                </A>
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
                                      <div class="w-20 h-20 rounded-lg bg-cream-100 dark:bg-forest-700 border border-cream-200 dark:border-forest-600 flex items-center justify-center">
                                        <PackageIcon class="w-6 h-6 text-gray-400" />
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>

                            <Show when={(plantData().variants ?? []).length > 1}>
                              <div class="mt-4 pt-4 border-t border-cream-100 dark:border-forest-700/50">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariant(variant.id)}
                                  class="inline-flex items-center gap-1.5 text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline"
                                >
                                  <TrashIcon class="w-3.5 h-3.5" />
                                  {t("seller.products.plantVariants.removeVariant")}
                                </button>
                              </div>
                            </Show>
                          </>
                        }
                      >
                        <PlantSectionFieldEditor
                          sectionId={sectionId}
                          form={sectionEdit.draftForm}
                          setForm={sectionEdit.setDraftForm}
                          errors={sectionEdit.errors()}
                          plantId={plantData().id}
                        />
                      </Show>
                    </EditableSectionCard>
                  );
                }}
              </For>
            </Show>
          </div>
        )}
      </Show>
    </ErrorBoundary>
  );
}
