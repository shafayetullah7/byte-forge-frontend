import { useI18n } from "~/i18n";
import { CubeIcon, PlusIcon } from "~/components/icons";

export default function FertilizerPage() {
  const { t } = useI18n();

  return (
    <div class="min-h-screen py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div class="mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-md shadow-forest-500/20">
                <CubeIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {t("seller.products.types.fertilizer")}
                </h1>
                <p class="text-base text-gray-600 dark:text-gray-400">
                  {t("seller.products.manageFertilizerProducts")}
                </p>
              </div>
            </div>
            <a
              href="/app/seller/products/new"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-600 hover:to-forest-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <PlusIcon class="w-5 h-5" />
              {t("seller.products.addFertilizer")}
            </a>
          </div>
        </div>

        {/* Empty State */}
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm">
          <CubeIcon class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t("seller.products.noFertilizersYet")}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            {t("seller.products.fertilizerManagementComingSoon")}
          </p>
          <a
            href="/app/seller/products/new"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-600 hover:to-forest-700 text-white rounded-xl font-semibold shadow-lg transition-all"
          >
            <PlusIcon class="w-5 h-5" />
            {t("seller.products.addYourFirstFertilizer")}
          </a>
        </div>
      </div>
    </div>
  );
}
