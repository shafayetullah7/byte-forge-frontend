import { Show } from "solid-js";
import { A, createAsync, Navigate, useParams, type RouteDefinition } from "@solidjs/router";
import { Meta, Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { useI18n } from "~/i18n";
import { config } from "~/lib/config";
import { getArticleDetail } from "~/lib/api/endpoints/public/shops.api";
import { mapApiArticle } from "~/lib/public-shops/content.mappers";
import { unwrapSuccess } from "~/lib/public-shops/shop.mappers";
import { formatPageTitle } from "~/lib/seo/meta";
import { ApiError } from "~/lib/api/types";

export const route = {
  preload: ({ params }) =>
    getArticleDetail(params.slug as string, params.articleSlug as string),
} satisfies RouteDefinition;

export default function ShopArticleDetailPage() {
  const params = useParams<{ slug: string; articleSlug: string }>();
  const { t } = useI18n();

  if (!config.articlesEnabled) {
    return (
      <>
        <Meta name="robots" content="noindex, nofollow" />
        <Navigate href={`/shops/${params.slug}`} />
      </>
    );
  }

  const articleQuery = createAsync(async () => {
    try {
      const envelope = await getArticleDetail(params.slug, params.articleSlug);
      return mapApiArticle(unwrapSuccess(envelope));
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) return null;
      throw error;
    }
  }, { deferStream: true });

  return (
    <Show
      when={articleQuery() !== undefined}
      fallback={<div class="h-64 bg-cream-200 dark:bg-forest-800 rounded-xl animate-pulse" />}
    >
      <Show
        when={articleQuery()}
        fallback={
          <>
            <HttpStatusCode code={404} />
            <Meta name="robots" content="noindex, nofollow" />
            <p class="text-center text-gray-500 py-12">{t("public.shops.detail.articleNotFound")}</p>
          </>
        }
      >
        {(article) => (
          <>
            <Title>{formatPageTitle(article().title)}</Title>
            <article class="max-w-3xl mx-auto space-y-6">
              <A
                href={`/shops/${params.slug}/articles`}
                class="text-sm text-forest-600 dark:text-forest-400 hover:underline"
              >
                ← {t("public.shops.detail.backToArticles")}
              </A>
              <Show when={article().coverUrl}>
                <img
                  src={article().coverUrl}
                  alt=""
                  class="w-full aspect-[16/9] object-cover rounded-2xl"
                />
              </Show>
              <div>
                <span class="text-xs font-medium text-forest-600">{article().category}</span>
                <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-2">
                  {article().title}
                </h1>
                <p class="text-sm text-gray-500 mt-2">
                  {t("public.shops.detail.readTime").replace("{n}", String(article().readMinutes))}
                </p>
              </div>
              <p class="text-lg text-gray-600 dark:text-gray-300">{article().excerpt}</p>
              <Show when={article().body}>
                <div class="prose prose-forest dark:prose-invert max-w-none">
                  <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {article().body}
                  </p>
                </div>
              </Show>
            </article>
          </>
        )}
      </Show>
    </Show>
  );
}
