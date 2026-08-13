import { Component, For, Show, createEffect, createMemo } from "solid-js";
import { Title } from "@solidjs/meta";
import { A, createAsync, useAction, useSubmission, type RouteDefinition } from "@solidjs/router";
import { HeartIcon, LeafIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { formatPageTitle } from "~/lib/seo/meta";
import { getWishlist } from "~/lib/api/endpoints/buyer/wishlist.api";
import { removeFromWishlistAction } from "~/lib/api/endpoints/buyer/wishlist.actions";
import { toaster } from "~/components/ui/Toast";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import {
  FavoritesEmptyState,
  FavoritesSkeleton,
  WishlistCard,
} from "./components";

export const route = {
  preload: () => getWishlist(),
} satisfies RouteDefinition;

const Favorites: Component = () => {
  const { t } = useI18n();
  const wishlist = createAsync(() => getWishlist(), { deferStream: true });
  const items = () => wishlist()?.data ?? [];
  const itemCount = createMemo(() => items().length);

  const removeTrigger = useAction(removeFromWishlistAction);
  const removeSubmission = useSubmission(removeFromWishlistAction);

  createEffect(() => {
    if (removeSubmission.result?.success === true) {
      toaster.success(t("buyer.favorites.removed"));
    } else if (removeSubmission.result?.success === false) {
      toaster.error(removeSubmission.result.error?.message ?? t("common.error"));
    }
  });

  const handleRemove = (variantId: string) => {
    removeTrigger({ variantId });
  };

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label={t("buyer.favorites.title")} />
      )}
    >
      <Title>{formatPageTitle(t("buyer.favorites.title"))}</Title>

      <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
        <section class="bg-linear-to-br from-forest-400 via-forest-500 to-forest-600 dark:from-forest-600 dark:via-forest-700 dark:to-sage-700 text-white">
          <div class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div class="flex items-start gap-4">
                <div class="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20">
                  <HeartIcon class="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                    {t("buyer.favorites.title")}
                  </h1>
                  <p class="text-base text-white/90 max-w-xl">
                    {t("buyer.favorites.subtitle")}
                  </p>
                </div>
              </div>
              <Show when={itemCount() > 0}>
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-semibold">
                  <HeartIcon class="w-4 h-4" />
                  {t("buyer.favorites.itemCount", itemCount())}
                </div>
              </Show>
            </div>
          </div>
        </section>

        <section class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <Show when={wishlist() !== undefined}>
            <Show
              when={itemCount() > 0}
              fallback={<FavoritesEmptyState />}
            >
              <div class="mb-6 flex justify-end">
                <A
                  href="/plants"
                  class="inline-flex items-center gap-2 text-sm font-semibold text-forest-600 dark:text-forest-400 hover:underline w-fit"
                >
                  <LeafIcon class="w-4 h-4" />
                  {t("buyer.favorites.browsePlants")}
                </A>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <For each={items()}>
                  {(item) => (
                    <WishlistCard
                      item={item}
                      onRemove={handleRemove}
                      removing={removeSubmission.pending}
                    />
                  )}
                </For>
              </div>
            </Show>
          </Show>

          <Show when={wishlist() === undefined}>
            <FavoritesSkeleton />
          </Show>
        </section>
      </div>
    </SafeErrorBoundary>
  );
};

export default Favorites;
