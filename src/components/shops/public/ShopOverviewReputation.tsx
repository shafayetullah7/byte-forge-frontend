import { Show, Suspense, type Component } from "solid-js";
import { createAsync } from "@solidjs/router";
import { getShopReviews } from "~/lib/public-shops/public-shop.service";
import type { PublicShopProfile } from "~/lib/types/public/shops.types";
import { ShopReputationSection } from "./ShopAboutSection";

function ReputationLoading() {
  return <div class="h-48 rounded-2xl bg-cream-100 dark:bg-forest-800 animate-pulse" />;
}

const ShopOverviewReputationContent: Component<{
  slug: string;
  shop: PublicShopProfile;
  labels: Record<string, string>;
  t: (key: string) => string;
}> = (props) => {
  const reviews = createAsync(() => getShopReviews(props.slug));

  const summary = () => {
    const data = reviews()?.summary;
    if (!data || data.total <= 0) return undefined;
    return data;
  };

  return (
    <Show when={summary()} keyed>
      {(value) => (
        <ShopReputationSection
          shop={props.shop}
          summary={value()}
          labels={props.labels}
          t={props.t}
        />
      )}
    </Show>
  );
};

export const ShopOverviewReputation: Component<{
  slug: string;
  shop: PublicShopProfile;
  labels: Record<string, string>;
  t: (key: string) => string;
}> = (props) => (
  <Suspense fallback={<ReputationLoading />}>
    <ShopOverviewReputationContent
      slug={props.slug}
      shop={props.shop}
      labels={props.labels}
      t={props.t}
    />
  </Suspense>
);
