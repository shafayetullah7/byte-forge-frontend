import { createMemo, For, Show } from "solid-js";
import { TagIcon, CheckIcon, SearchIcon, XIcon } from "~/components/icons";

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

export function TagGroupSelector(props: TagGroupSelectorProps) {
  const searchQuery = createMemo(() => "");
  let searchInputRef: HTMLInputElement | undefined;
  const [localSearch, setLocalSearch] = createSignal("");

  const selectedCount = createMemo(() => props.selectedTags.length);

  const filteredGroups = createMemo(() => {
    const query = localSearch().toLowerCase().trim();
    if (!query) return props.groups;

    return props.groups
      .map((group) => ({
        ...group,
        tags: group.tags.filter((tag) =>
          tag.name.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.tags.length > 0);
  });

  const groupedSelected = createMemo(() => {
    const tagToGroup = new Map<string, string>();
    for (const group of props.groups) {
      for (const tag of group.tags) {
        tagToGroup.set(tag.id, group.name);
      }
    }
    return props.selectedTags.map((id) => ({
      id,
      groupName: tagToGroup.get(id) || "",
    }));
  });

  return (
    <div class={`space-y-4 ${props.class || ""}`}>
      {/* Search + Selected Count */}
      <div class="flex items-center gap-3">
        <div class="relative flex-1">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search tags..."
            value={localSearch()}
            onInput={(e) => setLocalSearch(e.currentTarget.value)}
            class="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-forest-900/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
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
        <div class="flex flex-wrap gap-2">
          <For each={groupedSelected()}>
            {(item) => {
              const isSelected = props.selectedTags.includes(item.id);
              if (!isSelected) return null;
              const tagObj = props.groups
                .flatMap((g) => g.tags)
                .find((t) => t.id === item.id);
              return (
                <button
                  type="button"
                  onClick={() => props.onToggle(item.id)}
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border border-forest-200 dark:border-forest-700 hover:bg-terracotta-50 hover:text-terracotta-700 hover:border-terracotta-200 dark:hover:bg-terracotta-900/30 dark:hover:text-terracotta-300 dark:hover:border-terracotta-700 transition-colors"
                >
                  <span class="text-xs">{item.groupName}</span>
                  <span class="text-forest-400 dark:text-forest-500">/</span>
                  <span>{tagObj?.name}</span>
                  <XIcon class="w-3.5 h-3.5 text-forest-500 dark:text-forest-400" />
                </button>
              );
            }}
          </For>
          <button
            type="button"
            onClick={() => {
              props.selectedTags.forEach((id) => props.onToggle(id));
            }}
            class="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-colors"
          >
            Clear all
          </button>
        </div>
      </Show>

      {/* Tag Groups */}
      <Show
        when={props.isLoading}
        fallback={
          <Show
            when={filteredGroups().length > 0}
            fallback={
              <div class="py-12 text-center">
                <TagIcon class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {localSearch() ? "No tags match your search" : "No tags available"}
                </p>
              </div>
            }
          >
            <div class="space-y-4">
              <For each={filteredGroups()}>
                {(group) => (
                  <div class="rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                    {/* Group Header */}
                    <div class="px-4 py-3 bg-gray-50 dark:bg-forest-900/40 border-b border-gray-100 dark:border-gray-700/50">
                      <div class="flex items-center justify-between">
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {group.name}
                        </h4>
                        <span class="text-xs text-gray-400 dark:text-gray-500">
                          {group.tags.length} tag{group.tags.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <Show when={group.description}>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {group.description}
                        </p>
                      </Show>
                    </div>

                    {/* Tag Cards Grid */}
                    <div class="p-3">
                      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        <For each={group.tags}>
                          {(tag) => {
                            const isSelected = props.selectedTags.includes(tag.id);
                            return (
                              <button
                                type="button"
                                onClick={() => props.onToggle(tag.id)}
                                class={`relative flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                                  isSelected
                                    ? "border-forest-500 bg-forest-50 text-forest-800 dark:border-forest-400 dark:bg-forest-900/40 dark:text-forest-200 shadow-sm"
                                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-forest-800/30 text-gray-700 dark:text-gray-300 hover:border-forest-300 dark:hover:border-forest-600 hover:bg-forest-50/50 dark:hover:bg-forest-900/20"
                                }`}
                              >
                                <Show when={isSelected}>
                                  <div class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-forest-500 dark:bg-forest-400 flex items-center justify-center shadow-sm">
                                    <CheckIcon class="w-3 h-3 text-white" />
                                  </div>
                                </Show>
                                <TagIcon class={`w-3.5 h-3.5 flex-shrink-0 ${
                                  isSelected
                                    ? "text-forest-500 dark:text-forest-400"
                                    : "text-gray-400 dark:text-gray-500"
                                }`} />
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
