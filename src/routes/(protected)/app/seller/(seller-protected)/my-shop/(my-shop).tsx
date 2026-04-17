import { createAsync, A, action, useAction, useSubmission, type RouteDefinition } from "@solidjs/router";
import { Suspense, createMemo, createEffect, createSignal } from "solid-js";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import ShopHeader from "~/components/seller/ShopHeader";
import ShopStatusCard from "~/components/seller/ShopStatusCard";
import BilingualInfoCard from "~/components/seller/BilingualInfoCard";
import ContactInfoCard from "~/components/seller/ContactInfoCard";
import AddressCard from "~/components/seller/AddressCard";
import { useI18n } from "~/i18n";
import { toaster } from "~/components/ui/Toast";
import { getShop, getShopStatus, refetchShop } from "~/lib/context/shop-context";
import { sellerShopApi } from "~/lib/api/endpoints/seller-shop.api";
import type { UpdateAddressDto } from "~/lib/api/endpoints/seller-shop.api";
import { ShopIcon, PlusIcon, BoltIcon, CheckCircleIcon, PackageIcon, EyeIcon } from "~/components/icons";

/**
 * Update Address Action
 * Handles server-side address update with proper error handling
 */
const updateAddressAction = action(async (data: UpdateAddressDto) => {
  "use server";
  try {
    await sellerShopApi.updateAddress(data);
    return { success: true };
  } catch (error) {
    const apiError = error as any;
    return {
      success: false,
      error: {
        message: apiError.message || "Failed to update address",
        statusCode: apiError.statusCode,
        validationErrors: apiError.response?.validationErrors || (apiError as any).validationErrors,
      },
    };
  }
}, "update-address-action");

export const route = {
  preload: () => getShop(),
} satisfies RouteDefinition;

export default function MyShopPage() {
  const { t, locale } = useI18n();
  const [shouldCloseModal, setShouldCloseModal] = createSignal(false);
  const addressTrigger = useAction(updateAddressAction);
  const addressSubmission = useSubmission(updateAddressAction);
  const shopData = createAsync(() => getShop());
  const verificationData = createAsync(() => getShopStatus());

  // Reset close signal when modal is manually closed
  const handleModalClose = () => {
    setShouldCloseModal(false);
  };

  // Helper to map field paths to user-friendly labels
  const mapFieldToLabel = (field: string): string => {
    const fieldLabels: Record<string, { en: string; bn: string }> = {
      'translations.en.street': { en: 'Street (English)', bn: 'রাস্তা (ইংরেজি)' },
      'translations.bn.street': { en: 'Street (Bengali)', bn: 'রাস্তা (বাংলা)' },
      'translations.en.country': { en: 'Country (English)', bn: 'দেশ (ইংরেজি)' },
      'translations.bn.country': { en: 'Country (Bengali)', bn: 'দেশ (বাংলা)' },
      'translations.en.division': { en: 'Division (English)', bn: 'বিভাগ (ইংরেজি)' },
      'translations.bn.division': { en: 'Division (Bengali)', bn: 'বিভাগ (বাংলা)' },
      'translations.en.district': { en: 'District (English)', bn: 'জেলা (ইংরেজি)' },
      'translations.bn.district': { en: 'District (Bengali)', bn: 'জেলা (বাংলা)' },
      'postalCode': { en: 'Postal Code', bn: 'পোস্টাল কোড' },
      'latitude': { en: 'Latitude', bn: 'অক্ষাংশ' },
      'longitude': { en: 'Longitude', bn: 'দ্রাঘিমাংশ' },
      'googleMapsLink': { en: 'Google Maps Link', bn: 'গুগল ম্যাপস লিঙ্ক' },
    };
    
    const label = fieldLabels[field];
    if (!label) return field;
    
    // Return label in current language
    return locale() === 'bn' ? label.bn : label.en;
  };

  // Handle address update error (only once, not duplicated)
  createEffect(() => {
    if (addressSubmission.result?.success === false && addressSubmission.result?.error) {
      console.log("Error detected - showing toast, keeping modal open");
      const errorData = addressSubmission.result.error as any;
      
      // Check if it's a validation error with field details
      if (errorData.validationErrors && errorData.validationErrors.length > 0) {
        // Show specific field errors
        const fieldErrors = errorData.validationErrors.map((err: any) => {
          const fieldName = mapFieldToLabel(err.field);
          return `${fieldName}: ${err.message}`;
        }).join('\n');
        
        toaster.error(fieldErrors);
      } else {
        // Generic error
        const message = errorData.message || "seller.shop.myShop.addressUpdateFailed";
        const displayMessage = message.includes(".") ? t(message) : message;
        toaster.error(displayMessage);
      }
    }
  });

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
        description: verificationData()?.rejectionReason ?? t("seller.shop.myShop.status.rejected.description"),
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
                <ShopIcon class="w-6 h-6 text-white" />
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
                        <ShopIcon class="w-11 h-11 text-white" />
                      </div>
                      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        {t("seller.shop.myShop.noShopYet.title")}
                      </h2>
                      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                        {t("seller.shop.myShop.noShopYet.description")}
                      </p>
                      <A href="/seller/setup-shop">
                        <button class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all">
                          <PlusIcon class="w-5 h-5" />
                          {t("seller.shop.myShop.noShopYet.createButton")}
                        </button>
                      </A>
                    </div>
                  </div>
                );
              }

              const enTranslation = shop.translations?.find(t => t.locale === "en");
              const bnTranslation = shop.translations?.find(t => t.locale === "bn");

  const handleSaveAddress = async (data: UpdateAddressDto) => {
    console.log("handleSaveAddress called with:", data);
    
    // Clean up empty strings to undefined for optional fields
    const cleanedData: UpdateAddressDto = {
      postalCode: data.postalCode?.trim() || undefined,
      latitude: data.latitude?.trim() || undefined,
      longitude: data.longitude?.trim() || undefined,
      googleMapsLink: data.googleMapsLink?.trim() || undefined,
      translations: data.translations,
    };
    
    console.log("Sending cleaned data:", cleanedData);
    
    // Trigger the server action and await it
    const result = await addressTrigger(cleanedData);
    console.log("addressTrigger completed with result:", result);
    
    // Return result so AddressEditModal knows if it succeeded
    return result;
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
                    isSaving={addressSubmission.pending}
                    shouldClose={shouldCloseModal()}
                    onClose={handleModalClose}
                  />

                   {/* Quick Actions Grid */}
                   <div class="bg-white dark:bg-forest-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                     <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                       <div class="flex items-center gap-3">
                         <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center shadow-md shadow-terracotta-500/20">
                           <BoltIcon class="w-5 h-5 text-white" />
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
                                 <CheckCircleIcon class="w-4 h-4 text-white" />
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
                                   <PackageIcon class="w-4 h-4 text-white" />
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
                                 <CheckCircleIcon class="w-4 h-4 text-white" />
                               </div>
                               <span class="font-semibold text-sage-700 dark:text-sage-400">{t("seller.shop.myShop.quickActions.shopApproved")}</span>
                             </div>
                           </div>
                         )}

                         <A href={shop.slug ? `/shop/${shop.slug}` : "/"}>
                           <button class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-terracotta-500 dark:hover:border-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-all group text-left">
                             <div class="flex items-center gap-3">
                               <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center flex-shrink-0">
                                 <EyeIcon class="w-4 h-4 text-white" />
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
