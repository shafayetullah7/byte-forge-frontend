import { createSignal, Show, createEffect } from "solid-js";
import { useI18n } from "~/i18n";
import type { ShopAddress } from "~/lib/api/endpoints/seller-shop.api";
import AddressEditModal from "./AddressEditModal";

interface AddressCardProps {
  address: ShopAddress | null;
  onSave?: (data: any) => Promise<any>;
  isSaving?: boolean;
  shouldClose?: boolean;
  onClose?: () => void;
}

export default function AddressCard(props: AddressCardProps) {
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const address = props.address;
  const enTranslation = address?.translations?.find((t) => t.locale === "en");
  const bnTranslation = address?.translations?.find((t) => t.locale === "bn");

  const hasAddress = enTranslation || bnTranslation;

  // Close modal when parent signals (success)
  createEffect(() => {
    if (props.shouldClose) {
      setIsModalOpen(false);
      // Notify parent to reset the signal immediately
      if (props.onClose) {
        props.onClose();
      }
    }
  });

  // Reset shouldClose when modal opens (prevents immediate close on reopen)
  createEffect(() => {
    if (isModalOpen() && props.shouldClose) {
      console.log("AddressCard: Modal opened but shouldClose=true, resetting");
      if (props.onClose) {
        props.onClose();
      }
    }
  });

  const handleEditClick = (e: MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleSave = async (data: AddressFormData) => {
    if (props.onSave) {
      const result = await props.onSave(data);
      console.log("AddressCard handleSave result:", result);
      return result;
    }
  };

  return (
    <>
      <div class="bg-white dark:bg-forest-800 rounded-2xl p-6 sm:p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Card Header */}
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center shadow-md shadow-sage-500/20">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t("seller.shop.myShop.shopAddress.title")}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {t("seller.shop.myShop.shopAddress.subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={handleEditClick}
            class="p-2 text-gray-400 hover:text-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 rounded-lg transition-all"
            title={t("common.edit")}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        <Show when={hasAddress} fallback={
          <div class="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
            <div class="w-14 h-14 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg class="w-7 h-7 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p class="text-gray-600 dark:text-gray-400 font-medium text-sm text-center">
              {t("seller.shop.myShop.shopAddress.noAddress")}
            </p>
          </div>
        }>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* English Address */}
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
                <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 text-white text-xs font-bold">
                  EN
                </div>
                <h4 class="font-bold text-gray-900 dark:text-gray-100">
                  {t("seller.shop.myShop.shopAddress.englishAddress")}
                </h4>
              </div>

              <Show when={enTranslation} fallback={
                <p class="text-gray-400 dark:text-gray-500 text-sm italic">
                  {t("seller.shop.myShop.shopAddress.noEnglishAddress")}
                </p>
              }>
                <div class="space-y-3">
                  <Show when={enTranslation?.street}>
                    <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {enTranslation?.street}
                    </p>
                  </Show>
                  <Show when={enTranslation?.district && enTranslation?.division}>
                    <p class="text-gray-700 dark:text-gray-300 text-sm">
                      {enTranslation?.district}, {enTranslation?.division}
                    </p>
                  </Show>
                  <Show when={enTranslation?.country}>
                    <p class="text-gray-900 dark:text-gray-100 font-semibold text-sm">
                      {enTranslation?.country}
                    </p>
                  </Show>
                  <Show when={address?.postalCode}>
                    <div class="flex items-center gap-2 pt-2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <span class="text-gray-600 dark:text-gray-400 text-xs font-medium">
                        {t("seller.shop.myShop.shopAddress.postalCode")}: {address?.postalCode}
                      </span>
                    </div>
                  </Show>

                  {/* Map Link */}
                  <Show when={address?.googleMapsLink}>
                    <a
                      href={address?.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300 transition-colors text-sm mt-3"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t("seller.shop.myShop.shopAddress.openInGoogleMaps")}
                    </a>
                  </Show>

                  {/* GPS Coordinates */}
                  <Show when={address?.latitude && address?.longitude}>
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-2">
                      {address?.latitude}, {address?.longitude}
                    </p>
                  </Show>
                </div>
              </Show>
            </div>

            {/* Bengali Address */}
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
                <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-white text-xs font-bold">
                  বা
                </div>
                <h4 class="font-bold text-gray-900 dark:text-gray-100">
                  {t("seller.shop.myShop.shopAddress.bengaliAddress")}
                </h4>
              </div>

              <Show when={bnTranslation} fallback={
                <p class="text-gray-400 dark:text-gray-500 text-sm italic">
                  {t("seller.shop.myShop.shopAddress.noBengaliAddress")}
                </p>
              }>
                <div class="space-y-3" dir="auto">
                  <Show when={bnTranslation?.street}>
                    <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {bnTranslation?.street}
                    </p>
                  </Show>
                  <Show when={bnTranslation?.district && bnTranslation?.division}>
                    <p class="text-gray-700 dark:text-gray-300 text-sm">
                      {bnTranslation?.district}, {bnTranslation?.division}
                    </p>
                  </Show>
                  <Show when={bnTranslation?.country}>
                    <p class="text-gray-900 dark:text-gray-100 font-semibold text-sm">
                      {bnTranslation?.country}
                    </p>
                  </Show>
                </div>
              </Show>

              {/* Verification Badge */}
              <Show when={address?.isVerified}>
                <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-forest-100 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400 shadow-sm">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("seller.shop.myShop.shopAddress.verifiedAddress")}
                  </span>
                </div>
              </Show>
            </div>
          </div>
        </Show>
      </div>

      {/* Edit Address Modal */}
      <AddressEditModal
        isOpen={isModalOpen()}
        onClose={() => {
          setIsModalOpen(false);
          props.onClose?.();
        }}
        onSave={handleSave}
        address={address}
        isSaving={props.isSaving || false}
      />
    </>
  );
}
