import { Show } from "solid-js";
import type { Component } from "solid-js";
import type { PublicShopProfile } from "~/lib/types/public/shops.types";
import { VerifiedBadge, ActiveStatusBadge } from "./ReputationBadge";
import { ShopTrustSnapshot } from "./ShopTrustSnapshot";
import Button from "~/components/ui/Button";

export const ShopHero: Component<{
  shop: PublicShopProfile;
  labels: Record<string, string>;
  onFollow?: () => void;
  onShare?: () => void;
}> = (props) => {
  const memberYear = () => new Date(props.shop.createdAt).getFullYear();

  return (
    <section aria-label={props.shop.name} class="relative">
      <div class="h-48 sm:h-64 md:h-72 overflow-hidden bg-gradient-to-r from-forest-600 to-sage-700">
        <Show when={props.shop.banner?.url}>
          <img
            src={props.shop.banner!.url}
            alt=""
            class="w-full h-full object-cover"
          />
        </Show>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div class="max-w-7xl mx-auto px-4 -mt-16 sm:-mt-20 relative z-10 pb-6">
        <div class="flex flex-col sm:flex-row gap-4 sm:items-end">
          <Show when={props.shop.logo?.url}>
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white dark:border-forest-900 bg-white dark:bg-forest-800 overflow-hidden shadow-xl shrink-0">
              <img src={props.shop.logo!.url} alt="" class="w-full h-full object-cover" />
            </div>
          </Show>

          <div class="flex-1 min-w-0 text-white sm:text-inherit">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <Show when={props.shop.isVerified}>
                <VerifiedBadge label={props.labels.verified} />
              </Show>
              <ActiveStatusBadge label={props.labels.active} />
              <span class="text-sm text-cream-100 sm:text-gray-500 sm:dark:text-gray-400">
                {props.shop.category}
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold text-white sm:text-forest-800 sm:dark:text-cream-50 mb-1">
              {props.shop.name}
            </h1>
            <p class="text-sm sm:text-base text-cream-100/90 sm:text-gray-600 sm:dark:text-gray-300 mb-2">
              {props.shop.tagline}
            </p>
            <div class="flex flex-wrap items-center gap-3 text-sm text-cream-100/80 sm:text-gray-500 sm:dark:text-gray-400">
              <span>{props.shop.city}, {props.shop.division}</span>
              <span aria-hidden="true">·</span>
              <span>{props.labels.memberSince} {memberYear()}</span>
            </div>
          </div>

          <div class="flex gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => props.onFollow?.()}
              title={props.labels.followSoon}
            >
              {props.labels.follow}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => props.onShare?.()}
            >
              {props.labels.share}
            </Button>
          </div>
        </div>

        <div class="mt-6">
          <ShopTrustSnapshot metrics={props.shop.metrics} labels={props.labels} />
        </div>
      </div>
    </section>
  );
};
