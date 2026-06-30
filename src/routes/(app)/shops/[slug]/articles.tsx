import { Meta } from "@solidjs/meta";
import { Navigate, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { config } from "~/lib/config";
import { useI18n } from "~/i18n";
import { getShopArticles } from "~/lib/public-shops/public-shop.service";
import { ShopEducationalContent } from "~/components/shops/public";

export const route = {
  preload: ({ params }) => getShopArticles(params.slug as string),
} satisfies RouteDefinition;

export default function ShopArticlesPage() {
  const params = useParams<{ slug: string }>();
  const { t } = useI18n();

  if (!config.articlesEnabled) {
    return (
      <>
        <Meta name="robots" content="noindex, nofollow" />
        <Navigate href={`/shops/${params.slug}`} />
      </>
    );
  }

  const articles = createAsync(() => getShopArticles(params.slug), { deferStream: true });

  const labels = () => ({
    totalArticles: t("public.shops.detail.totalArticles"),
    totalViews: t("public.shops.detail.totalViews"),
    totalLikes: t("public.shops.detail.totalLikes"),
    editorsPick: t("public.shops.detail.editorsPick"),
    popular: t("public.shops.detail.popular"),
    allArticles: t("public.shops.detail.allArticles"),
    readTime: t("public.shops.detail.readTime"),
  });

  return (
    <Show
      when={articles()}
      fallback={<div class="h-48 bg-cream-200 dark:bg-forest-800 rounded-xl animate-pulse" />}
    >
      <ShopEducationalContent
        shopSlug={params.slug}
        articles={articles() ?? []}
        labels={labels()}
      />
    </Show>
  );
}
