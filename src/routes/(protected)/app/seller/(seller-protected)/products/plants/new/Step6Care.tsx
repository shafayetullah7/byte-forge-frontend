import { For, Show, onMount } from "solid-js";
import { Textarea } from "~/components/ui";

const CARE_FIELDS = [
  { key: "lightInstructions", label: "lightInstructionsLabel", placeholder: "lightInstructionsPlaceholder", placeholderBn: "lightInstructionsBnPlaceholder" },
  { key: "wateringInstructions", label: "wateringInstructionsLabel", placeholder: "wateringInstructionsPlaceholder", placeholderBn: "wateringInstructionsBnPlaceholder" },
  { key: "humidityInstructions", label: "humidityInstructionsLabel", placeholder: "humidityInstructionsPlaceholder", placeholderBn: "humidityInstructionsBnPlaceholder" },
  { key: "fertilizerSchedule", label: "fertilizerScheduleLabel", placeholder: "fertilizerSchedulePlaceholder", placeholderBn: "fertilizerScheduleBnPlaceholder" },
  { key: "repottingFrequency", label: "repottingFrequencyLabel", placeholder: "repottingFrequencyPlaceholder", placeholderBn: "repottingFrequencyBnPlaceholder" },
  { key: "pruningNotes", label: "pruningNotesLabel", placeholder: "pruningNotesPlaceholder", placeholderBn: "pruningNotesBnPlaceholder" },
  { key: "commonProblems", label: "commonProblemsLabel", placeholder: "commonProblemsPlaceholder", placeholderBn: "commonProblemsBnPlaceholder" },
  { key: "seasonalCare", label: "seasonalCareLabel", placeholder: "seasonalCarePlaceholder", placeholderBn: "seasonalCareBnPlaceholder" },
] as const;

type CareFieldKey = (typeof CARE_FIELDS)[number]["key"];

export function Step6Care(props: {
  careGuide: {
    en: Record<CareFieldKey, string>;
    bn: Record<CareFieldKey, string>;
  };
  onEnChange: (key: CareFieldKey, value: string) => void;
  onBnChange: (key: CareFieldKey, value: string) => void;
  t: (key: string) => string;
  onWarningChange: (hasWarning: boolean, missingFields: string[]) => void;
}) {
  onMount(() => {
    props.onWarningChange(false, []);
  });

  return (
    <div class="space-y-6">
      {/* English Care Instructions */}
      <div>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-lg">🇬🇧</span>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">{props.t("seller.products.newPlant.englishLabel")}</h4>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <For each={CARE_FIELDS}>
            {(field) => (
              <Textarea
                label={props.t(`seller.products.newPlant.${field.label}`)}
                placeholder={props.t(`seller.products.newPlant.${field.placeholder}`)}
                value={props.careGuide.en[field.key]}
                onInput={(e) => props.onEnChange(field.key, (e.currentTarget as HTMLTextAreaElement).value)}
                rows={3}
              />
            )}
          </For>
        </div>
      </div>

      {/* Bengali Care Translations */}
      <div class="border-t border-cream-200 dark:border-forest-700 pt-6">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-lg">🇧🇩</span>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">{props.t("seller.products.newPlant.bengaliLabel")}</h4>
          <span class="text-xs text-gray-400 dark:text-gray-500">({props.t("common.optional")})</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <For each={CARE_FIELDS}>
            {(field) => (
              <Textarea
                label={props.t(`seller.products.newPlant.${field.label}`)}
                placeholder={props.t(`seller.products.newPlant.${field.placeholderBn}`)}
                value={props.careGuide.bn[field.key]}
                onInput={(e) => props.onBnChange(field.key, (e.currentTarget as HTMLTextAreaElement).value)}
                rows={3}
                dir="auto"
              />
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
