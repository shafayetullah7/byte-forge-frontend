import { Show, type JSX } from "solid-js";
import { useParams, createAsync } from "@solidjs/router";
import { getPlantById } from "~/lib/api/endpoints/seller/plants.api";
import { usePlantSectionEdit } from "~/lib/plants/usePlantSectionEdit";
import { SunIcon, DropletIcon, CloudIcon, BeakerIcon, SproutIcon, ScissorsIcon, ExclamationCircleIcon, CalendarIcon } from "~/components/icons";
import { EditableSectionCard } from "../components/EditableSectionCard";
import { PlantSectionFieldEditor } from "../../components/PlantSectionFieldEditor";
import { useI18n } from "~/i18n";

function CareInstructionRow(props: {
  icon: JSX.Element;
  iconColor: string;
  bgColor: string;
  titleEn: string;
  titleBn: string;
  descEn: string | null;
  descBn: string | null;
}) {
  return (
    <Show when={props.descEn || props.descBn}>
      <div class="space-y-3">
        <Show when={props.descEn}>
          <div class={`flex gap-3 p-3 rounded-lg ${props.bgColor}`}>
            <div class={`${props.iconColor} flex-shrink-0 mt-0.5`}>{props.icon}</div>
            <div>
              <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">{props.titleEn}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">{props.descEn}</p>
            </div>
          </div>
        </Show>
        <Show when={props.descBn}>
          <div class="flex gap-3 p-3 rounded-lg bg-forest-50 dark:bg-forest-900/20 border-l-2 border-forest-300 dark:border-forest-600">
            <div class={`${props.iconColor} flex-shrink-0 mt-0.5 opacity-60`}>{props.icon}</div>
            <div>
              <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">{props.titleBn}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">{props.descBn}</p>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
}

export default function CareGuideRoute() {
  const { t } = useI18n();
  const params = useParams();

  const plant = createAsync(
    () => getPlantById(params.plantId as string),
    { deferStream: true }
  );

  const sectionEdit = usePlantSectionEdit(params.plantId as string, plant);

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
              <Show when={plantData().careInstructions} fallback={
                <div class="text-center py-8">
                  <p class="text-gray-500 dark:text-gray-400">No care instructions available for this plant.</p>
                </div>
              }>
                {(ci) => {
                  const careEn = ci().translations?.find(tr => tr.locale === "en") || ci();
                  const careBn = ci().translations?.find(tr => tr.locale === "bn") || careEn;

                  return (
                    <div class="space-y-5">
                      <CareInstructionRow
                        icon={<SunIcon class="w-5 h-5" />}
                        iconColor="text-cream-600 dark:text-cream-400"
                        bgColor="bg-cream-50 dark:bg-forest-900/30"
                        titleEn="Light Instructions"
                        titleBn="আলোর নির্দেশনা"
                        descEn={careEn.lightInstructions}
                        descBn={careBn.lightInstructions}
                      />
                      <CareInstructionRow
                        icon={<DropletIcon class="w-5 h-5" />}
                        iconColor="text-blue-600 dark:text-blue-400"
                        bgColor="bg-blue-50 dark:bg-blue-900/20"
                        titleEn="Watering Instructions"
                        titleBn="পানির নির্দেশনা"
                        descEn={careEn.wateringInstructions}
                        descBn={careBn.wateringInstructions}
                      />
                      <CareInstructionRow
                        icon={<CloudIcon class="w-5 h-5" />}
                        iconColor="text-sky-600 dark:text-sky-400"
                        bgColor="bg-sky-50 dark:bg-sky-900/20"
                        titleEn="Humidity Instructions"
                        titleBn="আর্দ্রতার নির্দেশনা"
                        descEn={careEn.humidityInstructions}
                        descBn={careBn.humidityInstructions}
                      />
                      <CareInstructionRow
                        icon={<BeakerIcon class="w-5 h-5" />}
                        iconColor="text-sage-600 dark:text-sage-400"
                        bgColor="bg-sage-50 dark:bg-sage-900/20"
                        titleEn="Fertilizer Schedule"
                        titleBn="সারের সময়সূচী"
                        descEn={careEn.fertilizerSchedule}
                        descBn={careBn.fertilizerSchedule}
                      />
                      <CareInstructionRow
                        icon={<SproutIcon class="w-5 h-5" />}
                        iconColor="text-forest-600 dark:text-forest-400"
                        bgColor="bg-forest-50 dark:bg-forest-900/20"
                        titleEn="Repotting Frequency"
                        titleBn="পুনরায় পট করার সময়সূচী"
                        descEn={careEn.repottingFrequency}
                        descBn={careBn.repottingFrequency}
                      />
                      <CareInstructionRow
                        icon={<ScissorsIcon class="w-5 h-5" />}
                        iconColor="text-purple-600 dark:text-purple-400"
                        bgColor="bg-purple-50 dark:bg-purple-900/20"
                        titleEn="Pruning Notes"
                        titleBn="ছাঁটাইয়ের নোট"
                        descEn={careEn.pruningNotes}
                        descBn={careBn.pruningNotes}
                      />
                      <CareInstructionRow
                        icon={<ExclamationCircleIcon class="w-5 h-5" />}
                        iconColor="text-red-600 dark:text-red-400"
                        bgColor="bg-red-50 dark:bg-red-900/20"
                        titleEn="Common Problems"
                        titleBn="সাধারণ সমস্যা"
                        descEn={careEn.commonProblems}
                        descBn={careBn.commonProblems}
                      />
                      <CareInstructionRow
                        icon={<CalendarIcon class="w-5 h-5" />}
                        iconColor="text-amber-600 dark:text-amber-400"
                        bgColor="bg-amber-50 dark:bg-amber-900/20"
                        titleEn="Seasonal Care"
                        titleBn="মৌসুমি যত্ন"
                        descEn={careEn.seasonalCare}
                        descBn={careBn.seasonalCare}
                      />
                    </div>
                  );
                }}
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
