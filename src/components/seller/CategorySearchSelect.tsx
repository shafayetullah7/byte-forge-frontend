import { createSignal, createMemo, For, Show, createEffect } from "solid-js";

export interface CategoryOption {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  childrenCount: number;
}

interface CategorySearchSelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: CategoryOption[];
  placeholder?: string;
}

export function CategorySearchSelect(props: CategorySearchSelectProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");

  const categories = createMemo(() => props.categories);

  // Build flat list with indentation from hierarchy
  const indentedCategories = createMemo(() => {
    const cats = categories();
    const parentMap = new Map<string, CategoryOption>();
    const childrenMap = new Map<string, CategoryOption[]>();

    cats.forEach((cat) => {
      parentMap.set(cat.id, cat);
      if (!childrenMap.has(cat.id)) {
        childrenMap.set(cat.id, []);
      }
    });

    const roots: CategoryOption[] = [];
    cats.forEach((cat) => {
      if (!cat.parentId) {
        roots.push(cat);
      } else if (childrenMap.has(cat.parentId)) {
        childrenMap.get(cat.parentId)!.push(cat);
      }
    });

    // Sort roots by name
    roots.sort((a, b) => a.name.localeCompare(b.name));

    // Sort children by name
    childrenMap.forEach((children) => {
      children.sort((a, b) => a.name.localeCompare(b.name));
    });

    const result: { cat: CategoryOption; depth: number }[] = [];

    roots.forEach((root) => {
      result.push({ cat: root, depth: 0 });
      const children = childrenMap.get(root.id) || [];
      children.forEach((child) => {
        result.push({ cat: child, depth: 1 });
      });
    });

    return result;
  });

  // Filtered categories based on search
  const filteredCategories = createMemo(() => {
    const query = searchQuery().toLowerCase().trim();
    if (!query) return indentedCategories();

    return indentedCategories().filter(({ cat }) =>
      cat.name.toLowerCase().includes(query)
    );
  });

  // Selected category name for display
  const selectedLabel = createMemo(() => {
    const val = props.value;
    if (!val) return "All Categories";
    const cat = categories().find((c) => c.slug === val);
    return cat ? cat.name : "All Categories";
  });

  // Close dropdown on outside click
  createEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-category-dropdown]")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  return (
    <div data-category-dropdown class="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen())}
        class="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border-2 border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-900/30 text-gray-900 dark:text-gray-100 transition-standard focus-ring-flat text-left"
      >
        <div class="flex items-center gap-2 min-w-0">
          <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span class="text-sm truncate">
            {selectedLabel()}
          </span>
        </div>
        <svg
          class={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen() ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      <Show when={isOpen()}>
        <div class="absolute z-50 mt-2 w-72 bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
          {/* Search */}
          <div class="p-3 border-b border-gray-200 dark:border-gray-700">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                class="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-forest-900/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          {/* Category List */}
          <div class="max-h-64 overflow-y-auto">
            <For each={filteredCategories()}>
              {({ cat, depth }) => {
                const isSelected = props.value === cat.slug;
                return (
                  <button
                    type="button"
                    onClick={() => {
                      props.onChange(cat.slug);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    class={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                      isSelected
                        ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-700"
                    }`}
                    style={{ paddingLeft: `${12 + depth * 20}px` }}
                  >
                    {depth === 0 ? (
                      <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    ) : (
                      <svg class="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0 ml-1" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                    )}
                    <span class="truncate">
                      {cat.name}
                      {cat.childrenCount > 0 && depth === 0 && (
                        <span class="ml-1 text-xs text-gray-400 dark:text-gray-500">
                          ({cat.childrenCount})
                        </span>
                      )}
                    </span>
                  </button>
                );
              }}
            </For>

            <Show when={filteredCategories().length === 0}>
              <div class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No categories found
              </div>
            </Show>
          </div>

          {/* Footer */}
          <div class="p-2 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                props.onChange("");
                setIsOpen(false);
                setSearchQuery("");
              }}
              class="w-full text-center text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium py-1"
            >
              Show all categories
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}
