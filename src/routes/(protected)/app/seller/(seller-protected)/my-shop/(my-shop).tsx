import { createAsync, A } from "@solidjs/router";
import { Suspense, createMemo, createSignal } from "solid-js";
import Button from "~/components/ui/Button";
import { sellerShopApi } from "~/lib/api/endpoints/seller-shop.api";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import ShopHeader from "~/components/seller/ShopHeader";
import ShopStatusCard from "~/components/seller/ShopStatusCard";
import BilingualInfoCard from "~/components/seller/BilingualInfoCard";
import ContactInfoCard from "~/components/seller/ContactInfoCard";
import AddressCard from "~/components/seller/AddressCard";
import { useI18n } from "~/i18n";
import type { AddressFormData } from "~/components/seller/AddressEditModal";

export default function MyShopPage() {
  const { t } = useI18n();
  const [isSaving, setIsSaving] = createSignal(false);
  const shopData = createAsync(() => sellerShopApi.getMyShop());
  const verificationData = createAsync(() => sellerShopApi.getVerificationStatus());

  const statusConfig = createMemo(() => {
    const verificationStatus = verificationData()?.status;
    const shopStatus = shopData()?.status;
    const status = verificationStatus ?? shopStatus ?? "DRAFT";
    
    const configs: Record<string, { color: "default" | "forest" | "sage" | "terracotta" | "cream"; label: string; description: string }> = {
      DRAFT: {
        color: "cream",
        label: t("seller.shop.myShop.status.draft.label"),
        description: t("seller.shop.myShop.status.draft.description"),
      },
      PENDING_VERIFICATION: {
        color: "sage",
        label: t("seller.shop.myShop.status.pendingReview.label"),
        description: t("seller.shop.myShop.status.pendingReview.description"),
      },
      APPROVED: {
        color: "forest",
        label: t("seller.shop.myShop.status.approved.label"),
        description: t("seller.shop.myShop.status.approved.description"),
      },
      ACTIVE: {
        color: "forest",
        label: t("seller.shop.myShop.status.active.label"),
        description: t("seller.shop.myShop.status.active.description"),
      },
      REJECTED: {
        color: "terracotta",
        label: t("seller.shop.myShop.status.rejected.label"),
        description: verificationData()?.rejectionReason || t("seller.shop.myShop.status.rejected.description"),
      },
      SUSPENDED: {
        color: "terracotta",
        label: t("seller.shop.myShop.status.suspended.label"),
        description: t("seller.shop.myShop.status.suspended.description"),
      },
    };

    return configs[status];
  });

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="my shop" />
      )}
    >
      <div class="min-h-screen py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div class="mb-8">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center shadow-md shadow-terracotta-500/20">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {t("seller.shop.myShop.pageTitle")}
                </h1>
                <p class="text-base text-gray-600 dark:text-gray-400">
                  {t("seller.shop.myShop.pageSubtitle")}
                </p>
              </div>
            </div>
          </div>

          <Suspense fallback={
            <div class="space-y-8">
              <div class="h-72 bg-white/50 dark:bg-forest-900/50 backdrop-blur-sm rounded-2xl animate-pulse" />
              <div class="h-32 bg-white/50 dark:bg-forest-900/50 backdrop-blur-sm rounded-2xl animate-pulse" />
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="h-64 bg-white/50 dark:bg-forest-900/50 backdrop-blur-sm rounded-2xl animate-pulse" />
                <div class="h-64 bg-white/50 dark:bg-forest-900/50 backdrop-blur-sm rounded-2xl animate-pulse" />
              </div>
            </div>
          }>
            {(() => {
              const shop = shopData();
              const verification = verificationData();

              if (!shop) {
                return (
                  <div class="bg-white dark:bg-forest-800 rounded-2xl p-12 text-center shadow-xl border border-gray-200 dark:border-gray-700">
                    <div class="flex flex-col items-center justify-center py-8">
                      <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center shadow-lg shadow-terracotta-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </div>
                      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        {t("seller.shop.myShop.noShopYet.title")}
                      </h2>
                      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                        {t("seller.shop.myShop.noShopYet.description")}
                      </p>
                      <A href="/seller/setup-shop">
                        <button class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                          {t("seller.shop.myShop.noShopYet.createButton")}
                        </button>
                      </A>
                    </div>
                  </div>
                );
              }

              const enTranslation = shop.translations?.find(t => t.locale === "en");
              const bnTranslation = shop.translations?.find(t => t.locale === "bn");

              const handleSaveAddress = async (data: AddressFormData) => {
                setIsSaving(true);
                try {
                  await sellerShopApi.updateAddress({
                    postalCode: data.postalCode,
                    latitude: data.latitude ? parseFloat(data.latitude) : undefined,
                    longitude: data.longitude ? parseFloat(data.longitude) : undefined,
                    googleMapsLink: data.googleMapsLink,
                    country: data.country,
                    division: data.division,
                    district: data.district,
                    street: data.street,
                    translations: {
                      country: data.bnCountry,
                      division: data.bnDivision,
                      district: data.bnDistrict,
                      street: data.bnStreet,
                    },
                  });
                  // Reload shop data
                  window.location.reload();
                } catch (error) {
                  console.error("Failed to update address:", error);
                  throw error;
                } finally {
                  setIsSaving(false);
                }
              };

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
                    shopName={enTranslation?.name ?? ""}
                    bengaliName={bnTranslation?.name ?? ""}
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
                  <AddressCard 
                    address={shop.address}
                    onSave={handleSaveAddress}
                  />

                   {/* Quick Actions Grid */}
                   <div class="bg-white dark:bg-forest-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                     <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                       <div class="flex items-center gap-3">
                         <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center shadow-md shadow-terracotta-500/20">
                           <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                           </svg>
                         </div>
                         <div>
                           <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                             {t("seller.shop.myShop.quickActions.title")}
                           </h3>
                           <p class="text-sm text-gray-500 dark:text-gray-400">
                             {t("seller.shop.myShop.quickActions.subtitle")}
                           </p>
                         </div>
                       </div>
                     </div>
                     
                     <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                       <A href="/seller/my-shop/verification">
                         <button class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-forest-500 dark:hover:border-forest-500 hover:bg-forest-50 dark:hover:bg-forest-900/20 transition-all group text-left">
                           <div class="flex items-center gap-3">
                             <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center flex-shrink-0">
                               <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                             </div>
                             <span class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">{t("seller.shop.myShop.quickActions.verificationStatus")}</span>
                           </div>
                         </button>
                       </A>

                       {shop.status === "ACTIVE" && (
                         <A href="/seller/products">
                           <button class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-terracotta-500 dark:hover:border-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-all group text-left">
                             <div class="flex items-center gap-3">
                               <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center flex-shrink-0">
                                 <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                 </svg>
                               </div>
                               <span class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400 transition-colors">{t("seller.shop.myShop.quickActions.manageProducts")}</span>
                             </div>
                           </button>
                         </A>
                       )}

                       {shop.status === "APPROVED" && (
                         <div class="w-full p-4 rounded-xl border-2 border-sage-500 bg-sage-50 dark:bg-sage-900/20 text-left">
                           <div class="flex items-center gap-3">
                             <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center flex-shrink-0">
                               <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                             </div>
                             <span class="font-semibold text-sage-700 dark:text-sage-400">{t("seller.shop.myShop.quickActions.shopApproved")}</span>
                           </div>
                         </div>
                       )}

                       <A href={shop.slug ? `/shop/${shop.slug}` : "/"}>
                         <button class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-terracotta-500 dark:hover:border-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-all group text-left">
                           <div class="flex items-center gap-3">
                             <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center flex-shrink-0">
                               <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                               </svg>
                             </div>
                             <span class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400 transition-colors">{t("seller.shop.myShop.quickActions.viewPublicPage")}</span>
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
