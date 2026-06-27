import { Show } from "solid-js";
import { LeafIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import type { PlantDetail } from "~/lib/api/types/seller.types";
import type { usePlantSectionEdit } from "~/lib/plants/usePlantSectionEdit";
import { PlantEditableSection } from "../PlantEditableSection";

type SectionEdit = ReturnType<typeof usePlantSectionEdit>;

export function PlantIdentitySection(props: {
  plant: PlantDetail;
  sectionEdit: SectionEdit;
  enName: string;
  enShortDescription: string;
  bnDescription: string;
  scientificName: string;
  hasBnTranslation: boolean;
}) {
  const { t } = useI18n();

  return (
    <PlantEditableSection
      sectionId="identity"
      title={t("seller.products.plantOverview.plantIdentity")}
      icon={<LeafIcon class="w-4 h-4 text-gray-400" />}
      plantId={props.plant.id}
      sectionEdit={props.sectionEdit}
      originalSlug={props.plant.slug}
      view={
        <div class="flex flex-col sm:flex-row">
          <div class="sm:w-64 md:w-72 h-56 sm:h-auto bg-cream-100 dark:bg-forest-900/50 flex items-center justify-center flex-shrink-0 border-b sm:border-b-0 sm:border-r border-cream-200 dark:border-forest-700">
            {props.plant.thumbnail?.url ? (
              <img
                src={props.plant.thumbnail.url}
                alt={props.enName}
                class="w-full h-full object-cover"
              />
            ) : (
              <LeafIcon class="w-20 h-20 text-gray-300 dark:text-gray-600" />
            )}
          </div>
          <div class="flex-1 p-6">
            <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-1">
              {t("seller.products.plantOverview.english")}
            </h2>
            <p class="text-xl font-semibold text-forest-800 dark:text-cream-50 mb-2">{props.enName}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.enShortDescription}</p>
            <Show when={props.hasBnTranslation}>
              <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
                <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-1">
                  {t("seller.products.plantOverview.bengali")}
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.bnDescription}</p>
              </div>
            </Show>
            <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {t("seller.products.plantOverview.scientificName")}:{" "}
                <span class="text-gray-700 dark:text-gray-300 italic">{props.scientificName}</span>
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
}
