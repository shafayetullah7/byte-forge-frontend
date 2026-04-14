import Card from "~/components/ui/Card";
import type { ShopAddress } from "~/lib/api/endpoints/seller-shop.api";

interface AddressCardProps {
  address: ShopAddress | null;
}

export default function AddressCard(props: AddressCardProps) {
  const address = props.address;
  const enTranslation = address?.translations?.find(t => t.locale === "en");
  const bnTranslation = address?.translations?.find(t => t.locale === "bn");

  const hasAddress = enTranslation || bnTranslation;

  return (
    <Card title="Shop Address" class="mb-6">
      {hasAddress ? (
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* English Address */}
          <div class="space-y-3">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🇬🇧</span>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100">
                English Address
              </h4>
            </div>

            {enTranslation ? (
              <div class="space-y-2">
                {enTranslation.street && (
                  <p class="text-gray-700 dark:text-gray-300">
                    {enTranslation.street}
                  </p>
                )}
                {enTranslation.district && enTranslation.division && (
                  <p class="text-gray-700 dark:text-gray-300">
                    {enTranslation.district}, {enTranslation.division}
                  </p>
                )}
                {enTranslation.country && (
                  <p class="text-gray-700 dark:text-gray-300 font-medium">
                    {enTranslation.country}
                  </p>
                )}
                {address?.postalCode && (
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    Postal Code: {address.postalCode}
                  </p>
                )}
              </div>
            ) : (
              <p class="text-gray-400 dark:text-gray-500 text-sm italic">
                No English address provided
              </p>
            )}

            {/* Map Link & GPS */}
            {(address?.googleMapsLink || (address?.latitude && address?.longitude)) && (
              <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                {address.googleMapsLink && (
                  <a
                    href={address.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300 transition-colors text-sm"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Open in Google Maps
                  </a>
                )}
                {address?.latitude && address?.longitude && (
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                    {address.latitude}, {address.longitude}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bengali Address */}
          <div class="space-y-3">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🇧🇩</span>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100">
                Bengali Address (বাংলা)
              </h4>
            </div>

            {bnTranslation ? (
              <div class="space-y-2" dir="auto">
                {bnTranslation.street && (
                  <p class="text-gray-700 dark:text-gray-300">
                    {bnTranslation.street}
                  </p>
                )}
                {bnTranslation.district && bnTranslation.division && (
                  <p class="text-gray-700 dark:text-gray-300">
                    {bnTranslation.district}, {bnTranslation.division}
                  </p>
                )}
                {bnTranslation.country && (
                  <p class="text-gray-700 dark:text-gray-300 font-medium">
                    {bnTranslation.country}
                  </p>
                )}
              </div>
            ) : (
              <p class="text-gray-400 dark:text-gray-500 text-sm italic">
                কোন বাংলা ঠিকানা দেওয়া হয়নি
              </p>
            )}

            {/* Verification Badge */}
            {address?.isVerified && (
              <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-forest-100 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified Address
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div class="text-center py-8">
          <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="text-gray-400 dark:text-gray-500">
            No address information provided
          </p>
        </div>
      )}
    </Card>
  );
}
