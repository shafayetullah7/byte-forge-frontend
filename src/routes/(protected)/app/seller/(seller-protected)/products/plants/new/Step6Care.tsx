import { Show } from "solid-js";

function InputField(props: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onInput: (val: string) => void;
  textarea?: boolean;
  rows?: number;
  dir?: "auto" | "ltr" | "rtl";
}) {
  return (
    <div>
      <label for={props.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {props.label}
      </label>
      {props.textarea ? (
        <textarea
          id={props.id}
          value={props.value}
          onInput={(e) => props.onInput((e.target as HTMLTextAreaElement).value)}
          placeholder={props.placeholder}
          rows={props.rows || 3}
          dir={props.dir}
          class="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors text-sm resize-none"
        />
      ) : (
        <input
          type="text"
          id={props.id}
          value={props.value}
          onInput={(e) => props.onInput((e.target as HTMLInputElement).value)}
          placeholder={props.placeholder}
          dir={props.dir}
          class="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors text-sm"
        />
      )}
    </div>
  );
}

export function Step6Care(props: {
  lightInstructions: string;
  onLightInstructionsChange: (v: string) => void;
  wateringInstructions: string;
  onWateringInstructionsChange: (v: string) => void;
  humidityInstructions: string;
  onHumidityInstructionsChange: (v: string) => void;
  fertilizerSchedule: string;
  onFertilizerScheduleChange: (v: string) => void;
  repottingFrequency: string;
  onRepottingFrequencyChange: (v: string) => void;
  pruningNotes: string;
  onPruningNotesChange: (v: string) => void;
  commonProblems: string;
  onCommonProblemsChange: (v: string) => void;
  seasonalCare: string;
  onSeasonalCareChange: (v: string) => void;
  bnLightInstructions: string;
  onBnLightInstructionsChange: (v: string) => void;
  bnWateringInstructions: string;
  onBnWateringInstructionsChange: (v: string) => void;
  bnHumidityInstructions: string;
  onBnHumidityInstructionsChange: (v: string) => void;
  bnFertilizerSchedule: string;
  onBnFertilizerScheduleChange: (v: string) => void;
  bnRepottingFrequency: string;
  onBnRepottingFrequencyChange: (v: string) => void;
  bnPruningNotes: string;
  onBnPruningNotesChange: (v: string) => void;
  bnCommonProblems: string;
  onBnCommonProblemsChange: (v: string) => void;
  bnSeasonalCare: string;
  onBnSeasonalCareChange: (v: string) => void;
  t: (key: string) => string;
  onWarningChange: (hasWarning: boolean, missingFields: string[]) => void;
}) {
  props.onWarningChange(false, []);

  return (
    <div class="space-y-6">
      {/* General Care Instructions */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id="care-light"
          label={props.t("seller.products.newPlant.lightInstructionsLabel")}
          placeholder={props.t("seller.products.newPlant.lightInstructionsPlaceholder")}
          value={props.lightInstructions}
          onInput={props.onLightInstructionsChange}
          textarea
          rows={3}
        />
        <InputField
          id="care-watering"
          label={props.t("seller.products.newPlant.wateringInstructionsLabel")}
          placeholder={props.t("seller.products.newPlant.wateringInstructionsPlaceholder")}
          value={props.wateringInstructions}
          onInput={props.onWateringInstructionsChange}
          textarea
          rows={3}
        />
        <InputField
          id="care-humidity"
          label={props.t("seller.products.newPlant.humidityInstructionsLabel")}
          placeholder={props.t("seller.products.newPlant.humidityInstructionsPlaceholder")}
          value={props.humidityInstructions}
          onInput={props.onHumidityInstructionsChange}
          textarea
          rows={3}
        />
        <InputField
          id="care-fertilizer"
          label={props.t("seller.products.newPlant.fertilizerScheduleLabel")}
          placeholder={props.t("seller.products.newPlant.fertilizerSchedulePlaceholder")}
          value={props.fertilizerSchedule}
          onInput={props.onFertilizerScheduleChange}
          textarea
          rows={3}
        />
        <InputField
          id="care-repotting"
          label={props.t("seller.products.newPlant.repottingFrequencyLabel")}
          placeholder={props.t("seller.products.newPlant.repottingFrequencyPlaceholder")}
          value={props.repottingFrequency}
          onInput={props.onRepottingFrequencyChange}
          textarea
          rows={3}
        />
        <InputField
          id="care-pruning"
          label={props.t("seller.products.newPlant.pruningNotesLabel")}
          placeholder={props.t("seller.products.newPlant.pruningNotesPlaceholder")}
          value={props.pruningNotes}
          onInput={props.onPruningNotesChange}
          textarea
          rows={3}
        />
        <InputField
          id="care-problems"
          label={props.t("seller.products.newPlant.commonProblemsLabel")}
          placeholder={props.t("seller.products.newPlant.commonProblemsPlaceholder")}
          value={props.commonProblems}
          onInput={props.onCommonProblemsChange}
          textarea
          rows={3}
        />
        <InputField
          id="care-seasonal"
          label={props.t("seller.products.newPlant.seasonalCareLabel")}
          placeholder={props.t("seller.products.newPlant.seasonalCarePlaceholder")}
          value={props.seasonalCare}
          onInput={props.onSeasonalCareChange}
          textarea
          rows={3}
        />
      </div>

      {/* Bengali Care Translations */}
      <div class="border-t border-cream-200 dark:border-forest-700 pt-6">
        <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-4">
          {props.t("seller.products.newPlant.careTranslationsTitle")}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="care-bn-light"
            label={props.t("seller.products.newPlant.lightInstructionsLabel")}
            placeholder={props.t("seller.products.newPlant.lightInstructionsBnPlaceholder")}
            value={props.bnLightInstructions}
            onInput={props.onBnLightInstructionsChange}
            dir="auto"
            textarea
            rows={3}
          />
          <InputField
            id="care-bn-watering"
            label={props.t("seller.products.newPlant.wateringInstructionsLabel")}
            placeholder={props.t("seller.products.newPlant.wateringInstructionsBnPlaceholder")}
            value={props.bnWateringInstructions}
            onInput={props.onBnWateringInstructionsChange}
            dir="auto"
            textarea
            rows={3}
          />
          <InputField
            id="care-bn-humidity"
            label={props.t("seller.products.newPlant.humidityInstructionsLabel")}
            placeholder={props.t("seller.products.newPlant.humidityInstructionsBnPlaceholder")}
            value={props.bnHumidityInstructions}
            onInput={props.onBnHumidityInstructionsChange}
            dir="auto"
            textarea
            rows={3}
          />
          <InputField
            id="care-bn-fertilizer"
            label={props.t("seller.products.newPlant.fertilizerScheduleLabel")}
            placeholder={props.t("seller.products.newPlant.fertilizerScheduleBnPlaceholder")}
            value={props.bnFertilizerSchedule}
            onInput={props.onBnFertilizerScheduleChange}
            dir="auto"
            textarea
            rows={3}
          />
          <InputField
            id="care-bn-repotting"
            label={props.t("seller.products.newPlant.repottingFrequencyLabel")}
            placeholder={props.t("seller.products.newPlant.repottingFrequencyBnPlaceholder")}
            value={props.bnRepottingFrequency}
            onInput={props.onBnRepottingFrequencyChange}
            dir="auto"
            textarea
            rows={3}
          />
          <InputField
            id="care-bn-pruning"
            label={props.t("seller.products.newPlant.pruningNotesLabel")}
            placeholder={props.t("seller.products.newPlant.pruningNotesBnPlaceholder")}
            value={props.bnPruningNotes}
            onInput={props.onBnPruningNotesChange}
            dir="auto"
            textarea
            rows={3}
          />
          <InputField
            id="care-bn-problems"
            label={props.t("seller.products.newPlant.commonProblemsLabel")}
            placeholder={props.t("seller.products.newPlant.commonProblemsBnPlaceholder")}
            value={props.bnCommonProblems}
            onInput={props.onBnCommonProblemsChange}
            dir="auto"
            textarea
            rows={3}
          />
          <InputField
            id="care-bn-seasonal"
            label={props.t("seller.products.newPlant.seasonalCareLabel")}
            placeholder={props.t("seller.products.newPlant.seasonalCareBnPlaceholder")}
            value={props.bnSeasonalCare}
            onInput={props.onBnSeasonalCareChange}
            dir="auto"
            textarea
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
