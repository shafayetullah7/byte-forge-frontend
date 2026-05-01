import { createMemo, For, Show, createSignal } from "solid-js";
import { TagIcon, XIcon, MagnifyingGlassIcon } from "~/components/icons";

export interface TagGroupOption {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  tags: { id: string; slug: string; name: string }[];
}

export interface TagGroupSelectorProps {
  selectedTags: string[];
  onToggle: (tagId: string) => void;
  groups: TagGroupOption[];
  isLoading?: boolean;
  class?: string;
}

const GROUP_COLORS = [
  "bg-forest-100 text-forest-700 dark:bg-forest-700 dark:text-forest-100",
  "bg-sage-100 text-sage-700 dark:bg-sage-700 dark:text-sage-100",
  "bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-700 dark:text-terracotta-100",
  "bg-cream-200 text-cream-600 dark:bg-cream-600 dark:text-cream-100",
];

function getGroupColorIndex(groupName: string): number {
  let hash = 0;
  for (let i = 0; i < groupName.length; i++) {
    hash = groupName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % GROUP_COLORS.length;
}

export function TagGroupSelector(props: TagGroupSelectorProps) {
  const [localSearch, setLocalSearch] = createSignal("");
  const selectedCount = createMemo(() => props.selectedTags.length);

  const tagToGroup = createMemo(() => {
    const map = new Map<string, { name: string; colorIndex: number }>();
    for (const group of props.groups) {
      const colorIndex = getGroupColorIndex(group.name);
      for (const tag of group.tags) {
        map.set(tag.id, { name: group.name, colorIndex });
      }
    }
    return map;
  });

  const allFlattenedTags = createMemo(() => {
    const result: { id: string; name: string; groupName: string; colorIndex: number }[] = [];
    for (const group of props.groups) {
      const colorIndex = getGroupColorIndex(group.name);
      for (const tag of group.tags) {
        result.push({ id: tag.id, name: tag.name, groupName: group.name, colorIndex });
      }
    }
    return result;
  });

  const filteredTags = createMemo(() => {
    const query = localSearch().toLowerCase().trim();
    if (!query) return allFlattenedTags();
    return allFlattenedTags().filter((tag) => tag.name.toLowerCase().includes(query));
  });

  const groupedFiltered = createMemo(() => {
    const query = localSearch().toLowerCase().trim();
    if (query) {
      return [];
    }
    return props.groups.map((group) => ({
      ...group,
      colorIndex: getGroupColorIndex(group.name),
      tags: group.tags,
    }));
  });

  return (
    <div class={`space-y-3 ${props.class || ""}`}>
      {/* Search + Selected Count */}
      <div class="flex items-center gap-3">
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search tags..."
            value={localSearch()}
            onInput={(e) => setLocalSearch(e.currentTarget.value)}
            class="w-full pl-9 pr-4 py-2.5 rounded-lg border-2 border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-900/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 dark:focus:border-forest-400 hover:border-cream-300 dark:hover:border-forest-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-forest-50 dark:bg-forest-900/30 border border-forest-200 dark:border-forest-700">
          <TagIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />
          <span class="text-sm font-medium text-forest-700 dark:text-forest-300">
            {selectedCount()}
          </span>
        </div>
      </div>

      {/* Selected Tags Pills */}
      <Show when={selectedCount() > 0}>
        <div class="flex flex-wrap items-center gap-2">
          <For each={props.selectedTags}>
            {(tagId) => {
              const info = tagToGroup().get(tagId);
              const tagObj = allFlattenedTags().find((t) => t.id === tagId);
              return (
                <button
                  type="button"
                  onClick={() => props.onToggle(tagId)}
                  title={info?.name}
                  class="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-800 dark:text-forest-100 ring-1 ring-inset ring-forest-300 dark:ring-forest-600 hover:bg-terracotta-100 hover:text-terracotta-800 dark:hover:bg-terracotta-800 dark:hover:text-terracotta-100 hover:ring-terracotta-300 dark:hover:ring-terracotta-600 transition-colors"
                >
                  <span class={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    GROUP_COLORS[info?.colorIndex ?? 0]
                  }`}>
                    {info?.name}
                  </span>
                  <span>{tagObj?.name}</span>
                  <XIcon class="w-3.5 h-3.5 text-forest-400 dark:text-forest-500 group-hover:text-terracotta-500" />
                </button>
              );
            }}
          </For>
          <button
            type="button"
            onClick={() => {
              const ids = [...props.selectedTags];
              ids.forEach((id) => props.onToggle(id));
            }}
            class="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-colors"
          >
            Clear all
          </button>
        </div>
      </Show>

      {/* Tag Content */}
      <Show
        when={props.isLoading}
        fallback={
          <Show
            when={localSearch() ? filteredTags().length > 0 : groupedFiltered().length > 0}
            fallback={
              <div class="py-12 text-center">
                <TagIcon class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {localSearch() ? "No tags match your search" : "No tags available"}
                </p>
              </div>
            }
          >
            {/* Search results: flat grid */}
            <Show
              when={!!localSearch()}
                fallback={
                /* Default: grouped inline layout */
                <div class="space-y-3">
                  <For each={groupedFiltered()}>
                    {(group) => (
                      <div class="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-forest-900/20 overflow-hidden">
                        {/* Group Header */}
                        <div class="px-3 py-2.5 border-b border-gray-100 dark:border-gray-700/50">
                          <div class="flex items-center justify-between gap-2">
                            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {group.name}
                            </span>
                            <span class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                              {group.tags.length} tag{group.tags.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <Show when={group.description}>
                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                              {group.description}
                            </p>
                          </Show>
                        </div>

                        {/* Tags */}
                        <div class="p-3">
                          <div class="flex flex-wrap gap-2">
                            <For each={group.tags}>
                              {(tag) => {
                                const isSelected = props.selectedTags.includes(tag.id);
                                return (
                                  <button
                                    type="button"
                                    onClick={() => props.onToggle(tag.id)}
                                    class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                      isSelected
                                        ? "bg-forest-100 text-forest-800 dark:bg-forest-800 dark:text-forest-100 ring-1 ring-inset ring-forest-300 dark:ring-forest-600"
                                        : "bg-white dark:bg-forest-800/50 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 hover:ring-forest-300 dark:hover:ring-forest-600 hover:bg-gray-50 dark:hover:bg-forest-800"
                                    }`}
                                  >
                                    <span class="truncate">{tag.name}</span>
                                  </button>
                                );
                              }}
                            </For>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              }
            >
              <div class="flex flex-wrap gap-2">
                <For each={filteredTags()}>
                  {(tag) => {
                    const isSelected = props.selectedTags.includes(tag.id);
                    return (
                      <button
                        type="button"
                        onClick={() => props.onToggle(tag.id)}
                        title={tag.groupName}
                        class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-forest-100 text-forest-800 dark:bg-forest-800 dark:text-forest-100 ring-1 ring-inset ring-forest-300 dark:ring-forest-600"
                            : "bg-white dark:bg-forest-800/50 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 hover:ring-forest-300 dark:hover:ring-forest-600 hover:bg-gray-50 dark:hover:bg-forest-800"
                        }`}
                      >
                        <span class={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          GROUP_COLORS[tag.colorIndex]
                        }`}>
                          {tag.groupName}
                        </span>
                        <span class="truncate">{tag.name}</span>
                      </button>
                    );
                  }}
                </For>
              </div>
            </Show>
          </Show>
        }
      >
        <div class="py-12 text-center">
          <div class="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-forest-500 dark:border-t-forest-400 rounded-full animate-spin mx-auto mb-3" />
          <p class="text-sm text-gray-500 dark:text-gray-400">Loading tags...</p>
        </div>
      </Show>
    </div>
  );
}
