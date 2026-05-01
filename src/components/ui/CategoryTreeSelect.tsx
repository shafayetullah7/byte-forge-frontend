import { createSignal, createMemo, For, Show, createEffect } from "solid-js";
import { ChevronDownIcon, CheckIcon, FolderIcon } from "~/components/icons";
import type { CategoryTree } from "~/lib/api/endpoints/public/categories.api";

export interface CategoryTreeSelectProps {
  categories: CategoryTree[];
  isLoading?: boolean;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  class?: string;
}

interface FlatNode {
  id: string;
  name: string;
  level: number;
  depth: number;
}

function buildTree(flat: CategoryTree[]): CategoryTree[] {
  const map = new Map<string, CategoryTree>();
  const roots: CategoryTree[] = [];

  for (const item of flat) {
    map.set(item.id, { ...item, children: item.children ?? [] });
  }
  for (const item of flat) {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      const parent = map.get(item.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function flattenTree(nodes: CategoryTree[], level = 0): FlatNode[] {
  let result: FlatNode[] = [];
  for (const node of nodes) {
    result.push({ id: node.id, name: node.name, level, depth: level });
    if (node.children && node.children.length > 0) {
      result = [...result, ...flattenTree(node.children, level + 1)];
    }
  }
  return result;
}

function getIconColor(level: number): string {
  if (level === 0) return "text-forest-600 dark:text-forest-400";
  if (level === 1) return "text-amber-500 dark:text-amber-400";
  return "text-gray-400 dark:text-gray-500";
}

export function CategoryTreeSelect(props: CategoryTreeSelectProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");

  const allNodes = createMemo(() => {
    const cats = props.categories;
    if (!cats || cats.length === 0) return [];

    const hasParentRefs = cats.some((c) => c.parentId !== null && c.parentId !== undefined);
    const hasNestedChildren = cats.some((c) => c.children && c.children.length > 0);

    let tree: CategoryTree[];
    if (hasNestedChildren) {
      tree = cats;
    } else if (hasParentRefs) {
      tree = buildTree(cats);
    } else {
      tree = cats;
    }

    return flattenTree(tree);
  });

  const filteredNodes = createMemo(() => {
    const q = searchQuery().toLowerCase().trim();
    if (!q) return allNodes();
    return allNodes().filter((n) => n.name.toLowerCase().includes(q));
  });

  const selectedNode = createMemo(() =>
    allNodes().find((n) => n.id === props.value) ?? null
  );

  const displayLabel = createMemo(() =>
    selectedNode() ? selectedNode()!.name : (props.placeholder || "Select a category")
  );

  createEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-category-tree-select]")) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  return (
    <div data-category-tree-select class={`space-y-2 w-full relative ${props.class || ""}`}>
      <Show when={props.label}>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {props.label}
          <Show when={props.required}>
            <span class="text-red-500 ml-1">*</span>
          </Show>
        </label>
      </Show>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen())}
        class={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border-2 text-left transition-colors ${
          isOpen()
            ? "border-forest-500 dark:border-forest-400"
            : props.error
              ? "border-red-500"
              : "border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600"
        } bg-white dark:bg-forest-900/30`}
      >
        <span
          class={`text-sm truncate ${
            selectedNode()
              ? "text-gray-900 dark:text-gray-100 font-medium"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {displayLabel()}
        </span>
        <ChevronDownIcon
          class={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
            isOpen() ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <Show when={isOpen()}>
        <div class="absolute z-50 mt-2 w-full bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
          {/* Search */}
          <div class="p-3 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Type category name..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-forest-900/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>

          {/* List */}
          <div class="max-h-72 overflow-y-auto">
            <Show
              when={props.isLoading}
              fallback={
                <Show
                  when={filteredNodes().length > 0}
                  fallback={
                    <div class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No categories found
                    </div>
                  }
                >
                  <For each={filteredNodes()}>
                    {(node) => {
                      const isSelected = props.value === node.id;
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            props.onChange(node.id);
                            setIsOpen(false);
                            setSearchQuery("");
                          }}
                          class={`w-full flex items-center gap-2 py-2 text-sm text-left transition-colors ${
                            isSelected
                              ? "bg-forest-50 dark:bg-forest-900/40 text-forest-800 dark:text-forest-200"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-700"
                          }`}
                        >
                          <div style={{ width: `${node.level * 12}px` }} class="flex-shrink-0" />
                          <FolderIcon class={`w-3.5 h-3.5 flex-shrink-0 ${getIconColor(node.level)}`} />
                          <span class="flex-1 truncate">{node.name}</span>
                          <Show when={isSelected}>
                            <CheckIcon class="w-4 h-4 text-forest-600 dark:text-forest-400 flex-shrink-0" />
                          </Show>
                        </button>
                      );
                    }}
                  </For>
                </Show>
              }
            >
              <div class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Loading categories...
              </div>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={props.error}>
        <p class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{props.error}</p>
      </Show>
    </div>
  );
}
