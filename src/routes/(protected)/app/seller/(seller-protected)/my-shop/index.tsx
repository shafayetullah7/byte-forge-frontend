import { createAsync, A } from "@solidjs/router";
import { Suspense, createMemo } from "solid-js";
import Button from "~/components/ui/Button";
import { sellerShopApi } from "~/lib/api/endpoints/seller-shop.api";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import ShopHeader from "~/components/seller/ShopHeader";
import ShopStatusCard from "~/components/seller/ShopStatusCard";
import BilingualInfoCard from "~/components/seller/BilingualInfoCard";
import ContactInfoCard from "~/components/seller/ContactInfoCard";
import AddressCard from "~/components/seller/AddressCard";

export default function MyShopPage() {
  const shopData = createAsync(() => sellerShopApi.getMyShop());
  const verificationData = createAsync(() => sellerShopApi.getVerificationStatus());

  const statusConfig = createMemo(() => {
    const status = verificationData()?.status || shopData()?.status;
    
    const configs: Record<string, { color: "default" | "forest" | "sage" | "terracotta" | "cream"; label: string; description: string }> = {
      DRAFT: {
        color: "cream",
        label: "Draft",
        description: "Shop not yet submitted for verification",
      },
      PENDING_VERIFICATION: {
        color: "sage",
        label: "Pending Review",
        description: "Submitted for admin review",
      },
      APPROVED: {
        color: "forest",
        label: "Approved",
        description: "Ready to activate your shop",
      },
      ACTIVE: {
        color: "forest",
        label: "Active",
        description: "Live and visible to customers",
      },
      REJECTED: {
        color: "terracotta",
        label: "Rejected",
        description: verificationData()?.rejectionReason || "Needs changes",
      },
      SUSPENDED: {
        color: "terracotta",
        label: "Suspended",
        description: "Contact admin for assistance",
      },
    };

    return configs[status || "DRAFT"];
  });

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="my shop" />
      )}
    >
      <div class="min-h-screen bg-gradient-to-br from-cream-50 via-terracotta-50/30 to-forest-50/30 dark:from-gray-900 dark:via-forest-900/50 dark:to-gray-900 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div class="mb-8">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  My Shop
                </h1>
                <p class="text-base text-gray-600 dark:text-gray-400">
                  Manage your shop information and start selling
                </p>
              </div>
              <div class="flex gap-3">
                <A href="/seller/products">
                  <Button variant="outline" size="md">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Products
                  </Button>
                </A>
                <A href="/seller/my-shop/edit">
                  <Button variant="primary" size="md">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Shop
                  </Button>
                </A>
              </div>
            </div>
          </div>

          <Suspense fallback={<div class="h-96 bg-white/50 dark:bg-forest-900/50 backdrop-blur-sm rounded-2xl animate-pulse" />}>
            {(() => {
              const shop = shopData();
              const verification = verificationData();

              if (!shop) {
                return (
                  <div class="bg-white dark:bg-forest-800 rounded-2xl p-12 text-center shadow-xl border border-gray-200 dark:border-gray-700">
                    <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-terracotta-500 to-forest-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                      No Shop Yet
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                      Create your first shop to start selling on ByteForge. It only takes a few minutes!
                    </p>
                    <A href="/seller/setup-shop">
                      <button class="px-8 py-4 bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create Your Shop
                      </button>
                    </A>
                  </div>
                );
              }

              const enTranslation = shop.translations?.find(t => t.locale === "en");
              const bnTranslation = shop.translations?.find(t => t.locale === "bn");

              return (
                <div class="space-y-8">
                  {/* Header with Logo & Banner */}
                  <ShopHeader
                    logo={shop.logo}
                    banner={shop.banner}
                    slug={shop.slug}
                  />

                  {/* Status Card */}
                  <ShopStatusCard
                    shopName={enTranslation?.name}
                    bengaliName={bnTranslation?.name}
                    status={shop.status}
                    slug={shop.slug}
                    statusConfig={statusConfig()}
                  />

                  {/* Shop Information - Bilingual */}
                  <BilingualInfoCard
                    enData={{
                      name: enTranslation?.name,
                      description: enTranslation?.description,
                      businessHours: enTranslation?.businessHours,
                    }}
                    bnData={{
                      name: bnTranslation?.name,
                      description: bnTranslation?.description,
                      businessHours: bnTranslation?.businessHours,
                    }}
                  />

                  {/* Contact Information */}
                  <ContactInfoCard contact={shop.contact} />

                  {/* Address */}
                  <AddressCard address={shop.address} />

                  {/* Quick Actions Grid */}
                  <div class="bg-white dark:bg-forest-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                          Quick Actions
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Manage your shop with ease
                        </p>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <A href="/seller/my-shop/edit">
                        <button class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-terracotta-500 dark:hover:border-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-all group text-left">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </div>
                            <span class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400">Edit Shop Info</span>
                          </div>
                        </button>
                      </A>

                      <A href="/seller/my-shop/verification">
                        <button class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-forest-500 dark:hover:border-forest-500 hover:bg-forest-50 dark:hover:bg-forest-900/20 transition-all group text-left">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-forest-600 dark:group-hover:text-forest-400">Verification</span>
                          </div>
                        </button>
                      </A>

                      {shop.status === "APPROVED" && (
                        <A href="/seller/my-shop">
                          <button class="w-full p-4 rounded-xl border-2 border-terracotta-500 bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 transition-all group text-left shadow-lg">
                            <div class="flex items-center gap-3">
                              <div class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <span class="font-semibold text-white">Activate Shop</span>
                            </div>
                          </button>
                        </A>
                      )}

                      {shop.status === "ACTIVE" && (
                        <A href="/seller/products">
                          <button class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-terracotta-500 dark:hover:border-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-all group text-left">
                            <div class="flex items-center gap-3">
                              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                              <span class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400">Manage Products</span>
                            </div>
                          </button>
                        </A>
                      )}

                      <A href="/seller/my-shop/edit">
                        <button class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-terracotta-500 dark:hover:border-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-all group text-left">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400">Update Branding</span>
                          </div>
                        </button>
                      </A>

                      <A href="/">
                        <button class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-terracotta-500 dark:hover:border-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-all group text-left">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            <span class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400">View Public Page</span>
                          </div>
                        </button>
                      </A>
                    </div>
                  </div>
                </div>
              );
            })()}
          </Suspense>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
