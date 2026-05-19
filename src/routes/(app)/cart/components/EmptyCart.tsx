import type { Component } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { Button } from "~/components/ui";
import { ShoppingBagIcon } from "~/components/icons";

export const EmptyCart: Component = () => {
  const { t } = useI18n();
  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-12 text-center shadow-sm">
      <div class="w-20 h-20 rounded-full bg-cream-100 dark:bg-forest-700 flex items-center justify-center mx-auto mb-6">
        <ShoppingBagIcon class="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h2 class="text-2xl font-bold text-forest-800 dark:text-cream-50 mb-2">
        {t("cart.emptyTitle")}
      </h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {t("cart.emptyDescription")}
      </p>
      <A href="/plants">
        <Button variant="primary" size="lg">
          {t("cart.browsePlants")}
        </Button>
      </A>
    </div>
  );
};
