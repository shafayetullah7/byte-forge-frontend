import { createEffect, Show, createMemo } from "solid-js";
import { CheckCircleIcon } from "~/components/icons";
import { getPlantSlugPrefix } from "~/lib/seo/meta";
import { Select } from "~/components/ui/Select";
import { ImageUpload } from "~/components/ui/ImageUpload";
import { FieldGroup, Input, Textarea, fieldControlClass, fieldHint } from "~/components/ui";

export function IdentityFields(props: {
  thumbnailUpload: {
    preview: () => string | null;
    isUploading: () => boolean;
    isDeleting: () => boolean;
    upload: (file: File) => void;
    deleteMedia: () => void;
  };
  thumbnailPreview: () => string | null;
  hasThumbnail: () => boolean;
  allowThumbnailDelete?: boolean;
  isEditMode?: boolean;
  hideArchivedStatus?: boolean;
  /** Hide status control entirely (e.g. overview edit uses quick actions). */
  hideStatus?: boolean;
  originalSlug?: string;
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
    if (!props.hasThumbnail()) {
      missing.push(props.t("seller.products.newPlant.thumbnailRequired"));
    }
    if (!props.enName.trim()) missing.push(props.t("seller.products.newPlant.nameRequired"));
    else if (props.enName.length < 3) missing.push(props.t("seller.products.newPlant.nameTooShort"));
    else if (props.enName.length > 255) missing.push(props.t("seller.products.newPlant.nameTooLong"));
    if (props.enShortDesc.length > 500) missing.push(props.t("seller.products.newPlant.shortDescriptionTooLong"));
    if (props.bnName.trim() && props.bnName.length < 3) missing.push(props.t("seller.products.newPlant.nameTooShort"));
    else if (props.bnName.trim() && props.bnName.length > 255) missing.push(props.t("seller.products.newPlant.nameTooLong"));
    if (props.bnShortDesc.length > 500) missing.push(props.t("seller.products.newPlant.shortDescriptionTooLong"));
    const slug = props.slug.trim();
    if (slug) {
      if (slug.length < 3) missing.push(props.t("seller.products.newPlant.slugTooShort"));
      else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) missing.push(props.t("seller.products.newPlant.slugInvalid"));
    }
    props.onWarningChange(missing.length > 0, missing);
  });

  return (
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3">
          <div class="h-full min-h-[280px]">
            <ImageUpload
              preview={props.thumbnailPreview()}
              isUploading={props.thumbnailUpload.isUploading()}
              isDeleting={props.thumbnailUpload.isDeleting()}
              onFileSelect={props.thumbnailUpload.upload}
              onDelete={props.allowThumbnailDelete !== false ? props.thumbnailUpload.deleteMedia : undefined}
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

        <div class="lg:col-span-2 space-y-4">
          <Show when={!props.hideStatus}>
          <Show
            when={!props.hideArchivedStatus}
            fallback={
              <div class="rounded-lg border border-cream-200 dark:border-forest-700 bg-cream-50 dark:bg-forest-800/40 px-4 py-3">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {props.t("seller.products.newPlant.statusLabel")}
                </p>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {props.t("seller.products.newPlant.statusCreateHint")}
                </p>
              </div>
            }
          >
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
            <p class={`${fieldHint} -mt-2`}>
              {props.t("seller.products.newPlant.statusHint")}
            </p>
          </Show>
          </Show>

          <FieldGroup
            label={props.t("seller.products.newPlant.urlSlugLabel")}
            requirement="optional"
            error={props.errors["slug"]}
            hint={props.t("seller.products.newPlant.slugHint")}
          >
            <div class="flex min-w-0">
              <span class="inline-flex items-center px-4 py-2.5 rounded-l-lg border-2 border-r-0 border-cream-200 dark:border-forest-700 bg-cream-50 dark:bg-forest-900/50 text-sm text-gray-500 dark:text-gray-400 shrink-0">
                {getPlantSlugPrefix()}
              </span>
              <input
                type="text"
                value={props.slug}
                onInput={(e) => props.onSlugChange(e.currentTarget.value)}
                placeholder={props.t("seller.products.newPlant.urlSlugPlaceholder")}
                class={fieldControlClass({
                  error: !!props.errors["slug"],
                  class: "rounded-l-none flex-1 min-w-0",
                })}
              />
            </div>
          </FieldGroup>
          <Show when={props.isEditMode && props.originalSlug && props.slug.trim() !== props.originalSlug}>
            <div class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-3 py-2">
              <p class="text-xs text-amber-800 dark:text-amber-200">
                {props.t("seller.products.plantSection.slugChangeWarning")}
              </p>
            </div>
          </Show>

          <FieldGroup
            label={props.t("seller.products.newPlant.scientificNameLabel")}
            requirement="optional"
            hint={props.t("seller.products.newPlant.scientificNameHint")}
          >
            <Input
              placeholder={props.t("seller.products.newPlant.scientificNamePlaceholder")}
              value={props.scientificName}
              onInput={(e) => props.onScientificNameChange(e.currentTarget.value)}
            />
          </FieldGroup>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <FieldGroup
            label={props.t("seller.products.newPlant.plantNameLabel")}
            requirement="required"
            error={props.errors["en.name"]}
            hint={props.t("seller.products.newPlant.plantNameHint")}
          >
            <Input
              placeholder={props.t("seller.products.newPlant.plantNamePlaceholder")}
              value={props.enName}
              onInput={(e) => props.onEnNameChange(e.currentTarget.value)}
            />
          </FieldGroup>

          <FieldGroup
            label={props.t("seller.products.newPlant.shortSummaryLabel")}
            requirement="optional"
            error={props.errors["en.shortDescription"]}
            hint={props.t("seller.products.newPlant.shortSummaryHint")}
          >
            <Textarea
              placeholder={props.t("seller.products.newPlant.shortSummaryPlaceholder")}
              value={props.enShortDesc}
              onInput={(e) => props.onEnShortDescChange(e.currentTarget.value)}
              rows={2}
            />
          </FieldGroup>

          <FieldGroup
            label={props.t("seller.products.newPlant.detailedDescriptionLabel")}
            requirement="optional"
            hint={props.t("seller.products.newPlant.descriptionHint")}
          >
            <Textarea
              placeholder={props.t("seller.products.newPlant.descriptionPlaceholder")}
              value={props.enDescription}
              onInput={(e) => props.onEnDescriptionChange(e.currentTarget.value)}
              rows={5}
            />
          </FieldGroup>
        </div>

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

          <FieldGroup
            label={props.t("seller.products.newPlant.plantNameLabel")}
            requirement="optional"
            error={props.errors["bn.name"]}
            hint={props.t("seller.products.newPlant.plantNameHint")}
          >
            <Input
              placeholder={props.t("seller.products.newPlant.plantNameBnPlaceholder")}
              value={props.bnName}
              onInput={(e) => props.onBnNameChange(e.currentTarget.value)}
            />
          </FieldGroup>

          <FieldGroup
            label={props.t("seller.products.newPlant.shortSummaryLabel")}
            requirement="optional"
            error={props.errors["bn.shortDescription"]}
            hint={props.t("seller.products.newPlant.shortSummaryHint")}
          >
            <Textarea
              placeholder={props.t("seller.products.newPlant.shortSummaryBnPlaceholder")}
              value={props.bnShortDesc}
              onInput={(e) => props.onBnShortDescChange(e.currentTarget.value)}
              rows={2}
            />
          </FieldGroup>

          <FieldGroup
            label={props.t("seller.products.newPlant.detailedDescriptionLabel")}
            requirement="optional"
            hint={props.t("seller.products.newPlant.descriptionHint")}
          >
            <Textarea
              placeholder={props.t("seller.products.newPlant.descriptionBnPlaceholder")}
              value={props.bnDescription}
              onInput={(e) => props.onBnDescriptionChange(e.currentTarget.value)}
              rows={5}
            />
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}
