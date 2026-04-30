import { createEffect } from "solid-js";
import { Select, type SelectOption } from "~/components/ui/Select";
import { TagMultiSelect, type TagGroupOption } from "~/components/ui/TagMultiSelect";

export function Step2CategoryTags(props: {
  categoryId: string;
  onCategoryIdChange: (v: string) => void;
  tagIds: string[];
  onTagToggle: (tagId: string) => void;
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
          {props.t("seller.products.newPlant.categoryTagsDescription")}
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
    </div>
  );
}
