import { createMemo, For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import type { CategoryTree } from "~/lib/api/endpoints/public/categories.api";
import { CARE_OPTIONS, LIGHT_OPTIONS, WATERING_OPTIONS, HUMIDITY_OPTIONS, GROWTH_OPTIONS } from "./constants";

export function FilterSection(props: {
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
  minPrice: () => string;
  setMinPrice: (v: string) => void;
  maxPrice: () => string;
  setMaxPrice: (v: string) => void;
  inStockOnly: () => boolean;
  setInStockOnly: (v: boolean) => void;
  hasActiveFilters: () => boolean;
  clearFilters: () => void;
  setCurrentPage: (v: number) => void;
}) {
  const { t } = useI18n();
  const setCategory = (v: string) => { props.setSelectedCategoryId(v); props.setCurrentPage(1); };
  const setCare = (v: string) => { props.setCareDifficulty(v); props.setCurrentPage(1); };
  const setLight = (v: string) => { props.setLightRequirement(v); props.setCurrentPage(1); };
  const setWater = (v: string) => { props.setWateringFrequency(v); props.setCurrentPage(1); };
  const setHum = (v: string) => { props.setHumidityLevel(v); props.setCurrentPage(1); };
  const setGrowth = (v: string) => { props.setGrowthRate(v); props.setCurrentPage(1); };
  const setMin = (v: string) => { props.setMinPrice(v); props.setCurrentPage(1); };
  const setMax = (v: string) => { props.setMaxPrice(v); props.setCurrentPage(1); };
  const setStock = (v: boolean) => { props.setInStockOnly(v); props.setCurrentPage(1); };

  const groupedTags = createMemo(() => {
    const tags = props.tags();
    const groups = new Map<string, { id: string; name: string; tags: typeof tags }>();
    for (const tag of tags) {
      if (!groups.has(tag.groupId)) {
        groups.set(tag.groupId, { id: tag.groupId, name: tag.groupName, tags: [] });
      }
      groups.get(tag.groupId)!.tags.push(tag);
    }
    return [...groups.values()];
  });

  return (
    <div class="space-y-5">
      <Show when={props.hasActiveFilters()}>
        <button
          onClick={props.clearFilters}
          class="w-full text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium py-1"
        >
          {t("public.plants.filters.clearAll")}
        </button>
      </Show>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("public.plants.filters.priceRange")}
        </label>
        <div class="flex items-center gap-2">
          <input
            type="number" placeholder={t("public.plants.filters.min")} value={props.minPrice()} onInput={(e) => setMin(e.currentTarget.value)} min="0"
            class="w-full px-3 py-2 rounded-lg border-2 border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-900/30 text-sm transition-standard focus-ring-flat"
          />
          <span class="text-gray-400 flex-shrink-0">—</span>
          <input
            type="number" placeholder={t("public.plants.filters.max")} value={props.maxPrice()} onInput={(e) => setMax(e.currentTarget.value)} min="0"
            class="w-full px-3 py-2 rounded-lg border-2 border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-900/30 text-sm transition-standard focus-ring-flat"
          />
        </div>
      </div>

      <div>
        <label class="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox" checked={props.inStockOnly()} onChange={(e) => setStock(e.currentTarget.checked)}
            class="w-4 h-4 rounded border-gray-300 text-forest-600 focus:ring-forest-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">{t("public.plants.filters.inStockOnly")}</span>
        </label>
      </div>

      <Show when={(props.categories()?.length ?? 0) > 0}>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("public.plants.filters.category")}
          </label>
          <div class="space-y-1">
            <RadioOption label={t("public.plants.filters.allCategories")} checked={props.selectedCategoryId() === ""} onChange={() => setCategory("")} />
            <For each={props.categories() ?? []}>
              {(cat) => (
                <CategoryNode
                  node={cat}
                  depth={0}
                  selectedId={props.selectedCategoryId}
                  onSelect={setCategory}
                />
              )}
            </For>
          </div>
        </div>
      </Show>

      <Show when={groupedTags().length > 0}>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("public.plants.filters.tags")}
          </label>
          <div class="space-y-3">
            <For each={groupedTags()}>
              {(group) => (
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{group.name}</p>
                  <div class="space-y-1">
                    <For each={group.tags}>
                      {(tag) => (
                        <label class="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={props.selectedTagIds().has(tag.id)}
                            onChange={() => props.toggleTag(tag.id)}
                            class="w-4 h-4 rounded border-gray-300 text-forest-600 focus:ring-forest-500"
                          />
                          <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">{tag.name}</span>
                        </label>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("public.plants.filters.careLevel")}
        </label>
        <div class="space-y-1.5">
          <RadioOption label={t("public.plants.filters.anyLevel")} checked={props.careDifficulty() === ""} onChange={() => setCare("")} />
          <For each={CARE_OPTIONS}>
            {(opt) => (
              <RadioOption label={t(opt.labelKey as any)} value={opt.value} checked={props.careDifficulty() === opt.value} onChange={() => setCare(opt.value)} />
            )}
          </For>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("public.plants.filters.light")}
        </label>
        <div class="space-y-1.5">
          <RadioOption label={t("public.plants.filters.anyLight")} checked={props.lightRequirement() === ""} onChange={() => setLight("")} />
          <For each={LIGHT_OPTIONS}>
            {(opt) => (
              <RadioOption label={t(opt.labelKey as any)} value={opt.value} checked={props.lightRequirement() === opt.value} onChange={() => setLight(opt.value)} />
            )}
          </For>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("public.plants.filters.watering")}
        </label>
        <div class="space-y-1.5">
          <RadioOption label={t("public.plants.filters.anyFrequency")} checked={props.wateringFrequency() === ""} onChange={() => setWater("")} />
          <For each={WATERING_OPTIONS}>
            {(opt) => (
              <RadioOption label={t(opt.labelKey as any)} value={opt.value} checked={props.wateringFrequency() === opt.value} onChange={() => setWater(opt.value)} />
            )}
          </For>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("public.plants.filters.humidity")}
        </label>
        <div class="space-y-1.5">
          <RadioOption label={t("public.plants.filters.anyLevel")} checked={props.humidityLevel() === ""} onChange={() => setHum("")} />
          <For each={HUMIDITY_OPTIONS}>
            {(opt) => (
              <RadioOption label={t(opt.labelKey as any)} value={opt.value} checked={props.humidityLevel() === opt.value} onChange={() => setHum(opt.value)} />
            )}
          </For>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("public.plants.filters.growthRate")}
        </label>
        <div class="space-y-1.5">
          <RadioOption label={t("public.plants.filters.anyRate")} checked={props.growthRate() === ""} onChange={() => setGrowth("")} />
          <For each={GROWTH_OPTIONS}>
            {(opt) => (
              <RadioOption label={t(opt.labelKey as any)} value={opt.value} checked={props.growthRate() === opt.value} onChange={() => setGrowth(opt.value)} />
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

function RadioOption(props: { label: string; value?: string; checked: boolean; onChange: () => void }) {
  return (
    <label class="flex items-center gap-2 cursor-pointer group">
      <input
        type="radio" value={props.value ?? ""} checked={props.checked} onChange={props.onChange}
        class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
      />
      <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">{props.label}</span>
    </label>
  );
}

function CategoryNode(props: {
  node: CategoryTree;
  depth: number;
  selectedId: () => string;
  onSelect: (id: string) => void;
}) {
  const indent = props.depth * 16;
  const hasChildren = (props.node.children?.length ?? 0) > 0;

  return (
    <>
      <div style={{ "padding-left": `${indent}px` }}>
        <RadioOption
          label={props.node.name}
          checked={props.selectedId() === props.node.id}
          onChange={() => props.onSelect(props.node.id)}
        />
      </div>
      <Show when={hasChildren}>
        <For each={props.node.children ?? []}>
          {(child) => (
            <CategoryNode
              node={child}
              depth={props.depth + 1}
              selectedId={props.selectedId}
              onSelect={props.onSelect}
            />
          )}
        </For>
      </Show>
    </>
  );
}
