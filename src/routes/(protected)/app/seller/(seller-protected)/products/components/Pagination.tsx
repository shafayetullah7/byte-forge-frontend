import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import { ChevronRightIcon } from "~/components/icons";
import { getPageNumbers } from "./utils";

export function Pagination(props: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm px-6 py-4 mt-6">
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {t("seller.products.pagination.showing", {
            start: (props.currentPage - 1) * props.itemsPerPage + 1,
            end: Math.min(props.currentPage * props.itemsPerPage, props.totalItems),
            total: props.totalItems,
          })}
        </p>
        <Show when={props.totalPages > 1}>
          <div class="flex items-center gap-2">
            <button
              onClick={() => props.onPageChange(Math.max(1, props.currentPage - 1))}
              disabled={props.currentPage === 1}
              class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon class="w-5 h-5 text-gray-700 dark:text-gray-300 rotate-180" />
            </button>
            <For each={getPageNumbers(props.currentPage, props.totalPages)}>
              {(page) => (
                page === "..." ? (
                  <span class="w-9 h-9 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 select-none">\u2026</span>
                ) : (
                  <button
                    onClick={() => props.onPageChange(page as number)}
                    class={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      props.currentPage === page
                        ? "bg-forest-600 text-white"
                        : "border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </For>
            <button
              onClick={() => props.onPageChange(Math.min(props.totalPages, props.currentPage + 1))}
              disabled={props.currentPage === props.totalPages}
              class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}
