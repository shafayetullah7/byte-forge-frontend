import { Show } from "solid-js";
import { ErrorBoundary } from "solid-js";
import { useParams, createAsync } from "@solidjs/router";
import { getPlantById } from "~/lib/api/endpoints/seller/plants.api";
import { usePlantSectionEdit } from "~/lib/plants/usePlantSectionEdit";
import { useI18n } from "~/i18n";
import { usePlantOverviewData } from "./hooks/usePlantOverviewData";
import { PlantIdentitySection } from "./components/overview/PlantIdentitySection";
import { CategoryTagsSection } from "./components/overview/CategoryTagsSection";
import { ClassificationSection } from "./components/overview/ClassificationSection";
import { CareRequirementsSection } from "./components/overview/CareRequirementsSection";
import { CareInstructionsPreview } from "./components/overview/CareInstructionsPreview";
import { PricingInventorySection } from "./components/overview/PricingInventorySection";
import { CareProfileSidebar } from "./components/overview/CareProfileSidebar";
import { VariantPreviewSection } from "./components/overview/VariantPreviewSection";
import { PlantMetadataSection } from "./components/overview/PlantMetadataSection";
import { PlantQuickActionsPanel } from "./components/overview/PlantQuickActionsPanel";

export default function OverviewRoute() {
  const { t } = useI18n();
  const params = useParams();

  const plant = createAsync(
    () => getPlantById(params.plantId as string),
    { deferStream: true },
  );

  const sectionEdit = usePlantSectionEdit(params.plantId as string, plant);
  const overview = usePlantOverviewData(plant);

  return (
    <ErrorBoundary
      fallback={(error) => (
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p class="text-sm text-amber-700 dark:text-amber-300">
            {t("seller.products.plantDetail.loadFailed")}: {error.message}
          </p>
        </div>
      )}
    >
      <Show when={plant()}>
        {(plantData) => {
          const p = plantData();
          const inventory = overview.inventoryStatus();

          return (
            <div class="space-y-6">
              <PlantIdentitySection
                plant={p}
                sectionEdit={sectionEdit}
                enName={overview.enName()}
                enShortDescription={overview.enShortDescription()}
                bnDescription={overview.bnDescription()}
                scientificName={overview.scientificName()}
                hasBnTranslation={Boolean(overview.bnTranslation())}
              />

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                  <CategoryTagsSection
                    plant={p}
                    sectionEdit={sectionEdit}
                    categoryEn={overview.categoryEn()}
                    categoryBn={overview.categoryBn()}
                    knownPlantTags={overview.knownPlantTags}
                  />

                  <ClassificationSection
                    plant={p}
                    sectionEdit={sectionEdit}
                    plantDetailsEn={overview.plantDetailsEn}
                    plantDetailsBn={overview.plantDetailsBn}
                  />

                  {p.plantDetails && (
                    <CareRequirementsSection
                      plant={p}
                      sectionEdit={sectionEdit}
                      plantDetails={p.plantDetails}
                    />
                  )}

                  <CareInstructionsPreview
                    plantId={p.id}
                    careEn={overview.careEn}
                    careBn={overview.careBn}
                  />

                  <PricingInventorySection
                    plant={p}
                    priceRange={overview.priceRange()}
                    totalStock={overview.totalStock()}
                    inventoryLabel={inventory.label}
                    inventoryVariant={inventory.variant}
                  />
                </div>

                <div class="space-y-6">
                  {p.plantDetails && <CareProfileSidebar plantDetails={p.plantDetails} />}
                  <VariantPreviewSection plant={p} />
                  <PlantMetadataSection plant={p} />
                  <PlantQuickActionsPanel plant={p} enName={overview.enName()} />
                </div>
              </div>
            </div>
          );
        }}
      </Show>
    </ErrorBoundary>
  );
}
