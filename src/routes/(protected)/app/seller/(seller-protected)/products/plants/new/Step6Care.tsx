import { Textarea } from "~/components/ui";

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
}) {
  return (
    <div class="space-y-6">
      {/* General Care Instructions */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label={props.t("seller.products.newPlant.lightInstructionsLabel")}
          placeholder={props.t("seller.products.newPlant.lightInstructionsPlaceholder")}
          value={props.lightInstructions}
          onInput={(e) => props.onLightInstructionsChange((e.currentTarget as HTMLTextAreaElement).value)}
          rows={3}
        />
        <Textarea
          label={props.t("seller.products.newPlant.wateringInstructionsLabel")}
          placeholder={props.t("seller.products.newPlant.wateringInstructionsPlaceholder")}
          value={props.wateringInstructions}
          onInput={(e) => props.onWateringInstructionsChange((e.currentTarget as HTMLTextAreaElement).value)}
          rows={3}
        />
        <Textarea
          label={props.t("seller.products.newPlant.humidityInstructionsLabel")}
          placeholder={props.t("seller.products.newPlant.humidityInstructionsPlaceholder")}
          value={props.humidityInstructions}
          onInput={(e) => props.onHumidityInstructionsChange((e.currentTarget as HTMLTextAreaElement).value)}
          rows={3}
        />
        <Textarea
          label={props.t("seller.products.newPlant.fertilizerScheduleLabel")}
          placeholder={props.t("seller.products.newPlant.fertilizerSchedulePlaceholder")}
          value={props.fertilizerSchedule}
          onInput={(e) => props.onFertilizerScheduleChange((e.currentTarget as HTMLTextAreaElement).value)}
          rows={3}
        />
        <Textarea
          label={props.t("seller.products.newPlant.repottingFrequencyLabel")}
          placeholder={props.t("seller.products.newPlant.repottingFrequencyPlaceholder")}
          value={props.repottingFrequency}
          onInput={(e) => props.onRepottingFrequencyChange((e.currentTarget as HTMLTextAreaElement).value)}
          rows={3}
        />
        <Textarea
          label={props.t("seller.products.newPlant.pruningNotesLabel")}
          placeholder={props.t("seller.products.newPlant.pruningNotesPlaceholder")}
          value={props.pruningNotes}
          onInput={(e) => props.onPruningNotesChange((e.currentTarget as HTMLTextAreaElement).value)}
          rows={3}
        />
        <Textarea
          label={props.t("seller.products.newPlant.commonProblemsLabel")}
          placeholder={props.t("seller.products.newPlant.commonProblemsPlaceholder")}
          value={props.commonProblems}
          onInput={(e) => props.onCommonProblemsChange((e.currentTarget as HTMLTextAreaElement).value)}
          rows={3}
        />
        <Textarea
          label={props.t("seller.products.newPlant.seasonalCareLabel")}
          placeholder={props.t("seller.products.newPlant.seasonalCarePlaceholder")}
          value={props.seasonalCare}
          onInput={(e) => props.onSeasonalCareChange((e.currentTarget as HTMLTextAreaElement).value)}
          rows={3}
        />
      </div>

      {/* Bengali Care Translations */}
      <div class="border-t border-cream-200 dark:border-forest-700 pt-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {props.t("seller.products.newPlant.careTranslationsTitle")}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            label={props.t("seller.products.newPlant.lightInstructionsLabel")}
            placeholder={props.t("seller.products.newPlant.lightInstructionsBnPlaceholder")}
            value={props.bnLightInstructions}
            onInput={(e) => props.onBnLightInstructionsChange((e.currentTarget as HTMLTextAreaElement).value)}
            rows={3}
            dir="auto"
          />
          <Textarea
            label={props.t("seller.products.newPlant.wateringInstructionsLabel")}
            placeholder={props.t("seller.products.newPlant.wateringInstructionsBnPlaceholder")}
            value={props.bnWateringInstructions}
            onInput={(e) => props.onBnWateringInstructionsChange((e.currentTarget as HTMLTextAreaElement).value)}
            rows={3}
            dir="auto"
          />
          <Textarea
            label={props.t("seller.products.newPlant.humidityInstructionsLabel")}
            placeholder={props.t("seller.products.newPlant.humidityInstructionsBnPlaceholder")}
            value={props.bnHumidityInstructions}
            onInput={(e) => props.onBnHumidityInstructionsChange((e.currentTarget as HTMLTextAreaElement).value)}
            rows={3}
            dir="auto"
          />
          <Textarea
            label={props.t("seller.products.newPlant.fertilizerScheduleLabel")}
            placeholder={props.t("seller.products.newPlant.fertilizerScheduleBnPlaceholder")}
            value={props.bnFertilizerSchedule}
            onInput={(e) => props.onBnFertilizerScheduleChange((e.currentTarget as HTMLTextAreaElement).value)}
            rows={3}
            dir="auto"
          />
          <Textarea
            label={props.t("seller.products.newPlant.repottingFrequencyLabel")}
            placeholder={props.t("seller.products.newPlant.repottingFrequencyBnPlaceholder")}
            value={props.bnRepottingFrequency}
            onInput={(e) => props.onBnRepottingFrequencyChange((e.currentTarget as HTMLTextAreaElement).value)}
            rows={3}
            dir="auto"
          />
          <Textarea
            label={props.t("seller.products.newPlant.pruningNotesLabel")}
            placeholder={props.t("seller.products.newPlant.pruningNotesBnPlaceholder")}
            value={props.bnPruningNotes}
            onInput={(e) => props.onBnPruningNotesChange((e.currentTarget as HTMLTextAreaElement).value)}
            rows={3}
            dir="auto"
          />
          <Textarea
            label={props.t("seller.products.newPlant.commonProblemsLabel")}
            placeholder={props.t("seller.products.newPlant.commonProblemsBnPlaceholder")}
            value={props.bnCommonProblems}
            onInput={(e) => props.onBnCommonProblemsChange((e.currentTarget as HTMLTextAreaElement).value)}
            rows={3}
            dir="auto"
          />
          <Textarea
            label={props.t("seller.products.newPlant.seasonalCareLabel")}
            placeholder={props.t("seller.products.newPlant.seasonalCareBnPlaceholder")}
            value={props.bnSeasonalCare}
            onInput={(e) => props.onBnSeasonalCareChange((e.currentTarget as HTMLTextAreaElement).value)}
            rows={3}
            dir="auto"
          />
        </div>
      </div>
    </div>
  );
}
