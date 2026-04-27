import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import { CubeIcon, PlusIcon } from "~/components/icons";

export default function SeedsPage() {
  const { t } = useI18n();

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-forest-900 dark:text-white">
            {t("seller.products.types.seeds")}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("seller.products.manageSeedProducts")}
          </p>
        </div>
        <a
          href="/app/seller/products/new"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-lg transition-standard text-sm"
        >
          <PlusIcon class="h-4 w-4" />
          {t("seller.products.addSeed")}
        </a>
      </div>

      <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 p-12 text-center">
        <CubeIcon class="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-forest-900 dark:text-white mb-2">
          {t("seller.products.noSeedsYet")}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {t("seller.products.seedManagementComingSoon")}
        </p>
        <a
          href="/app/seller/products/new"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-lg transition-standard text-sm"
        >
          <PlusIcon class="h-4 w-4" />
          {t("seller.products.addYourFirstSeed")}
        </a>
      </div>
    </div>
  );
}
