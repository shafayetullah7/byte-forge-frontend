import { Show } from "solid-js";
import type { Component } from "solid-js";
import type { PublicShopProfile } from "~/lib/types/public/shops.types";
import { VerifiedBadge, ActiveStatusBadge } from "./ReputationBadge";
import { ShopTrustSnapshot } from "./ShopTrustSnapshot";
import Button from "~/components/ui/Button";
import { cloudinaryUrl } from "~/lib/media/cloudinary-url";
import { useI18n } from "~/i18n";

export const ShopHero: Component<{
  shop: PublicShopProfile;
  labels: Record<string, string>;
  followEnabled?: boolean;
  isFollowing?: boolean;
  isFollowPending?: boolean;
  onFollow?: () => void;
  onShare?: () => void;
}> = (props) => {
  const { t } = useI18n();
  const memberYear = () => new Date(props.shop.createdAt).getFullYear();

  return (
    <section aria-label={props.shop.name} class="relative">
      <div class="relative h-48 sm:h-64 md:h-72 overflow-hidden bg-gradient-to-r from-forest-600 to-sage-700">
        <Show when={props.shop.banner?.url}>
          <img
            src={cloudinaryUrl(props.shop.banner!.url, "hero")}
            alt=""
            class="w-full h-full object-cover"
            fetchpriority="high"
            decoding="async"
          />
        </Show>
        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:-mt-20 relative z-10 pb-6">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <Show when={props.shop.logo?.url}>
            <div
              class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white dark:border-forest-900 bg-white dark:bg-forest-800 overflow-hidden shadow-xl shrink-0 -mt-12 sm:mt-0"
            >
              <img
                src={cloudinaryUrl(props.shop.logo!.url, "logo-md")}
                alt={props.shop.name}
                class="w-full h-full object-cover"
                decoding="async"
              />
            </div>
          </Show>

          {/* Mobile: text on page background. sm+: overlaps banner — light text on scrim. */}
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <Show when={props.shop.isVerified}>
                <VerifiedBadge label={props.labels.verified} />
              </Show>
              <ActiveStatusBadge label={props.labels.active} />
              <span class="text-sm text-forest-600 dark:text-forest-400 sm:text-cream-100/90">
                {props.shop.category}
              </span>
            </div>
            <h1
              class="text-2xl sm:text-3xl font-bold text-forest-800 dark:text-cream-50 sm:text-cream-50 sm:drop-shadow-sm mb-2"
            >
              {props.shop.name}
            </h1>
            <Show when={props.shop.tagline}>
              <p class="text-sm sm:text-base text-forest-700/80 dark:text-gray-300 sm:text-cream-100/90 mb-2">
                {props.shop.tagline}
              </p>
            </Show>
            <div
              class="flex flex-wrap items-center gap-3 text-sm text-forest-700 dark:text-forest-300"
            >
              <span>{props.shop.city}, {props.shop.division}</span>
              <span aria-hidden="true">·</span>
              <span>{t("public.shops.detail.memberSince", memberYear())}</span>
              <Show when={props.followEnabled && props.shop.metrics.followerCount > 0}>
                <span aria-hidden="true">·</span>
                <span>
                  {props.shop.metrics.followerCount.toLocaleString()} {props.labels.followers}
                </span>
              </Show>
            </div>
          </div>

          <div class="flex gap-2 shrink-0 max-sm:self-start">
            <Show
              when={props.followEnabled}
              fallback={
                <Button variant="secondary" size="sm" disabled title={props.labels.followSoon}>
                  {props.labels.follow}
                </Button>
              }
            >
              <Button
                variant={props.isFollowing ? "outline" : "secondary"}
                size="sm"
                disabled={props.isFollowPending}
                onClick={() => props.onFollow?.()}
              >
                {props.isFollowing ? props.labels.following : props.labels.follow}
              </Button>
            </Show>
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
          <ShopTrustSnapshot
            metrics={props.shop.metrics}
            labels={props.labels}
            showFollowers={props.followEnabled}
          />
        </div>
      </div>
    </section>
  );
};
