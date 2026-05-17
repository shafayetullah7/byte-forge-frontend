import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import { MagnifyingGlassIcon, FilterIcon, XIcon, ChevronDownIcon } from "~/components/icons";
import { SORT_OPTIONS } from "../../routes/(app)/plants/constants";

export function FilterToolbar(props: {
  searchQuery: () => string;
  setSearchQuery: (v: string) => void;
  hasActiveFilters: () => boolean;
  activeFilterCount: () => number;
  sidebarOpen: () => boolean;
  setSidebarOpen: (v: boolean) => void;
  sortBy: () => string;
  setSortBy: (v: string) => void;
  sortOrder: () => "asc" | "desc";
  setSortOrder: (v: "asc" | "desc") => void;
}) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 shadow-sm mb-6">
      <div class="p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 relative">
            <MagnifyingGlassIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("public.plants.toolbar.searchPlaceholder")}
              value={props.searchQuery()}
              onInput={(e) => props.setSearchQuery(e.currentTarget.value)}
              class="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-900/30 text-forest-800 dark:text-cream-50 placeholder-gray-400 dark:placeholder-gray-500 transition-standard focus-ring-flat text-sm"
            />
            <Show when={props.searchQuery()}>
              <button
                onClick={() => props.setSearchQuery("")}
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors"
              >
                <XIcon class="w-4 h-4 text-gray-400" />
              </button>
            </Show>
          </div>

          <button
            onClick={() => props.setSidebarOpen(!props.sidebarOpen())}
            class={`lg:hidden inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 transition-standard text-sm font-medium ${
              props.sidebarOpen()
                ? "border-forest-500 bg-forest-50 text-forest-700 dark:border-forest-400 dark:bg-forest-900/50 dark:text-forest-300"
                : "border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:border-forest-300 dark:hover:border-forest-600"
            }`}
          >
            <FilterIcon class="w-4 h-4" />
            {t("public.plants.toolbar.filters")}
            <Show when={props.hasActiveFilters()}>
              <span class="w-5 h-5 rounded-full bg-forest-500 text-white text-xs flex items-center justify-center font-bold">
                {props.activeFilterCount()}
              </span>
            </Show>
          </button>

          <div class="relative">
            <select
              value={props.sortBy()}
              onChange={(e) => {
                props.setSortBy(e.currentTarget.value);
                props.setSortOrder("asc");
              }}
              class="w-full sm:w-auto px-4 py-3 rounded-xl border-2 border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-900/30 text-forest-800 dark:text-cream-50 transition-standard focus-ring-flat text-sm appearance-none cursor-pointer pr-8"
            >
              <For each={SORT_OPTIONS}>
                {(opt) => <option value={opt.value}>{t(opt.labelKey as any)}</option>}
              </For>
            </select>
            <ChevronDownIcon class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => props.setSortOrder(props.sortOrder() === "asc" ? "desc" : "asc")}
            class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-cream-200 dark:border-forest-700 hover:border-forest-300 dark:hover:border-forest-600 bg-white dark:bg-forest-900/30 text-forest-800 dark:text-cream-50 transition-standard text-sm font-medium"
          >
            {props.sortOrder() === "asc" ? t("public.plants.toolbar.asc") : t("public.plants.toolbar.desc")}
          </button>
        </div>
      </div>
    </div>
  );
}
