import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import type { PublicShopListItem } from "~/lib/types/public/shops.types";
import { ShopDiscoveryCard, ShopDiscoveryCardLink } from "./ShopDiscoveryCard";

export const SimilarShops: Component<{
  shops: PublicShopListItem[];
  title: string;
  verifiedLabel: string;
  activeLabel: string;
  productsLabel: string;
  ordersLabel: string;
}> = (props) => (
  <Show when={props.shops.length > 0}>
    <section>
      <h2 class="text-xl font-bold text-forest-800 dark:text-cream-50 mb-4">{props.title}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <For each={props.shops}>
          {(shop) => (
            <ShopDiscoveryCardLink shop={shop}>
              <ShopDiscoveryCard
                shop={shop}
                compact
                verifiedLabel={props.verifiedLabel}
                activeLabel={props.activeLabel}
                productsLabel={props.productsLabel}
                ordersLabel={props.ordersLabel}
              />
            </ShopDiscoveryCardLink>
          )}
        </For>
      </div>
    </section>
  </Show>
);
