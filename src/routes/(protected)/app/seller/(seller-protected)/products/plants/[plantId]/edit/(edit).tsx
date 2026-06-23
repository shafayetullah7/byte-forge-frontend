import { Show } from "solid-js";
import { useParams, createAsync, type RouteDefinition } from "@solidjs/router";
import { getPlantById } from "~/lib/api/endpoints/seller/plants.api";
import { fromPlantDetailToForm } from "~/lib/types/plant-form";
import { PlantWizardPage } from "../../components/PlantWizardPage";
import { SpinnerIcon } from "~/components/icons";
import { useI18n } from "~/i18n";

export const route = {
  preload: ({ params }) => getPlantById(params.plantId as string),
} satisfies RouteDefinition;

export default function EditPlantPage() {
  const { t } = useI18n();
  const params = useParams();
  const plant = createAsync(() => getPlantById(params.plantId as string), {
    deferStream: true,
  });

  return (
    <Show
      when={plant()}
      keyed
      fallback={
        <div class="max-w-5xl mx-auto flex items-center justify-center py-24">
          <SpinnerIcon class="w-8 h-8 text-forest-600 dark:text-forest-400 animate-spin" />
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-400">
            {t("seller.products.plantDetail.loading")}
          </span>
        </div>
      }
    >
      {(plantData) => (
        <PlantWizardPage
          mode="edit"
          plantId={plantData.id}
          initialForm={fromPlantDetailToForm(plantData)}
          originalSlug={plantData.slug}
        />
      )}
    </Show>
  );
}
