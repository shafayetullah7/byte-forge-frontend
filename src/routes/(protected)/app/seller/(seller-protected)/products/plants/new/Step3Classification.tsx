import { Show } from "solid-js";
import { Input } from "~/components/ui";

export function Step3Classification(props: {
  enCommonNames: string;
  onEnCommonNamesChange: (v: string) => void;
  enOrigin: string;
  onEnOriginChange: (v: string) => void;
  enSoilType: string;
  onEnSoilTypeChange: (v: string) => void;
  enToxicityInfo: string;
  onEnToxicityInfoChange: (v: string) => void;
  bnCommonNames: string;
  onBnCommonNamesChange: (v: string) => void;
  bnOrigin: string;
  onBnOriginChange: (v: string) => void;
  bnSoilType: string;
  onBnSoilTypeChange: (v: string) => void;
  bnToxicityInfo: string;
  onBnToxicityInfoChange: (v: string) => void;
  t: (key: string) => string;
  onWarningChange: (hasWarning: boolean, missingFields: string[]) => void;
}) {
  props.onWarningChange(false, []);

  return (
    <div class="space-y-6">
      {/* Description */}
      <div class="bg-cream-50 dark:bg-forest-800/50 rounded-lg p-4 border border-cream-200 dark:border-forest-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {props.t("seller.products.newPlant.localizedDetailsDescription")}
        </p>
      </div>

      {/* Bilingual Localized Details */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EN Details */}
        <div class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">🇬🇧</span>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">{props.t("seller.products.newPlant.englishLabel")}</h4>
          </div>
          <Input
            label={props.t("seller.products.newPlant.commonNamesLabel")}
            placeholder={props.t("seller.products.newPlant.commonNamesPlaceholder")}
            value={props.enCommonNames}
            onInput={(e) => props.onEnCommonNamesChange((e.currentTarget as HTMLInputElement).value)}
          />
          <Input
            label={props.t("seller.products.newPlant.originLabel")}
            placeholder={props.t("seller.products.newPlant.originPlaceholder")}
            value={props.enOrigin}
            onInput={(e) => props.onEnOriginChange((e.currentTarget as HTMLInputElement).value)}
          />
          <Input
            label={props.t("seller.products.newPlant.soilTypeLabel")}
            placeholder={props.t("seller.products.newPlant.soilTypePlaceholder")}
            value={props.enSoilType}
            onInput={(e) => props.onEnSoilTypeChange((e.currentTarget as HTMLInputElement).value)}
          />
          <Input
            label={props.t("seller.products.newPlant.toxicityInfoLabel")}
            placeholder={props.t("seller.products.newPlant.toxicityInfoPlaceholder")}
            value={props.enToxicityInfo}
            onInput={(e) => props.onEnToxicityInfoChange((e.currentTarget as HTMLInputElement).value)}
          />
        </div>

        {/* BN Details */}
        <div class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">🇧🇩</span>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">{props.t("seller.products.newPlant.bengaliLabel")}</h4>
          </div>
          <Input
            label={props.t("seller.products.newPlant.commonNamesLabel")}
            placeholder={props.t("seller.products.newPlant.commonNamesBnPlaceholder")}
            value={props.bnCommonNames}
            onInput={(e) => props.onBnCommonNamesChange((e.currentTarget as HTMLInputElement).value)}
          />
          <Input
            label={props.t("seller.products.newPlant.originLabel")}
            placeholder={props.t("seller.products.newPlant.originBnPlaceholder")}
            value={props.bnOrigin}
            onInput={(e) => props.onBnOriginChange((e.currentTarget as HTMLInputElement).value)}
          />
          <Input
            label={props.t("seller.products.newPlant.soilTypeLabel")}
            placeholder={props.t("seller.products.newPlant.soilTypeBnPlaceholder")}
            value={props.bnSoilType}
            onInput={(e) => props.onBnSoilTypeChange((e.currentTarget as HTMLInputElement).value)}
          />
          <Input
            label={props.t("seller.products.newPlant.toxicityInfoLabel")}
            placeholder={props.t("seller.products.newPlant.toxicityInfoBnPlaceholder")}
            value={props.bnToxicityInfo}
            onInput={(e) => props.onBnToxicityInfoChange((e.currentTarget as HTMLInputElement).value)}
          />
        </div>
      </div>
    </div>
  );
}
