import { Show } from "solid-js";

function InputField(props: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onInput: (val: string) => void;
  hint?: string;
  dir?: "auto" | "ltr" | "rtl";
}) {
  return (
    <div>
      <label for={props.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {props.label}
      </label>
      <input
        type="text"
        id={props.id}
        value={props.value}
        onInput={(e) => props.onInput((e.target as HTMLInputElement).value)}
        placeholder={props.placeholder}
        dir={props.dir}
        class="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors text-sm"
      />
      <Show when={props.hint}>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{props.hint}</p>
      </Show>
    </div>
  );
}

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
            <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">English</h4>
          </div>
          <InputField
            id="en-common-names"
            label={props.t("seller.products.newPlant.commonNamesLabel")}
            placeholder={props.t("seller.products.newPlant.commonNamesPlaceholder")}
            value={props.enCommonNames}
            onInput={props.onEnCommonNamesChange}
          />
          <InputField
            id="en-origin"
            label={props.t("seller.products.newPlant.originLabel")}
            placeholder={props.t("seller.products.newPlant.originPlaceholder")}
            value={props.enOrigin}
            onInput={props.onEnOriginChange}
          />
          <InputField
            id="en-soil-type"
            label={props.t("seller.products.newPlant.soilTypeLabel")}
            placeholder={props.t("seller.products.newPlant.soilTypePlaceholder")}
            value={props.enSoilType}
            onInput={props.onEnSoilTypeChange}
          />
          <InputField
            id="en-toxicity"
            label={props.t("seller.products.newPlant.toxicityInfoLabel")}
            placeholder={props.t("seller.products.newPlant.toxicityInfoPlaceholder")}
            value={props.enToxicityInfo}
            onInput={props.onEnToxicityInfoChange}
            hint={props.t("seller.products.newPlant.toxicityInfoHint")}
          />
        </div>

        {/* BN Details */}
        <div class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">🇧🇩</span>
            <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">বাংলা</h4>
          </div>
          <InputField
            id="bn-common-names"
            label={props.t("seller.products.newPlant.commonNamesLabel")}
            placeholder={props.t("seller.products.newPlant.commonNamesBnPlaceholder")}
            value={props.bnCommonNames}
            onInput={props.onBnCommonNamesChange}
            dir="auto"
          />
          <InputField
            id="bn-origin"
            label={props.t("seller.products.newPlant.originLabel")}
            placeholder={props.t("seller.products.newPlant.originBnPlaceholder")}
            value={props.bnOrigin}
            onInput={props.onBnOriginChange}
            dir="auto"
          />
          <InputField
            id="bn-soil-type"
            label={props.t("seller.products.newPlant.soilTypeLabel")}
            placeholder={props.t("seller.products.newPlant.soilTypeBnPlaceholder")}
            value={props.bnSoilType}
            onInput={props.onBnSoilTypeChange}
            dir="auto"
          />
          <InputField
            id="bn-toxicity"
            label={props.t("seller.products.newPlant.toxicityInfoLabel")}
            placeholder={props.t("seller.products.newPlant.toxicityInfoBnPlaceholder")}
            value={props.bnToxicityInfo}
            onInput={props.onBnToxicityInfoChange}
            dir="auto"
          />
        </div>
      </div>
    </div>
  );
}
