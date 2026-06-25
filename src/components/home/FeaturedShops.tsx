import { Show, For } from "solid-js";
import { createAsync } from "@solidjs/router";
import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";
import { listShops } from "~/lib/public-shops/public-shop.service";
import {
  ShopDiscoveryCard,
  ShopDiscoveryCardLink,
} from "~/components/shops/public";

export function FeaturedShops() {
  const { t } = useI18n();
  const shops = createAsync(() => listShops({ sort: "popular", limit: 3 }), {
    deferStream: true,
  });

  const cardLabels = () => ({
    verifiedLabel: t("public.shops.directory.verified"),
    activeLabel: t("public.shops.directory.active"),
    productsLabel: t("public.shops.directory.products"),
    ordersLabel: t("public.shops.directory.orders"),
  });

  return (
    <Show when={shops() !== undefined && (shops()?.data.length ?? 0) > 0}>
      <section class="py-24 px-4 bg-cream-50 dark:bg-forest-950">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
              {t("landing.featuredShops.label")}
            </span>
            <h2 class="h2 mt-3 mb-4">{t("landing.featuredShops.title")}</h2>
            <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("public.shops.directory.subtitle")}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={shops()?.data ?? []}>
              {(shop) => (
                <ShopDiscoveryCardLink shop={shop}>
                  <ShopDiscoveryCard shop={shop} compact {...cardLabels()} />
                </ShopDiscoveryCardLink>
              )}
            </For>
          </div>

          <div class="text-center mt-12">
            <LinkButton href="/shops" variant="primary" size="lg">
              {t("landing.featuredShops.viewAll")} →
            </LinkButton>
          </div>
        </div>
      </section>
    </Show>
  );
}
