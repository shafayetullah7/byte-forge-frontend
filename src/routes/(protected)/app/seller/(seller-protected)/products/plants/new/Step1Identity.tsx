import { createEffect, Show, createMemo } from "solid-js";
import { CheckCircleIcon } from "~/components/icons";
import { Select, type SelectOption } from "~/components/ui/Select";
import { ImageUpload } from "~/components/ui/ImageUpload";
import { Input, Textarea } from "~/components/ui";

function InlineFieldset(props: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: any;
}) {
  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {props.label}
        {props.required && <span class="text-red-500 ml-1">*</span>}
      </label>
      {props.children}
      <Show when={props.error}>
        <p class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{props.error}</p>
      </Show>
      <Show when={props.hint}>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{props.hint}</p>
      </Show>
    </div>
  );
}

export function Step1Identity(props: {
  thumbnailUpload: {
    preview: () => string | null;
    isUploading: () => boolean;
    isDeleting: () => boolean;
    upload: (file: File) => void;
    deleteMedia: () => void;
  };
  status: string;
  onStatusChange: (v: string) => void;
  slug: string;
  onSlugChange: (v: string) => void;
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
  scientificName: string;
  onScientificNameChange: (v: string) => void;
  errors: Record<string, string>;
  t: (key: string) => string;
  onWarningChange: (hasWarning: boolean, missingFields: string[]) => void;
}) {
  const hasEnglishContent = createMemo(
    () => props.enName.trim().length > 0
  );

  const hasBengaliContent = createMemo(
    () => props.bnName.trim().length > 0
  );

  createEffect(() => {
    const missing: string[] = [];
    if (!props.thumbnailUpload.preview()) {
      missing.push(props.t("seller.products.newPlant.thumbnailRequired"));
    }
    if (!props.enName.trim()) missing.push(props.t("seller.products.newPlant.nameRequired"));
    props.onWarningChange(missing.length > 0, missing);
  });

  return (
    <div class="space-y-6">
      {/* Thumbnail + Metadata Row */}
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Thumbnail — 3 cols */}
        <div class="lg:col-span-3">
          <div class="h-full min-h-[280px]">
            <ImageUpload
              preview={props.thumbnailUpload.preview()}
              isUploading={props.thumbnailUpload.isUploading()}
              isDeleting={props.thumbnailUpload.isDeleting()}
              onFileSelect={props.thumbnailUpload.upload}
              onDelete={props.thumbnailUpload.deleteMedia}
              label={props.t("seller.products.newPlant.thumbnailLabel")}
              description={props.t("seller.products.newPlant.thumbnailDesc")}
              required
              uploadAreaHeight="160px"
              previewSize="w-28 h-28"
            />
            <Show when={props.errors["thumbnail"]}>
              <p class="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                {props.errors["thumbnail"]}
              </p>
            </Show>
          </div>
        </div>

        {/* Status + Slug + Scientific Name — 2 cols */}
        <div class="lg:col-span-2 space-y-4">
          <Select
            label={props.t("seller.products.newPlant.statusLabel")}
            options={[
              { value: "DRAFT", label: props.t("seller.products.newPlant.statusDraft") },
              { value: "ACTIVE", label: props.t("seller.products.newPlant.statusActive") },
              { value: "ARCHIVED", label: props.t("seller.products.newPlant.statusArchived") },
            ]}
            value={props.status}
            onChange={(e) => props.onStatusChange(e.currentTarget.value)}
          />

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {props.t("seller.products.newPlant.urlSlugLabel")}
              <span class="text-gray-400 dark:text-gray-500 ml-1">({props.t("common.optional")})</span>
            </label>
            <div class="flex rounded-lg">
              <span class="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-forest-700/70 dark:text-gray-400 text-xs">
                byteforge.com/plants/
              </span>
              <input
                type="text"
                value={props.slug}
                onInput={(e) => props.onSlugChange((e.currentTarget as HTMLInputElement).value)}
                placeholder={props.t("seller.products.newPlant.urlSlugPlaceholder")}
                class={`flex-1 min-w-0 block w-full px-4 py-2.5 rounded-r-lg border-2 border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-900/30 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm ${
                  props.errors["slug"] ? "border-red-500 dark:border-red-400" : ""
                }`}
              />
            </div>
            <Show when={props.errors["slug"]}>
              <p class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                {props.errors["slug"]}
              </p>
            </Show>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {props.t("seller.products.newPlant.slugHint")}
            </p>
          </div>

          <InlineFieldset
            label={props.t("seller.products.newPlant.scientificNameLabel")}
            hint={props.t("seller.products.newPlant.scientificNameHint")}
          >
            <Input
              placeholder={props.t("seller.products.newPlant.scientificNamePlaceholder")}
              value={props.scientificName}
              onInput={(e) => props.onScientificNameChange((e.currentTarget as HTMLInputElement).value)}
            />
          </InlineFieldset>
        </div>
      </div>

      {/* Bilingual Descriptions */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* English Column */}
        <div class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">🇬🇧</span>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">{props.t("seller.products.newPlant.englishLabel")}</h4>
            <div class="ml-auto">
              <Show when={hasEnglishContent()}>
                <CheckCircleIcon class="w-5 h-5 text-forest-500" />
              </Show>
            </div>
          </div>

          <InlineFieldset
            label={props.t("seller.products.newPlant.plantNameLabel")}
            required
            error={props.errors["en.name"]}
            hint={props.t("seller.products.newPlant.plantNameHint")}
          >
            <Input
              placeholder={props.t("seller.products.newPlant.plantNamePlaceholder")}
              value={props.enName}
              onInput={(e) => props.onEnNameChange((e.currentTarget as HTMLInputElement).value)}
              error={props.errors["en.name"]}
            />
          </InlineFieldset>

          <InlineFieldset
            label={props.t("seller.products.newPlant.shortSummaryLabel")}
            error={props.errors["en.shortDescription"]}
            hint={props.t("seller.products.newPlant.shortSummaryHint")}
          >
            <Textarea
              placeholder={props.t("seller.products.newPlant.shortSummaryPlaceholder")}
              value={props.enShortDesc}
              onInput={(e) => props.onEnShortDescChange((e.currentTarget as HTMLTextAreaElement).value)}
              error={props.errors["en.shortDescription"]}
              rows={2}
            />
          </InlineFieldset>

          <InlineFieldset
            label={props.t("seller.products.newPlant.detailedDescriptionLabel")}
            hint={props.t("seller.products.newPlant.descriptionHint")}
          >
            <Textarea
              placeholder={props.t("seller.products.newPlant.descriptionPlaceholder")}
              value={props.enDescription}
              onInput={(e) => props.onEnDescriptionChange((e.currentTarget as HTMLTextAreaElement).value)}
              rows={5}
            />
          </InlineFieldset>
        </div>

        {/* Bengali Column */}
        <div class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">🇧🇩</span>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">{props.t("seller.products.newPlant.bengaliLabel")}</h4>
            <span class="text-xs text-gray-400 dark:text-gray-500">({props.t("common.optional")})</span>
            <div class="ml-auto">
              <Show when={hasBengaliContent()}>
                <CheckCircleIcon class="w-5 h-5 text-forest-500" />
              </Show>
            </div>
          </div>

          <InlineFieldset
            label={props.t("seller.products.newPlant.plantNameLabel")}
            error={props.errors["bn.name"]}
            hint={props.t("seller.products.newPlant.plantNameHint")}
          >
            <Input
              placeholder={props.t("seller.products.newPlant.plantNameBnPlaceholder")}
              value={props.bnName}
              onInput={(e) => props.onBnNameChange((e.currentTarget as HTMLInputElement).value)}
              error={props.errors["bn.name"]}
            />
          </InlineFieldset>

          <InlineFieldset
            label={props.t("seller.products.newPlant.shortSummaryLabel")}
            error={props.errors["bn.shortDescription"]}
            hint={props.t("seller.products.newPlant.shortSummaryHint")}
          >
            <Textarea
              placeholder={props.t("seller.products.newPlant.shortSummaryBnPlaceholder")}
              value={props.bnShortDesc}
              onInput={(e) => props.onBnShortDescChange((e.currentTarget as HTMLTextAreaElement).value)}
              error={props.errors["bn.shortDescription"]}
              rows={2}
            />
          </InlineFieldset>

          <InlineFieldset
            label={props.t("seller.products.newPlant.detailedDescriptionLabel")}
            hint={props.t("seller.products.newPlant.descriptionHint")}
          >
            <Textarea
              placeholder={props.t("seller.products.newPlant.descriptionBnPlaceholder")}
              value={props.bnDescription}
              onInput={(e) => props.onBnDescriptionChange((e.currentTarget as HTMLTextAreaElement).value)}
              rows={5}
            />
          </InlineFieldset>
        </div>
      </div>
    </div>
  );
}
