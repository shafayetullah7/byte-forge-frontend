import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import { XIcon } from "~/components/icons";
import type { CategoryTree } from "~/lib/api/endpoints/public/categories.api";
import { CARE_OPTIONS, LIGHT_OPTIONS, WATERING_OPTIONS, HUMIDITY_OPTIONS, GROWTH_OPTIONS } from "../../routes/(app)/plants/constants";

function findCategoryName(tree: CategoryTree[], id: string): string | undefined {
  for (const node of tree) {
    if (node.id === id) return node.name;
    if (node.children) {
      const found = findCategoryName(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

export function ActiveFilters(props: {
  hasActiveFilters: () => boolean;
  debouncedSearch: () => string;
  setSearchQuery: (v: string) => void;
  setDebouncedSearch: (v: string) => void;
  categories: () => CategoryTree[] | undefined;
  selectedCategoryId: () => string;
  setSelectedCategoryId: (v: string) => void;
  tags: () => { id: string; name: string; groupId: string; groupName: string }[];
  selectedTagIds: () => Set<string>;
  toggleTag: (id: string) => void;
  careDifficulty: () => string;
  setCareDifficulty: (v: string) => void;
  lightRequirement: () => string;
  setLightRequirement: (v: string) => void;
  wateringFrequency: () => string;
  setWateringFrequency: (v: string) => void;
  humidityLevel: () => string;
  setHumidityLevel: (v: string) => void;
  growthRate: () => string;
  setGrowthRate: (v: string) => void;
  inStockOnly: () => boolean;
  setInStockOnly: (v: boolean) => void;
}) {
  const { t } = useI18n();

  const selectedCategoryName = () => {
    const tree = props.categories();
    if (!tree) return "";
    return findCategoryName(tree, props.selectedCategoryId()) ?? "";
  };

  const getLabel = (options: { value: string; labelKey: string }[], value: string) => {
    const opt = options.find((o) => o.value === value);
    return opt ? t(opt.labelKey as any) : "";
  };

  return (
    <Show when={props.hasActiveFilters()}>
      <div class="flex flex-wrap gap-2 mb-4">
        <FilterChip
          visible={!!props.debouncedSearch()}
          label={`${t("common.search")}: "${props.debouncedSearch()}"`}
          onRemove={() => { props.setSearchQuery(""); props.setDebouncedSearch(""); }}
        />
        <FilterChip
          visible={!!props.selectedCategoryId()}
          label={selectedCategoryName()}
          onRemove={() => props.setSelectedCategoryId("")}
        />
        <For each={[...props.selectedTagIds()]}>
          {(tagId: string) => (
            <FilterChip
              visible={true}
              label={props.tags().find((tag) => tag.id === tagId)?.name ?? ""}
              onRemove={() => props.toggleTag(tagId)}
            />
          )}
        </For>
        <FilterChip
          visible={!!props.careDifficulty()}
          label={getLabel(CARE_OPTIONS, props.careDifficulty())}
          onRemove={() => props.setCareDifficulty("")}
        />
        <FilterChip
          visible={!!props.lightRequirement()}
          label={getLabel(LIGHT_OPTIONS, props.lightRequirement())}
          onRemove={() => props.setLightRequirement("")}
        />
        <FilterChip
          visible={!!props.wateringFrequency()}
          label={getLabel(WATERING_OPTIONS, props.wateringFrequency())}
          onRemove={() => props.setWateringFrequency("")}
        />
        <FilterChip
          visible={!!props.humidityLevel()}
          label={getLabel(HUMIDITY_OPTIONS, props.humidityLevel())}
          onRemove={() => props.setHumidityLevel("")}
        />
        <FilterChip
          visible={!!props.growthRate()}
          label={getLabel(GROWTH_OPTIONS, props.growthRate())}
          onRemove={() => props.setGrowthRate("")}
        />
        <FilterChip
          visible={props.inStockOnly()}
          label={t("public.plants.filters.inStockOnly")}
          onRemove={() => props.setInStockOnly(false)}
        />
      </div>
    </Show>
  );
}

function FilterChip(props: { visible: boolean; label: string; onRemove: () => void }) {
  return (
    <Show when={props.visible}>
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border border-forest-200 dark:border-forest-700">
        {props.label}
        <button
          onClick={props.onRemove}
          class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors"
        >
          <XIcon class="w-3 h-3" />
        </button>
      </span>
    </Show>
  );
}
