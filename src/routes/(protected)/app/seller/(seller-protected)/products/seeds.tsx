import { useI18n } from "~/i18n";
import { CubeIcon, PlusIcon } from "~/components/icons";

export default function SeedsPage() {
  const { t } = useI18n();

  return (
    <div class="min-h-screen py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div class="mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
                <CubeIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                  {t("seller.products.types.seeds")}
                </h1>
                <p class="text-base text-gray-600 dark:text-gray-400">
                  {t("seller.products.manageSeedProducts")}
                </p>
              </div>
            </div>
            <a
              href="/app/seller/products/new"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
            >
              <PlusIcon class="w-5 h-5" />
              {t("seller.products.addSeed")}
            </a>
          </div>
        </div>

        {/* Empty State */}
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 py-12 px-4 text-center shadow-sm">
          <CubeIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
            {t("seller.products.noSeedsYet")}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            {t("seller.products.seedManagementComingSoon")}
          </p>
          <a
            href="/app/seller/products/new"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
          >
            <PlusIcon class="w-5 h-5" />
            {t("seller.products.addYourFirstSeed")}
          </a>
        </div>
      </div>
    </div>
  );
}
