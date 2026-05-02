import { createEffect, Show } from "solid-js";
import { Select, type SelectOption } from "~/components/ui/Select";
import { Input } from "~/components/ui";

export function Step5CareProfile(props: {
  lightRequirement: string;
  onLightChange: (v: string) => void;
  wateringFrequency: string;
  onWateringChange: (v: string) => void;
  humidityLevel: string;
  onHumidityChange: (v: string) => void;
  careDifficulty: string;
  onCareDifficultyChange: (v: string) => void;
  growthRate: string;
  onGrowthRateChange: (v: string) => void;
  temperatureRange: string;
  onTemperatureChange: (v: string) => void;
  matureHeight: string;
  onMatureHeightChange: (v: string) => void;
  matureSpread: string;
  onMatureSpreadChange: (v: string) => void;
  errors: Record<string, string>;
  lightOptions: SelectOption[];
  wateringOptions: SelectOption[];
  humidityOptions: SelectOption[];
  careDifficultyOptions: SelectOption[];
  growthRateOptions: SelectOption[];
  t: (key: string) => string;
  onWarningChange: (hasWarning: boolean, missingFields: string[]) => void;
}) {
  createEffect(() => {
    const missing: string[] = [];
    if (!props.lightRequirement) missing.push(props.t("seller.products.newPlant.lightRequired"));
    if (!props.wateringFrequency) missing.push(props.t("seller.products.newPlant.wateringRequired"));
    if (!props.humidityLevel) missing.push(props.t("seller.products.newPlant.humidityRequired"));
    if (!props.careDifficulty) missing.push(props.t("seller.products.newPlant.careDifficultyRequired"));
    props.onWarningChange(missing.length > 0, missing);
  });

  return (
    <div class="space-y-6">
      {/* Description */}
      <div class="bg-cream-50 dark:bg-forest-800/50 rounded-lg p-4 border border-cream-200 dark:border-forest-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {props.t("seller.products.newPlant.careProfileDescription")}
        </p>
      </div>

      {/* Care Requirements */}
      <div class="border-t border-cream-200 dark:border-forest-700 pt-4">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {props.t("seller.products.newPlant.careRequirements")}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label={props.t("seller.products.newPlant.lightRequirementLabel")}
            options={props.lightOptions}
            value={props.lightRequirement}
            onChange={(e) => props.onLightChange(e.currentTarget.value)}
            placeholder={props.t("seller.products.newPlant.lightRequirementPlaceholder")}
            error={props.errors["lightRequirement"]}
            required
          />
          <Select
            label={props.t("seller.products.newPlant.wateringFrequencyLabel")}
            options={props.wateringOptions}
            value={props.wateringFrequency}
            onChange={(e) => props.onWateringChange(e.currentTarget.value)}
            placeholder={props.t("seller.products.newPlant.wateringFrequencyPlaceholder")}
            error={props.errors["wateringFrequency"]}
            required
          />
          <Select
            label={props.t("seller.products.newPlant.humidityLevelLabel")}
            options={props.humidityOptions}
            value={props.humidityLevel}
            onChange={(e) => props.onHumidityChange(e.currentTarget.value)}
            placeholder={props.t("seller.products.newPlant.humidityLevelPlaceholder")}
            error={props.errors["humidityLevel"]}
            required
          />
          <Select
            label={props.t("seller.products.newPlant.careDifficultyLabel")}
            options={props.careDifficultyOptions}
            value={props.careDifficulty}
            onChange={(e) => props.onCareDifficultyChange(e.currentTarget.value)}
            placeholder={props.t("seller.products.newPlant.careDifficultyPlaceholder")}
            error={props.errors["careDifficulty"]}
            required
          />
          <Select
            label={props.t("seller.products.newPlant.growthRateLabel")}
            options={props.growthRateOptions}
            value={props.growthRate}
            onChange={(e) => props.onGrowthRateChange(e.currentTarget.value)}
            placeholder={props.t("seller.products.newPlant.growthRatePlaceholder")}
          />
        </div>
      </div>

      {/* Growth & Size */}
      <div class="border-t border-cream-200 dark:border-forest-700 pt-4">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {props.t("seller.products.newPlant.growthAndSize")}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={props.t("seller.products.newPlant.temperatureRangeLabel")}
            placeholder={props.t("seller.products.newPlant.temperatureRangePlaceholder")}
            value={props.temperatureRange}
            onInput={(e) => props.onTemperatureChange((e.currentTarget as HTMLInputElement).value)}
          />
          <Input
            label={props.t("seller.products.newPlant.matureHeightLabel")}
            placeholder={props.t("seller.products.newPlant.matureHeightPlaceholder")}
            value={props.matureHeight}
            onInput={(e) => props.onMatureHeightChange((e.currentTarget as HTMLInputElement).value)}
          />
          <Input
            label={props.t("seller.products.newPlant.matureSpreadLabel")}
            placeholder={props.t("seller.products.newPlant.matureSpreadPlaceholder")}
            value={props.matureSpread}
            onInput={(e) => props.onMatureSpreadChange((e.currentTarget as HTMLInputElement).value)}
          />
        </div>
      </div>
    </div>
  );
}
