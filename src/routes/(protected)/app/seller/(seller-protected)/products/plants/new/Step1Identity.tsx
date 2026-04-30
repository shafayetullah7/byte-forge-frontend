import { createEffect, Show } from "solid-js";
import { Select, type SelectOption } from "~/components/ui/Select";
import { ImageUpload } from "~/components/ui/ImageUpload";

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
  errors: Record<string, string>;
  t: (key: string) => string;
  onWarningChange: (hasWarning: boolean, missingFields: string[]) => void;
}) {
  createEffect(() => {
    const missing: string[] = [];
    if (!props.thumbnailUpload.preview()) {
      missing.push(props.t("seller.products.newPlant.thumbnailRequired"));
    }
    props.onWarningChange(missing.length > 0, missing);
  });

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Thumbnail Upload */}
      <div>
        <ImageUpload
          preview={props.thumbnailUpload.preview()}
          isUploading={props.thumbnailUpload.isUploading()}
          isDeleting={props.thumbnailUpload.isDeleting()}
          onFileSelect={props.thumbnailUpload.upload}
          onDelete={props.thumbnailUpload.deleteMedia}
          label={props.t("seller.products.newPlant.thumbnailLabel")}
          description={props.t("seller.products.newPlant.thumbnailDesc")}
          required
        />
        <Show when={props.errors["thumbnail"]}>
          <p class="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
            {props.errors["thumbnail"]}
          </p>
        </Show>
      </div>

      {/* Status & Slug */}
      <div class="space-y-4">
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
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {props.t("seller.products.newPlant.statusHint")}
        </p>

        <div class="bg-cream-50 dark:bg-forest-800/50 rounded-lg p-4 border border-cream-200 dark:border-forest-700">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            URL Slug
            <span class="text-gray-400 ml-1">({props.t("common.optional")})</span>
          </label>
          <div class="flex rounded-lg">
            <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-forest-700/70 dark:text-gray-400 text-xs">
              byteforge.com/plants/
            </span>
            <input
              type="text"
              value={props.slug}
              onInput={(e) => props.onSlugChange((e.currentTarget as HTMLInputElement).value)}
              placeholder="monstera-deliciosa"
              class={`flex-1 min-w-0 block w-full px-3 py-2 rounded-r-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm ${
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
      </div>
    </div>
  );
}
