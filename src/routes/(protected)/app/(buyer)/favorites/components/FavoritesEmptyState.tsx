import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { HeartIcon, LeafIcon } from "~/components/icons";
import Button from "~/components/ui/Button";

const FavoritesEmptyState: Component = () => {
  const { t } = useI18n();

  return (
    <div class="relative overflow-hidden rounded-2xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 shadow-sm">
      <div class="absolute inset-0 bg-linear-to-br from-forest-50/80 via-transparent to-terracotta-50/40 dark:from-forest-900/40 dark:to-terracotta-900/10 pointer-events-none" />
      <div class="relative px-6 py-16 md:py-20 text-center">
        <div class="w-20 h-20 rounded-2xl bg-linear-to-br from-terracotta-100 to-forest-100 dark:from-terracotta-900/40 dark:to-forest-900/40 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <HeartIcon class="w-10 h-10 text-terracotta-500 dark:text-terracotta-400" />
        </div>
        <h2 class="text-xl md:text-2xl font-bold text-forest-800 dark:text-cream-50 mb-3">
          {t("buyer.favorites.emptyTitle")}
        </h2>
        <p class="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
          {t("buyer.favorites.emptyDescription")}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <A href="/plants">
            <Button variant="primary" size="lg" class="gap-2">
              <LeafIcon class="w-5 h-5" />
              {t("buyer.favorites.browsePlants")}
            </Button>
          </A>
          <A
            href="/shops"
            class="text-sm font-semibold text-forest-600 dark:text-forest-400 hover:underline"
          >
            {t("buyer.dashboard.quickActions.browseShops")}
          </A>
        </div>
      </div>
    </div>
  );
};

export default FavoritesEmptyState;
