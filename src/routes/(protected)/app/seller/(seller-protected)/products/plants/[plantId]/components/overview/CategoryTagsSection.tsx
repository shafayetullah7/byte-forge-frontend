import { For, Show } from "solid-js";
import { FolderIcon, TagIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import type { PlantDetail } from "~/lib/api/types/seller.types";
import type { usePlantSectionEdit } from "~/lib/plants/usePlantSectionEdit";
import { translationFor } from "../../utils/plant-translations";
import { DetailRow } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/DetailRow";
import { PlantEditableSection } from "../PlantEditableSection";

type SectionEdit = ReturnType<typeof usePlantSectionEdit>;

export function CategoryTagsSection(props: {
  plant: PlantDetail;
  sectionEdit: SectionEdit;
  categoryEn: string;
  categoryBn: string;
  knownPlantTags: () => { id: string; name: string }[];
}) {
  const { t } = useI18n();
  const tags = () => props.plant.plantDetails?.tags ?? [];

  return (
    <PlantEditableSection
      sectionId="categoryTags"
      title={t("seller.products.plantOverview.categoryAndTags")}
      icon={<TagIcon class="w-4 h-4 text-gray-400" />}
      plantId={props.plant.id}
      sectionEdit={props.sectionEdit}
      knownPlantTags={props.knownPlantTags}
      view={
        <>
          <DetailRow
            label={t("seller.products.plantOverview.categoryEn")}
            value={props.categoryEn}
            icon={() => <FolderIcon class="w-4 h-4" />}
          />
          <DetailRow
            label={t("seller.products.plantOverview.categoryBn")}
            value={props.categoryBn}
            icon={() => <FolderIcon class="w-4 h-4" />}
          />
          <Show when={tags().length > 0}>
            <div class="mt-4 pt-4 border-t border-cream-100 dark:border-forest-700/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                {t("seller.products.plantOverview.tags")}
              </p>
              <div class="flex flex-wrap gap-2">
                <For each={tags()}>
                  {(tag) => {
                    const nameEn =
                      translationFor(tag.translations, "en")?.name ?? tag.slug;
                    const nameBn = translationFor(tag.translations, "bn")?.name;
                    return (
                      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-300 rounded-full text-xs font-medium border border-forest-200 dark:border-forest-700">
                        <TagIcon class="w-3 h-3" />
                        {nameEn}
                        {nameBn && (
                          <span class="text-forest-500 dark:text-forest-400">({nameBn})</span>
                        )}
                      </span>
                    );
                  }}
                </For>
              </div>
            </div>
          </Show>
        </>
      }
    />
  );
}
