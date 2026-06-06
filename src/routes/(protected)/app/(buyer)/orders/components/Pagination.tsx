import { For, Show } from "solid-js";
import { ChevronRightIcon } from "~/components/icons";

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

export function Pagination(props: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <Show when={props.totalPages > 1}>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm px-6 py-4 mt-6">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Showing {Math.min((props.currentPage - 1) * props.itemsPerPage + 1, props.totalItems)} - {Math.min(props.currentPage * props.itemsPerPage, props.totalItems)} of {props.totalItems}
          </p>
          <div class="flex items-center gap-2">
            <button
              onClick={() => props.onPageChange(Math.max(1, props.currentPage - 1))}
              disabled={props.currentPage === 1}
              class="p-2 rounded-lg border border-gray-200 dark:border-forest-700 hover:bg-gray-50 dark:hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                        : "border border-gray-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-700"
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
              class="p-2 rounded-lg border border-gray-200 dark:border-forest-700 hover:bg-gray-50 dark:hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
