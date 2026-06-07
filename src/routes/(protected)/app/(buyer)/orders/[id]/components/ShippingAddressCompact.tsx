import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import type { OrderAddressDetail } from "~/lib/api/types/order.types";
import { MapPinIcon, PackageIcon } from "~/components/icons";

export function ShippingAddressCompact(props: { address: OrderAddressDetail }) {
  const { t } = useI18n();

  const addr = props.address;

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
      <div class="px-5 py-3 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <MapPinIcon class="w-4 h-4 text-gray-400" />
          {t("buyer.orders.details.shippingAddress")}
        </h3>
      </div>
      <div class="p-5 space-y-3">
        {/* Recipient & Phone */}
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {addr.recipientName}
            </p>
            {addr.companyName && (
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {addr.companyName}
              </p>
            )}
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {addr.phone}
          </span>
        </div>

        {/* Divider */}
        <div class="h-px bg-gray-100 dark:bg-forest-700" />

        {/* Address Lines */}
        <div class="space-y-1">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            {addr.addressLine1}
          </p>
          {addr.addressLine2 && (
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {addr.addressLine2}
            </p>
          )}
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {addr.city}
            {addr.state ? `, ${addr.state}` : ""}
            {addr.postalCode ? ` - ${addr.postalCode}` : ""}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {addr.country}
          </p>
        </div>

        {/* Delivery Instructions */}
        <Show when={addr.deliveryInstructions}>
          {(instructions) => (
            <div class="flex items-start gap-2 bg-cream-50 dark:bg-cream-900/20 rounded-lg p-3">
              <PackageIcon class="w-3.5 h-3.5 text-cream-600 dark:text-cream-400 flex-shrink-0 mt-0.5" />
              <p class="text-xs text-cream-700 dark:text-cream-300">
                {instructions()}
              </p>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
}
