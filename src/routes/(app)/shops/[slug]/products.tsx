import { createResource, createSignal, createMemo, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { useI18n } from "~/i18n";
import { getShopBySlug, getShopProducts } from "~/lib/public-shops/public-shop.service";
import type { PublicProductSortOption } from "~/lib/types/public/shops.types";
import { ShopFeaturedProducts, ShopProductCatalog } from "~/components/shops/public";

export default function ShopProductsPage() {
  const params = useParams<{ slug: string }>();
  const { t } = useI18n();

  const slug = () => params.slug;

  const [shop] = createResource(slug, getShopBySlug);
  const [productSearch, setProductSearch] = createSignal("");
  const [productCategory, setProductCategory] = createSignal("");
  const [productSort, setProductSort] = createSignal<PublicProductSortOption>("popular");

  const [products] = createResource(
    () => ({
      slug: slug(),
      search: productSearch(),
      category: productCategory(),
      sort: productSort(),
    }),
    (p) =>
      getShopProducts(p.slug, {
        search: p.search,
        category: p.category || undefined,
        sort: p.sort,
        limit: 50,
      }),
  );

  const productCategories = createMemo(() => {
    const items = products()?.data ?? [];
    return [...new Set(items.map((p) => p.category))].sort();
  });

  return (
    <Show when={shop()}>
      {(shopData) => (
        <>
          <Title>
            {t("public.shops.detail.tabs.products")} | {shopData().name} | Byte Forge
          </Title>
          <div class="space-y-10">
            <ShopFeaturedProducts
              products={products()?.data ?? []}
              title={t("public.shops.detail.featuredProducts")}
              outOfStockLabel={t("public.shops.detail.outOfStock")}
            />
            <ShopProductCatalog
              products={products()?.data ?? []}
              search={productSearch()}
              category={productCategory()}
              sort={productSort()}
              categories={productCategories()}
              outOfStockLabel={t("public.shops.detail.outOfStock")}
              labels={{
                searchProducts: t("public.shops.detail.searchProducts"),
                allCategories: t("public.shops.directory.allCategories"),
                sortPopular: t("public.shops.detail.sortPopular"),
                sortNewest: t("public.shops.detail.sortNewest"),
                sortPriceAsc: t("public.shops.detail.sortPriceAsc"),
                sortPriceDesc: t("public.shops.detail.sortPriceDesc"),
                sortRating: t("public.shops.detail.sortRating"),
                noProducts: t("public.shops.detail.noProducts"),
              }}
              onSearchChange={setProductSearch}
              onCategoryChange={setProductCategory}
              onSortChange={(v) => setProductSort(v as PublicProductSortOption)}
            />
          </div>
        </>
      )}
    </Show>
  );
}
