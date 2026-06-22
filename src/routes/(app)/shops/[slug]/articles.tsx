import { createResource, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { useI18n } from "~/i18n";
import { getShopBySlug, getShopArticles } from "~/lib/public-shops/public-shop.service";
import { ShopEducationalContent } from "~/components/shops/public";

export default function ShopArticlesPage() {
  const params = useParams<{ slug: string }>();
  const { t } = useI18n();

  const slug = () => params.slug;

  const [shop] = createResource(slug, getShopBySlug);
  const [articles] = createResource(slug, getShopArticles);

  return (
    <Show when={shop()}>
      {(shopData) => (
        <Show when={articles()}>
          {(items) => (
            <>
              <Title>
                {t("public.shops.detail.tabs.articles")} | {shopData().name} | Byte Forge
              </Title>
              <ShopEducationalContent
                articles={items()}
                labels={{
                  totalArticles: t("public.shops.detail.totalArticles"),
                  totalViews: t("public.shops.detail.totalViews"),
                  totalLikes: t("public.shops.detail.totalLikes"),
                  editorsPick: t("public.shops.detail.editorsPick"),
                  popular: t("public.shops.detail.popular"),
                  allArticles: t("public.shops.detail.allArticles"),
                  readTime: t("public.shops.detail.readTime"),
                }}
              />
            </>
          )}
        </Show>
      )}
    </Show>
  );
}
