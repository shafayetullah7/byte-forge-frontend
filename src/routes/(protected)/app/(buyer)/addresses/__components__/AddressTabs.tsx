import { Component } from "solid-js";
import { useI18n } from "~/i18n";

export type AddressTab = "all" | "shipping" | "billing";

export interface AddressTabsProps {
    activeTab: AddressTab;
    onTabChange: (tab: AddressTab) => void;
    counts: {
        all: number;
        shipping: number;
        billing: number;
    };
}

const AddressTabs: Component<AddressTabsProps> = (props) => {
    const { t } = useI18n();

    return (
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
            <div class="flex items-center gap-2 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                {(["all", "shipping", "billing"] as const).map((tab) => (
                    <button
                        onClick={() => props.onTabChange(tab)}
                        class={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                            props.activeTab === tab
                                ? "bg-forest-100 dark:bg-forest-900/40 text-forest-800 dark:text-cream-50"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        {tab === "all"
                            ? t("buyer.addresses.tabs.all")
                            : tab === "shipping"
                            ? t("buyer.addresses.tabs.shipping")
                            : t("buyer.addresses.tabs.billing")}
                        <span class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            {tab === "all"
                                ? props.counts.all
                                : tab === "shipping"
                                ? props.counts.shipping
                                : props.counts.billing}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AddressTabs;
