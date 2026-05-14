import { Show, createMemo } from "solid-js";
import { useParams, createAsync } from "@solidjs/router";
import { getPlantById } from "~/lib/api/endpoints/seller/plants.api";
import { SunIcon, DropletIcon, CloudIcon, BeakerIcon, SproutIcon, ScissorsIcon, ExclamationCircleIcon, CalendarIcon } from "~/components/icons";
import { SectionCard } from "../components/SectionCard";

// ─── Care Instruction Row Component ─────────────────────────────────

function CareInstructionRow(props: {
  icon: any;
  iconColor: string;
  bgColor: string;
  titleEn: string;
  titleBn: string;
  descEn: string | null;
  descBn: string | null;
}) {
  const hasContent = () => props.descEn || props.descBn;

  return (
    <Show when={hasContent()}>
      <div class="space-y-3">
        {/* English */}
        <Show when={props.descEn}>
          <div class={`flex gap-3 p-3 rounded-lg ${props.bgColor}`}>
            <div class={`${props.iconColor} flex-shrink-0 mt-0.5`}>{props.icon}</div>
            <div>
              <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">{props.titleEn}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">{props.descEn}</p>
            </div>
          </div>
        </Show>
        {/* Bangla */}
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

// ─── Main Care Guide Route ──────────────────────────────────────────

export default function CareGuideRoute() {
  const params = useParams();

  const plant = createAsync(
    () => getPlantById(params.plantId as string),
    { deferStream: true }
  );

  // Get care instructions with translations
  const careInstructions = createMemo(() => {
    const ci = plant()?.careInstructions;
    if (!ci) return null;

    const en = ci.translations?.find(t => t.locale === "en");
    const bn = ci.translations?.find(t => t.locale === "bn");

    return {
      en: en || ci,
      bn: bn || en || ci,
    };
  });

  return (
    <div class="space-y-6">
      <SectionCard
        title="Complete Care Guide"
        icon={<SunIcon class="w-4 h-4 text-gray-400" />}
      >
        <Show when={careInstructions()} fallback={
          <div class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">No care instructions available for this plant.</p>
          </div>
        }>
          {(care) => (
            <div class="space-y-5">
              {/* Light */}
              <CareInstructionRow
                icon={<SunIcon class="w-5 h-5" />}
                iconColor="text-cream-600 dark:text-cream-400"
                bgColor="bg-cream-50 dark:bg-forest-900/30"
                titleEn="Light Instructions"
                titleBn="আলোর নির্দেশনা"
                descEn={care().en.lightInstructions}
                descBn={care().bn.lightInstructions}
              />

              {/* Watering */}
              <CareInstructionRow
                icon={<DropletIcon class="w-5 h-5" />}
                iconColor="text-blue-600 dark:text-blue-400"
                bgColor="bg-blue-50 dark:bg-blue-900/20"
                titleEn="Watering Instructions"
                titleBn="পানির নির্দেশনা"
                descEn={care().en.wateringInstructions}
                descBn={care().bn.wateringInstructions}
              />

              {/* Humidity */}
              <CareInstructionRow
                icon={<CloudIcon class="w-5 h-5" />}
                iconColor="text-sky-600 dark:text-sky-400"
                bgColor="bg-sky-50 dark:bg-sky-900/20"
                titleEn="Humidity Instructions"
                titleBn="আর্দ্রতার নির্দেশনা"
                descEn={care().en.humidityInstructions}
                descBn={care().bn.humidityInstructions}
              />

              {/* Fertilizer */}
              <CareInstructionRow
                icon={<BeakerIcon class="w-5 h-5" />}
                iconColor="text-sage-600 dark:text-sage-400"
                bgColor="bg-sage-50 dark:bg-sage-900/20"
                titleEn="Fertilizer Schedule"
                titleBn="সারের সময়সূচী"
                descEn={care().en.fertilizerSchedule}
                descBn={care().bn.fertilizerSchedule}
              />

              {/* Repotting */}
              <CareInstructionRow
                icon={<SproutIcon class="w-5 h-5" />}
                iconColor="text-forest-600 dark:text-forest-400"
                bgColor="bg-forest-50 dark:bg-forest-900/20"
                titleEn="Repotting Frequency"
                titleBn="পুনরায় পোট করার সময়সূচী"
                descEn={care().en.repottingFrequency}
                descBn={care().bn.repottingFrequency}
              />

              {/* Pruning */}
              <CareInstructionRow
                icon={<ScissorsIcon class="w-5 h-5" />}
                iconColor="text-purple-600 dark:text-purple-400"
                bgColor="bg-purple-50 dark:bg-purple-900/20"
                titleEn="Pruning Notes"
                titleBn="ছাঁটাইয়ের নোট"
                descEn={care().en.pruningNotes}
                descBn={care().bn.pruningNotes}
              />

              {/* Common Problems */}
              <CareInstructionRow
                icon={<ExclamationCircleIcon class="w-5 h-5" />}
                iconColor="text-red-600 dark:text-red-400"
                bgColor="bg-red-50 dark:bg-red-900/20"
                titleEn="Common Problems"
                titleBn="সাধারণ সমস্যা"
                descEn={care().en.commonProblems}
                descBn={care().bn.commonProblems}
              />

              {/* Seasonal Care */}
              <CareInstructionRow
                icon={<CalendarIcon class="w-5 h-5" />}
                iconColor="text-amber-600 dark:text-amber-400"
                bgColor="bg-amber-50 dark:bg-amber-900/20"
                titleEn="Seasonal Care"
                titleBn="মৌসুমি যত্ন"
                descEn={care().en.seasonalCare}
                descBn={care().bn.seasonalCare}
              />
            </div>
          )}
        </Show>
      </SectionCard>
    </div>
  );
}
