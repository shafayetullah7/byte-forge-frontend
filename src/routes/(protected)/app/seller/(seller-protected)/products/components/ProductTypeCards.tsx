import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { ChevronRightIcon } from "~/components/icons";
import type { ProductTypeConfig } from "./utils";

export function ProductTypeCards(props: { typeStats: ProductTypeConfig[] & { total: number; active: number; draft: number; archived: number }[] }) {
  const { t } = useI18n();

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <For each={props.typeStats}>
        {(pt) => (
          <A
            href={pt.href}
            class={`block bg-white dark:bg-forest-800 rounded-xl border ${pt.borderColor} shadow-sm overflow-hidden transition-all hover:shadow-md ${pt.hoverBg} group`}
            classList={{
              "opacity-60 pointer-events-none": pt.total === 0,
            }}
          >
            <div class={`p-5 ${pt.bgColor} border-b ${pt.borderColor}`}>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class={`w-10 h-10 rounded-lg ${pt.bgColor} border ${pt.borderColor} flex items-center justify-center`}>
                    <pt.icon class={`w-5 h-5 ${pt.color}`} />
                  </div>
                  <div>
                    <h3 class="font-semibold text-forest-800 dark:text-cream-50">
                      {t(pt.nameKey)}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {t("seller.products.productCount", { count: pt.total })}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors" />
              </div>
            </div>

            <div class="p-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p class="text-lg font-bold text-forest-600 dark:text-forest-400">
                    {pt.active}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{t("seller.products.cardStats.active")}</p>
                </div>
                <div>
                  <p class="text-lg font-bold text-cream-600 dark:text-cream-400">
                    {pt.draft}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{t("seller.products.cardStats.draft")}</p>
                </div>
                <div>
                  <p class="text-lg font-bold text-terracotta-600 dark:text-terracotta-400">
                    {pt.archived}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{t("seller.products.cardStats.archived")}</p>
                </div>
              </div>

              <Show when={pt.total > 0}>
                <div class="mt-3">
                  <div class="flex items-center gap-2 mb-1">
                    <div class="flex-1 h-1.5 bg-gray-100 dark:bg-forest-700 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-forest-500 rounded-full transition-all"
                        style={{ width: `${(pt.active / pt.total) * 100}%` }}
                      />
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {Math.round((pt.active / pt.total) * 100)}%
                    </span>
                  </div>
                </div>
              </Show>
            </div>
          </A>
        )}
      </For>
    </div>
  );
}
