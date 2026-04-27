import { createSignal, createMemo, Show, ErrorBoundary } from "solid-js";
import { useI18n } from "~/i18n";
import { InlineErrorFallback } from "~/components/errors";
import { CubeIcon, PlusIcon, CheckCircleIcon, ClockIcon, ArchiveIcon } from "~/components/icons";

interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number;
  salePrice: number | null;
  inventoryCount: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  category: { id: string; slug: string; name: string } | null;
  tags: string[];
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const PRODUCTS: Product[] = [];

export default function PlantsPage() {
  const { t } = useI18n();

  const stats = createMemo(() => ({
    total: PRODUCTS.length,
    active: PRODUCTS.filter(p => p.status === "ACTIVE").length,
    draft: PRODUCTS.filter(p => p.status === "DRAFT").length,
    archived: PRODUCTS.filter(p => p.status === "ARCHIVED").length,
  }));

  return (
    <ErrorBoundary fallback={(err) => <InlineErrorFallback error={err} />}>
      <div class="space-y-6">
        {/* Header */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-forest-900 dark:text-white">
              {t("seller.products.types.plants")}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("seller.products.managePlantProducts")}
            </p>
          </div>
          <a
            href="/app/seller/products/new"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-lg transition-standard text-sm"
          >
            <PlusIcon class="h-4 w-4" />
            {t("seller.products.addPlant")}
          </a>
        </div>

        {/* Stats */}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-forest-800 rounded-xl p-4 border border-cream-200 dark:border-forest-700">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-forest-100 dark:bg-forest-700 rounded-lg">
                <CubeIcon class="h-5 w-5 text-forest-600 dark:text-forest-400" />
              </div>
              <div>
                <p class="text-2xl font-bold text-forest-900 dark:text-white">{stats().total}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{t("common.total")}</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-forest-800 rounded-xl p-4 border border-cream-200 dark:border-forest-700">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircleIcon class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p class="text-2xl font-bold text-forest-900 dark:text-white">{stats().active}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{t("buyer.profile.status.active")}</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-forest-800 rounded-xl p-4 border border-cream-200 dark:border-forest-700">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <ClockIcon class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p class="text-2xl font-bold text-forest-900 dark:text-white">{stats().draft}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{t("seller.shop.myShop.status.draft.label")}</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-forest-800 rounded-xl p-4 border border-cream-200 dark:border-forest-700">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <ArchiveIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p class="text-2xl font-bold text-forest-900 dark:text-white">{stats().archived}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{t("common.archived")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <Show when={PRODUCTS.length === 0}>
          <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 p-12 text-center">
            <CubeIcon class="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-forest-900 dark:text-white mb-2">
              {t("seller.products.noPlantsYet")}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {t("seller.products.startSellingPlants")}
            </p>
            <a
              href="/app/seller/products/new"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-lg transition-standard text-sm"
            >
              <PlusIcon class="h-4 w-4" />
              {t("seller.products.addYourFirstPlant")}
            </a>
          </div>
        </Show>
      </div>
    </ErrorBoundary>
  );
}
