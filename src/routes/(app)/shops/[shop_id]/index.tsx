import { useParams, A, createAsync } from "@solidjs/router";
import { Suspense } from "solid-js";
import { publicShopsApi, type PublicShop } from "~/lib/api/endpoints/public-shops";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { Button } from "~/components/ui/Button";

export default function ShopDetailPage() {
  const params = useParams();
  const shopData = createAsync(() => publicShopsApi.getById(params.shop_id));

  return (
    <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
      <SafeErrorBoundary
        fallback={(err, reset) => (
          <InlineErrorFallback error={err} reset={reset} label="shop details" />
        )}
      >
        <Suspense fallback={<div class="h-96 bg-cream-100 dark:bg-forest-800 animate-pulse" />}>
          {(() => {
            const shop = shopData();
            if (!shop) return <div>Shop not found</div>;

            return (
              <div>
                {/* Banner */}
                <div class="h-64 md:h-80 bg-gradient-to-r from-green-600 to-blue-600 dark:from-forest-700 dark:to-sage-700">
                  {shop.banner?.url ? (
                    <img
                      src={shop.banner.url}
                      alt={shop.name}
                      class="w-full h-full object-cover"
                    />
                  ) : (
                    <div class="w-full h-full flex items-center justify-center text-white/30">
                      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div class="max-w-7xl mx-auto px-4 py-12">
                  {/* Back Button */}
                  <div class="mb-8">
                    <A href="/shops" class="text-green-600 dark:text-sage-400 hover:underline">
                      ← Back to Shops
                    </A>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div class="md:col-span-2 space-y-6">
                      {/* Header */}
                      <div class="bg-white dark:bg-forest-800 rounded-2xl p-8 shadow-lg">
                        <div class="flex items-start gap-6">
                          {/* Logo */}
                          {shop.logo?.url ? (
                            <img
                              src={shop.logo.url}
                              alt={shop.name}
                              class="w-24 h-24 object-contain bg-white rounded-xl p-4 shadow-md"
                            />
                          ) : (
                            <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                              </svg>
                            </div>
                          )}

                          {/* Name & Location */}
                          <div class="flex-1">
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                              {shop.name}
                            </h1>
                            <div class="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              {shop.address || `${shop.city}, ${shop.division}`}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {shop.description && (
                          <div class="mt-6 pt-6 border-t border-gray-100 dark:border-forest-700">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                              About
                            </h2>
                            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {shop.description}
                            </p>
                          </div>
                        )}

                        {/* Business Hours */}
                        {shop.businessHours && (
                          <div class="mt-6 pt-6 border-t border-gray-100 dark:border-forest-700">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                              Business Hours
                            </h2>
                            <p class="text-gray-700 dark:text-gray-300">
                              {shop.businessHours}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div class="space-y-6">
                      {/* Contact Card */}
                      <div class="bg-white dark:bg-forest-800 rounded-2xl p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          Location
                        </h3>
                        <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                          <div class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 mt-0.5 flex-shrink-0">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <div>
                              <div class="font-medium text-gray-900 dark:text-gray-100">{shop.division}</div>
                              <div>{shop.city}</div>
                            </div>
                          </div>
                        </div>

                        <div class="mt-6">
                          <Button variant="primary" class="w-full" size="lg">
                            Visit Shop
                          </Button>
                        </div>
                      </div>

                      {/* Share Card */}
                      <div class="bg-white dark:bg-forest-800 rounded-2xl p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          Share
                        </h3>
                        <div class="flex gap-2">
                          <Button variant="outline" size="md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>
                          </Button>
                          <Button variant="outline" size="md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.38v2.1H5v4.48h4.5v13.48h5v-13.48h3.78l.75-4.5z"/>
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </Suspense>
      </SafeErrorBoundary>
    </div>
  );
}
