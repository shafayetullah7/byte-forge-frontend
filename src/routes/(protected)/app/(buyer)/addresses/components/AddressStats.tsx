import { Component } from "solid-js";
import { MapPinIcon, BankIcon } from "~/components/icons";

export interface AddressStatsProps {
    total: number;
    shipping: number;
    billing: number;
}

const AddressStats: Component<AddressStatsProps> = (props) => {
    return (
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Total Addresses
                        </p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {props.total}
                        </p>
                    </div>
                    <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-sm">
                        <MapPinIcon class="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Shipping
                        </p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {props.shipping}
                        </p>
                    </div>
                    <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-sm">
                        <MapPinIcon class="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Billing
                        </p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {props.billing}
                        </p>
                    </div>
                    <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center shadow-sm">
                        <BankIcon class="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressStats;
