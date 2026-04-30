import { createEffect, Show } from "solid-js";
import { Select, type SelectOption } from "~/components/ui/Select";
import { TagMultiSelect, type TagGroupOption } from "~/components/ui/TagMultiSelect";

function InputField(props: {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onInput: (val: string) => void;
  error?: string;
  hint?: string;
  dir?: "auto" | "ltr" | "rtl";
}) {
  return (
    <div>
      <label for={props.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {props.label}
        {props.required && <span class="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        id={props.id}
        value={props.value}
        onInput={(e) => props.onInput((e.target as HTMLInputElement).value)}
        placeholder={props.placeholder}
        dir={props.dir}
        class={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors text-sm ${
          props.error
            ? "border-red-500 dark:border-red-400"
            : "border-cream-200 dark:border-forest-600"
        }`}
      />
      <Show when={props.error}>
        <p class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
          {props.error}
        </p>
      </Show>
      <Show when={props.hint}>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{props.hint}</p>
      </Show>
    </div>
  );
}

export function Step3Classification(props: {
  categoryId: string;
  onCategoryIdChange: (v: string) => void;
  tagIds: string[];
  onTagToggle: (tagId: string) => void;
  scientificName: string;
  onScientificNameChange: (v: string) => void;
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
  errors: Record<string, string>;
  categoryOptions: SelectOption[];
  tagGroups: TagGroupOption[];
  t: (key: string) => string;
  onWarningChange: (hasWarning: boolean, missingFields: string[]) => void;
}) {
  createEffect(() => {
    const missing: string[] = [];
    if (!props.categoryId.trim()) missing.push(props.t("seller.products.newPlant.categoryRequired"));
    props.onWarningChange(missing.length > 0, missing);
  });

  return (
    <div class="space-y-6">
      {/* Description */}
      <div class="bg-cream-50 dark:bg-forest-800/50 rounded-lg p-4 border border-cream-200 dark:border-forest-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {props.t("seller.products.newPlant.classificationDescription")}
        </p>
      </div>

      {/* Category */}
      <div>
        <Select
          label={props.t("seller.products.newPlant.categoryLabel")}
          options={props.categoryOptions}
          value={props.categoryId}
          onChange={(e) => props.onCategoryIdChange(e.currentTarget.value)}
          placeholder={props.t("seller.products.newPlant.categoryPlaceholder")}
          error={props.errors["categoryId"]}
          required
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {props.t("seller.products.newPlant.categoryHint")}
        </p>
      </div>

      {/* Tags */}
      <div>
        <p class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {props.t("seller.products.newPlant.tagsLabel")}
          <span class="text-gray-400 ml-1">({props.t("common.optional")})</span>
        </p>
        <TagMultiSelect
          selectedTags={props.tagIds}
          onToggle={props.onTagToggle}
          groups={props.tagGroups}
          placeholder={props.t("seller.products.newPlant.tagsPlaceholder")}
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {props.t("seller.products.newPlant.tagsHint")}
        </p>
      </div>

      {/* Scientific Name */}
      <InputField
        id="scientific-name"
        label={props.t("seller.products.newPlant.scientificNameLabel")}
        placeholder={props.t("seller.products.newPlant.scientificNamePlaceholder")}
        value={props.scientificName}
        onInput={props.onScientificNameChange}
        hint={props.t("seller.products.newPlant.scientificNameHint")}
      />

      {/* Localized Plant Details */}
      <div class="border-t border-cream-200 dark:border-forest-700 pt-4">
        <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-4">
          {props.t("seller.products.newPlant.localizedDetails")}
        </h4>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* EN Details */}
          <div class="space-y-3">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">🇬🇧</span>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">English</p>
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
          <div class="space-y-3">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">🇧🇩</span>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">বাংলা</p>
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
    </div>
  );
}
