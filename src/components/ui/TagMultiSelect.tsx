import { createSignal, createMemo, For, Show, createEffect } from "solid-js";
import { HashtagIcon, ChevronDownIcon, CheckIcon } from "~/components/icons";

export interface TagGroupOption {
  id: string;
  slug: string;
  name: string;
  tags: { id: string; slug: string; name: string }[];
}

export interface TagMultiSelectProps {
  selectedTags: string[];
  onToggle: (tagId: string) => void;
  groups: TagGroupOption[];
  placeholder?: string;
  class?: string;
}

export function TagMultiSelect(props: TagMultiSelectProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");

  const selectedCount = createMemo(() => props.selectedTags.length);

  const filteredGroups = createMemo(() => {
    const query = searchQuery().toLowerCase();
    if (!query) return props.groups;

    return props.groups
      .map((group) => ({
        ...group,
        tags: group.tags.filter(
          (tag) =>
            tag.name.toLowerCase().includes(query) ||
            tag.slug.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.tags.length > 0);
  });

  createEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-tag-multiselect]")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  return (
    <div data-tag-multiselect class={`relative ${props.class || ""}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen())}
        class={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border-2 transition-standard focus-ring-flat text-left ${
          isOpen()
            ? "border-forest-500 dark:border-forest-400"
            : "border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600"
        } bg-white dark:bg-forest-900/30 text-gray-900 dark:text-gray-100`}
      >
        <div class="flex items-center gap-2 min-w-0">
          <HashtagIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span class="text-sm truncate">
            {selectedCount() > 0
              ? `${selectedCount()} tag${selectedCount() > 1 ? "s" : ""} selected`
              : (props.placeholder || "Select tags")}
          </span>
        </div>
        <ChevronDownIcon class={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen() ? "rotate-180" : ""}`} />
      </button>

      {/* Selected Tags Pills */}
      <Show when={selectedCount() > 0}>
        <div class="flex flex-wrap gap-1.5 mt-2">
          <For each={props.groups.flatMap((g) => g.tags)}>
            {(tag) => {
              const isSelected = props.selectedTags.includes(tag.id);
              return (
                <Show when={isSelected}>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300">
                    {tag.name}
                  </span>
                </Show>
              );
            }}
          </For>
        </div>
      </Show>

      {/* Dropdown */}
      <Show when={isOpen()}>
        <div class="absolute z-50 mt-2 w-full bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
          {/* Search */}
          <div class="p-3 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-forest-900/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>

          {/* Tag Groups */}
          <div class="max-h-64 overflow-y-auto">
            <For each={filteredGroups()}>
              {(group) => (
                <div class="border-b border-gray-100 dark:border-gray-700/50 last:border-b-0">
                  <div class="px-3 py-2 bg-gray-50 dark:bg-forest-900/50">
                    <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {group.name}
                    </span>
                  </div>
                  <div class="p-2">
                    <For each={group.tags}>
                      {(tag) => {
                        const isSelected = props.selectedTags.includes(tag.id);
                        return (
                          <button
                            type="button"
                            onClick={() => props.onToggle(tag.id)}
                            class={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                              isSelected
                                ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-700"
                            }`}
                          >
                            <div
                              class={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-forest-500 border-forest-500"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {isSelected && <CheckIcon class="w-3 h-3 text-white" />}
                            </div>
                            {tag.name}
                          </button>
                        );
                      }}
                    </For>
                  </div>
                </div>
              )}
            </For>

            <Show when={filteredGroups().length === 0}>
              <div class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No tags found
              </div>
            </Show>
          </div>

          {/* Footer */}
          <div class="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-forest-900/50">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {selectedCount()} selected
            </span>
            <button
              type="button"
              onClick={() => {
                props.selectedTags.forEach((id) => props.onToggle(id));
              }}
              class="text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
            >
              Clear all
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}
