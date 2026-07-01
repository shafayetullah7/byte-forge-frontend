import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import { getSellerArticles } from "~/lib/api/endpoints/seller/articles.api";
import Button from "~/components/ui/Button";
import { ModerationStatusBadge } from "~/components/seller/forms/ModerationStatusBadge";

export const route = {
  preload: () => getSellerArticles({ page: 1, limit: 20 }),
} satisfies RouteDefinition;

function moderationLabel(t: (key: string) => string, status: string) {
  const key = status.toLowerCase() as "draft" | "pending" | "approved" | "rejected" | "archived";
  return t(`seller.articles.moderation.${key}`);
}

export default function SellerArticlesPage() {
  const { t } = useI18n();
  const articles = createAsync(() => getSellerArticles({ page: 1, limit: 20 }), { deferStream: true });

  return (
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
            {t("seller.articles.title")}
          </h1>
          <p class="text-sm text-gray-500">{t("seller.articles.subtitle")}</p>
        </div>
        <A href="/app/seller/articles/new">
          <Button>{t("seller.articles.create")}</Button>
        </A>
      </div>

      <Show
        when={articles()?.data}
        fallback={<div class="h-40 bg-cream-200 dark:bg-forest-800 rounded-xl animate-pulse" />}
      >
        {(items) => (
          <Show
            when={items().length > 0}
            fallback={
              <div class="rounded-xl border border-dashed border-cream-300 dark:border-forest-600 p-8 text-center">
                <p class="text-gray-600 dark:text-gray-400 mb-4">{t("seller.articles.emptyList")}</p>
                <A href="/app/seller/articles/new">
                  <Button>{t("seller.articles.create")}</Button>
                </A>
              </div>
            }
          >
            <div class="rounded-xl border border-cream-200 dark:border-forest-700 overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-cream-50 dark:bg-forest-900/50 text-left">
                  <tr>
                    <th class="px-4 py-3">{t("seller.articles.table.title")}</th>
                    <th class="px-4 py-3">{t("seller.articles.table.category")}</th>
                    <th class="px-4 py-3">{t("seller.articles.table.status")}</th>
                    <th class="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  <For each={items()}>
                    {(item) => (
                      <tr class="border-t border-cream-200 dark:border-forest-700">
                        <td class="px-4 py-3 font-medium">{item.title}</td>
                        <td class="px-4 py-3 text-gray-500">{item.category ?? "—"}</td>
                        <td class="px-4 py-3">
                          <ModerationStatusBadge
                            status={item.moderationStatus}
                            label={moderationLabel(t, item.moderationStatus)}
                          />
                        </td>
                        <td class="px-4 py-3 text-right">
                          <A
                            href={`/app/seller/articles/${item.id}`}
                            class="text-forest-600 hover:underline"
                          >
                            {t("seller.articles.edit")}
                          </A>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </Show>
        )}
      </Show>
    </div>
  );
}
