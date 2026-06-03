import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { MapPinIcon, BankIcon, PencilIcon, TrashIcon, CheckIcon } from "~/components/icons";
import type { Address } from "~/lib/api/types/address.types";

export interface AddressCardProps {
    address: Address;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
}

const AddressCard: Component<AddressCardProps> = (props) => {
    const { t } = useI18n();

    const isShipping = props.address.type === "shipping";

    return (
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-6 relative">
            {/* Type Badge */}
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    {isShipping ? (
                        <div class="p-2 bg-forest-100 dark:bg-forest-900/40 rounded-lg">
                            <MapPinIcon class="w-4 h-4 text-forest-600 dark:text-sage-400" />
                        </div>
                    ) : (
                        <div class="p-2 bg-sage-100 dark:bg-sage-900/40 rounded-lg">
                            <BankIcon class="w-4 h-4 text-sage-600 dark:text-sage-400" />
                        </div>
                    )}
                    <span
                        class={`px-3 py-1 text-xs font-semibold rounded-full ${
                            isShipping
                                ? "bg-forest-100 dark:bg-forest-900/40 text-forest-800 dark:text-forest-300"
                                : "bg-sage-100 dark:bg-sage-900/40 text-sage-800 dark:text-sage-300"
                        }`}
                    >
                        {isShipping
                            ? t("buyer.addresses.types.shipping")
                            : t("buyer.addresses.types.billing")}
                    </span>
                </div>

                {/* Default Badge */}
                {props.address.isDefault && (
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-forest-600 dark:bg-sage-600 text-white text-xs font-semibold rounded-full">
                        <CheckIcon class="w-3 h-3" />
                        {t("buyer.addresses.defaultLabel")}
                    </span>
                )}
            </div>

            {/* Address Details */}
            <div class="space-y-2 mb-5">
                <p class="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {props.address.label}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {props.address.recipientName}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {props.address.phone}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {props.address.addressLine1}
                </p>
                {props.address.addressLine2 && (
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {props.address.addressLine2}
                    </p>
                )}
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {props.address.city}
                    {props.address.state ? `, ${props.address.state}` : ""}
                    {props.address.postalCode ? ` - ${props.address.postalCode}` : ""}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {props.address.country}
                </p>
            </div>

            {/* Actions */}
            <div class="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <A
                    href={`/app/addresses/${props.address.id}/edit`}
                    class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <PencilIcon class="w-4 h-4" />
                    {t("common.edit")}
                </A>

                {!props.address.isDefault && (
                    <button
                        onClick={() => props.onSetDefault(props.address.id)}
                        class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        {t("buyer.addresses.setDefault")}
                    </button>
                )}

                <button
                    onClick={() => props.onDelete(props.address.id)}
                    class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-auto"
                >
                    <TrashIcon class="w-4 h-4" />
                    {t("common.delete")}
                </button>
            </div>
        </div>
    );
};

export default AddressCard;
