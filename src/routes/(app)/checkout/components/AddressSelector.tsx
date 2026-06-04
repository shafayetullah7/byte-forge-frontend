import { Component, For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import {
  MapPinIcon,
  CheckIcon,
  PlusIcon,
  PhoneIcon,
} from "~/components/icons";
import type { MockAddress } from "../mock-data";
import { A } from "@solidjs/router";

interface AddressSelectorProps {
  addresses: MockAddress[];
  selectedAddressId: string | null;
  onSelect: (id: string) => void;
}

const AddressSelector: Component<AddressSelectorProps> = (props) => {
  const { t } = useI18n();

  return (
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50">
          {t("checkout.shippingAddress")}
        </h2>
        <A
          href="/app/addresses/new"
          class="inline-flex items-center gap-1.5 text-sm text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 font-medium transition-colors"
        >
          <PlusIcon class="w-4 h-4" />
          {t("checkout.addNewAddress")}
        </A>
      </div>

      <Show
        when={props.addresses.length > 0}
        fallback={
          <div class="bg-cream-50 dark:bg-forest-800 rounded-xl border-2 border-dashed border-cream-300 dark:border-forest-600 p-8 text-center">
            <MapPinIcon class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {t("checkout.noAddresses")}
            </p>
            <A
              href="/app/addresses/new"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <PlusIcon class="w-4 h-4" />
              {t("checkout.addNewAddress")}
            </A>
          </div>
        }
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <For each={props.addresses}>
            {(address) => {
              const isSelected = () => props.selectedAddressId === address.id;

              return (
                <button
                  type="button"
                  onClick={() => props.onSelect(address.id)}
                  class={`relative text-left p-5 rounded-xl border-2 transition-all ${
                    isSelected()
                      ? "border-forest-600 dark:border-forest-400 bg-forest-50 dark:bg-forest-800/80 shadow-sm"
                      : "border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 hover:border-cream-300 dark:hover:border-forest-600"
                  }`}
                >
                  {/* Selected indicator */}
                  <Show when={isSelected()}>
                    <div class="absolute top-4 right-4 w-6 h-6 rounded-full bg-forest-600 dark:bg-forest-400 flex items-center justify-center">
                      <CheckIcon class="w-4 h-4 text-white" />
                    </div>
                  </Show>

                  {/* Default badge */}
                  <Show when={address.isDefault}>
                    <span class="inline-block px-2 py-0.5 bg-forest-100 dark:bg-forest-900/40 text-forest-700 dark:text-forest-300 text-xs font-semibold rounded-full mb-3">
                      {t("buyer.addresses.defaultLabel")}
                    </span>
                  </Show>

                  {/* Address label */}
                  <p class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {address.label}
                  </p>

                  {/* Recipient */}
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {address.recipientName}
                  </p>

                  {/* Phone */}
                  <div class="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <PhoneIcon class="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{address.phone}</span>
                  </div>

                  {/* Address lines */}
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {address.addressLine1}
                  </p>
                  <Show when={address.addressLine2}>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {address.addressLine2}
                    </p>
                  </Show>

                  {/* City, State, Postal */}
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {address.city}
                    {address.state ? `, ${address.state}` : ""}
                    {address.postalCode ? ` - ${address.postalCode}` : ""}
                  </p>

                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {address.country}
                  </p>
                </button>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default AddressSelector;
