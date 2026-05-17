import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import { ChevronLeftIcon, ChevronRightIcon } from "~/components/icons";
import { getPageNumbers } from "../../routes/(app)/plants/constants";

export function Pagination(props: {
  currentPage: () => number;
  totalPages: () => number;
  setCurrentPage: (v: number | ((prev: number) => number)) => void;
}) {
  const { t } = useI18n();

  return (
    <Show when={props.totalPages() > 1}>
      <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 shadow-sm px-6 py-4 mt-8">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {t("public.plants.pagination.page")}{" "}
            <span class="font-semibold text-forest-800 dark:text-cream-50">
              {props.currentPage()}
            </span>{" "}
            {t("public.plants.pagination.of")}{" "}
            <span class="font-semibold text-forest-800 dark:text-cream-50">
              {props.totalPages()}
            </span>
          </p>
          <div class="flex items-center gap-2">
            <button
              onClick={() => props.setCurrentPage((p: number) => Math.max(1, p - 1))}
              disabled={props.currentPage() === 1}
              class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label={t("public.plants.pagination.previousPage")}
            >
              <ChevronLeftIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <For each={getPageNumbers(props.currentPage(), props.totalPages())}>
              {(page) => (
                page === "..." ? (
                  <span class="w-9 h-9 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 select-none">…</span>
                ) : (
                  <button
                    onClick={() => props.setCurrentPage(page as number)}
                    class={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      props.currentPage() === page
                        ? "bg-forest-600 text-white shadow-sm"
                        : "border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </For>
            <button
              onClick={() => props.setCurrentPage((p: number) => Math.min(props.totalPages(), p + 1))}
              disabled={props.currentPage() === props.totalPages()}
              class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label={t("public.plants.pagination.nextPage")}
            >
              <ChevronRightIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
