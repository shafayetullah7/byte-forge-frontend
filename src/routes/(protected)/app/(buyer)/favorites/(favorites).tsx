import { Component } from "solid-js";
import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { HeartIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { formatPageTitle } from "~/lib/seo/meta";

const Favorites: Component = () => {
  const { t } = useI18n();

  return (
    <>
      <Title>{formatPageTitle(t("buyer.favorites.title"))}</Title>
      <div class="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div class="w-16 h-16 rounded-2xl bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center mx-auto mb-6">
          <HeartIcon class="w-8 h-8 text-forest-600 dark:text-forest-400" />
        </div>
        <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50 mb-3">
          {t("buyer.favorites.comingSoonTitle")}
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mb-8">
          {t("buyer.favorites.comingSoonDescription")}
        </p>
        <A
          href="/plants"
          class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold transition-colors"
        >
          {t("buyer.favorites.browsePlants")}
        </A>
      </div>
    </>
  );
};

export default Favorites;
