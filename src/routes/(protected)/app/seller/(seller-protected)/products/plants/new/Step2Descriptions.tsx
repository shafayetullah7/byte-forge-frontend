import { createEffect, Show, createMemo } from "solid-js";
import { CheckCircleIcon } from "~/components/icons";

function InputField(props: {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onInput: (val: string) => void;
  error?: string;
  textarea?: boolean;
  rows?: number;
  dir?: "auto" | "ltr" | "rtl";
  hint?: string;
  maxLen?: number;
}) {
  return (
    <div>
      <label for={props.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {props.label}
        {props.required && <span class="text-red-500 ml-1">*</span>}
      </label>
      {props.textarea ? (
        <textarea
          id={props.id}
          value={props.value}
          onInput={(e) => props.onInput((e.target as HTMLTextAreaElement).value)}
          placeholder={props.placeholder}
          rows={props.rows || 3}
          dir={props.dir}
          maxlength={props.maxLen || undefined}
          class={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors text-sm resize-none ${
            props.error
              ? "border-red-500 dark:border-red-400"
              : "border-cream-200 dark:border-forest-600"
          }`}
        />
      ) : (
        <input
          type="text"
          id={props.id}
          value={props.value}
          onInput={(e) => props.onInput((e.target as HTMLInputElement).value)}
          placeholder={props.placeholder}
          dir={props.dir}
          maxlength={props.maxLen || undefined}
          class={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors text-sm ${
            props.error
              ? "border-red-500 dark:border-red-400"
              : "border-cream-200 dark:border-forest-600"
          }`}
        />
      )}
      <Show when={props.error}>
        <p class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
          {props.error}
        </p>
      </Show>
      <Show when={props.hint}>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{props.hint}</p>
      </Show>
      <Show when={props.maxLen && props.textarea}>
        <p class="mt-1 text-xs text-gray-400 dark:text-gray-500 text-right">
          {props.value.length}/{props.maxLen}
        </p>
      </Show>
    </div>
  );
}

export function Step2Descriptions(props: {
  enName: string;
  onEnNameChange: (v: string) => void;
  enShortDesc: string;
  onEnShortDescChange: (v: string) => void;
  enDescription: string;
  onEnDescriptionChange: (v: string) => void;
  bnName: string;
  onBnNameChange: (v: string) => void;
  bnShortDesc: string;
  onBnShortDescChange: (v: string) => void;
  bnDescription: string;
  onBnDescriptionChange: (v: string) => void;
  errors: Record<string, string>;
  t: (key: string) => string;
  onWarningChange: (hasWarning: boolean, missingFields: string[]) => void;
}) {
  const hasEnglishContent = createMemo(
    () => props.enName.trim().length > 0 && props.enDescription.trim().length >= 50
  );

  const hasBengaliContent = createMemo(
    () => props.bnName.trim().length > 0 && props.bnDescription.trim().length >= 50
  );

  createEffect(() => {
    const missing: string[] = [];
    if (!props.enName.trim()) missing.push(props.t("seller.products.newPlant.nameRequired"));
    if (!props.enDescription.trim() || props.enDescription.trim().length < 50) {
      missing.push(props.t("seller.products.newPlant.descriptionTooShort"));
    }
    if (!props.bnName.trim()) missing.push(props.t("seller.products.newPlant.nameRequired"));
    if (!props.bnDescription.trim() || props.bnDescription.trim().length < 50) {
      missing.push(props.t("seller.products.newPlant.descriptionTooShort"));
    }
    props.onWarningChange(missing.length > 0, missing);
  });

  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* English Column */}
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-lg">🇬🇧</span>
          <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">English</h4>
          <div class="ml-auto">
            <Show when={hasEnglishContent()}>
              <CheckCircleIcon class="w-5 h-5 text-forest-500" />
            </Show>
          </div>
        </div>

        <InputField
          id="en-name"
          label={props.t("seller.products.newPlant.plantNameLabel")}
          required
          placeholder={props.t("seller.products.newPlant.plantNamePlaceholder")}
          value={props.enName}
          onInput={props.onEnNameChange}
          error={props.errors["en.name"]}
          maxLen={255}
          hint={props.t("seller.products.newPlant.plantNameHint")}
        />

        <InputField
          id="en-short-desc"
          label={props.t("seller.products.newPlant.shortSummaryLabel")}
          placeholder={props.t("seller.products.newPlant.shortSummaryPlaceholder")}
          value={props.enShortDesc}
          onInput={props.onEnShortDescChange}
          error={props.errors["en.shortDescription"]}
          maxLen={500}
          textarea
          rows={2}
          hint={props.t("seller.products.newPlant.shortSummaryHint")}
        />

        <InputField
          id="en-description"
          label={props.t("seller.products.newPlant.detailedDescriptionLabel")}
          required
          placeholder={props.t("seller.products.newPlant.descriptionPlaceholder")}
          value={props.enDescription}
          onInput={props.onEnDescriptionChange}
          error={props.errors["en.description"]}
          textarea
          rows={5}
          hint={props.t("seller.products.newPlant.descriptionHint")}
        />
      </div>

      {/* Bengali Column */}
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-lg">🇧🇩</span>
          <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">বাংলা</h4>
          <div class="ml-auto">
            <Show when={hasBengaliContent()}>
              <CheckCircleIcon class="w-5 h-5 text-forest-500" />
            </Show>
          </div>
        </div>

        <InputField
          id="bn-name"
          label={props.t("seller.products.newPlant.plantNameLabel")}
          required
          placeholder={props.t("seller.products.newPlant.plantNameBnPlaceholder")}
          value={props.bnName}
          onInput={props.onBnNameChange}
          error={props.errors["bn.name"]}
          dir="auto"
          maxLen={255}
          hint={props.t("seller.products.newPlant.plantNameHint")}
        />

        <InputField
          id="bn-short-desc"
          label={props.t("seller.products.newPlant.shortSummaryLabel")}
          placeholder={props.t("seller.products.newPlant.shortSummaryBnPlaceholder")}
          value={props.bnShortDesc}
          onInput={props.onBnShortDescChange}
          error={props.errors["bn.shortDescription"]}
          dir="auto"
          maxLen={500}
          textarea
          rows={2}
          hint={props.t("seller.products.newPlant.shortSummaryHint")}
        />

        <InputField
          id="bn-description"
          label={props.t("seller.products.newPlant.detailedDescriptionLabel")}
          required
          placeholder={props.t("seller.products.newPlant.descriptionBnPlaceholder")}
          value={props.bnDescription}
          onInput={props.onBnDescriptionChange}
          error={props.errors["bn.description"]}
          dir="auto"
          textarea
          rows={5}
          hint={props.t("seller.products.newPlant.descriptionHint")}
        />
      </div>
    </div>
  );
}
