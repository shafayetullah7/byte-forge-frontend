import { For, Show } from "solid-js";
import { useParams, createAsync } from "@solidjs/router";
import { getPlantById } from "~/lib/api/endpoints/seller/plants.api";
import { usePlantSectionEdit } from "~/lib/plants/usePlantSectionEdit";
import { SunIcon } from "~/components/icons";
import { EditableSectionCard } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/EditableSectionCard";
import { PlantSectionFieldEditor } from "../../components/PlantSectionFieldEditor";
import { InstructionRow } from "../components/InstructionRow";
import { CARE_INSTRUCTION_ITEMS } from "../components/care-instruction-config";
import { useI18n } from "~/i18n";
import { usePlantOverviewData } from "../hooks/usePlantOverviewData";

export default function CareGuideRoute() {
  const { t } = useI18n();
  const params = useParams();

  const plant = createAsync(
    () => getPlantById(params.plantId as string),
    { deferStream: true },
  );

  const sectionEdit = usePlantSectionEdit(params.plantId as string, plant);
  const overview = usePlantOverviewData(plant);

  return (
    <Show when={plant()}>
      {(plantData) => (
        <EditableSectionCard
          title={t("seller.products.plantDetail.tabs.care")}
          icon={<SunIcon class="w-4 h-4 text-gray-400" />}
          isEditing={sectionEdit.isEditing("careGuide")}
          isSaving={sectionEdit.isSaving()}
          onEdit={() => sectionEdit.startEdit("careGuide")}
          onCancel={sectionEdit.cancelEdit}
          onSave={sectionEdit.save}
        >
          <Show
            when={sectionEdit.isEditing("careGuide")}
            fallback={
              <Show
                when={overview.careEn()}
                fallback={
                  <div class="text-center py-8">
                    <p class="text-gray-500 dark:text-gray-400">
                      {t("seller.products.plantOverview.noCareInstructions")}
                    </p>
                  </div>
                }
              >
                <div class="space-y-5">
                  <For each={CARE_INSTRUCTION_ITEMS}>
                    {(item) => (
                      <InstructionRow
                        compact
                        icon={item.icon}
                        iconColor={item.iconColor}
                        bgColor={item.bgColor}
                        titleEn={t(item.titleEnKey)}
                        titleBn={t(item.titleBnKey)}
                        descEn={overview.careEn()?.[item.field] ?? null}
                        descBn={overview.careBn()?.[item.field] ?? null}
                      />
                    )}
                  </For>
                </div>
              </Show>
            }
          >
            <PlantSectionFieldEditor
              sectionId="careGuide"
              form={sectionEdit.draftForm}
              setForm={sectionEdit.setDraftForm}
              errors={sectionEdit.errors()}
              plantId={plantData().id}
            />
          </Show>
        </EditableSectionCard>
      )}
    </Show>
  );
}
