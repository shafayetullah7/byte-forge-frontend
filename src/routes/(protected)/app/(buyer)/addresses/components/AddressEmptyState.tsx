import { Component } from "solid-js";
import { useI18n } from "~/i18n";
import { A } from "@solidjs/router";
import { MapPinIcon, PlusIcon } from "~/components/icons";

const AddressEmptyState: Component = () => {
    const { t } = useI18n();

    return (
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
            <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <MapPinIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("buyer.addresses.empty.title")}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                {t("buyer.addresses.empty.description")}
            </p>
            <A
                href="/app/addresses/new"
                class="inline-flex items-center gap-2 px-5 py-3 bg-forest-600 dark:bg-sage-600 text-white font-semibold rounded-xl hover:bg-forest-700 dark:hover:bg-sage-700 transition-colors"
            >
                <PlusIcon class="w-5 h-5" />
                {t("buyer.addresses.addNew")}
            </A>
        </div>
    );
};

export default AddressEmptyState;
