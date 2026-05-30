import { Component, createSignal } from "solid-js";
import { useI18n } from "~/i18n";
import {
    MapPinIcon,
    BankIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    CheckIcon,
} from "~/components/icons";

interface Address {
    id: string;
    name: string;
    phone: string;
    street: string;
    area: string;
    district: string;
    division: string;
    postalCode: string;
    type: "shipping" | "billing";
    isDefault: boolean;
}

const staticAddresses: Address[] = [
    {
        id: "1",
        name: "Rahim Uddin",
        phone: "+8801712345678",
        street: "House 42, Road 11",
        area: "Banani, Block-C",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1213",
        type: "shipping",
        isDefault: true,
    },
    {
        id: "2",
        name: "Rahim Uddin",
        phone: "+8801712345678",
        street: "House 15, Road 5",
        area: "Dhanmondi 27/A",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1209",
        type: "shipping",
        isDefault: false,
    },
    {
        id: "3",
        name: "Rahim Uddin",
        phone: "+8801812345678",
        street: "Flat 6A, Shadhinata Tower",
        area: "Gulshan-1, Level-6",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1212",
        type: "billing",
        isDefault: true,
    },
    {
        id: "4",
        name: "Rahim Uddin",
        phone: "+8801912345678",
        street: "House 8, Road 3",
        area: "Uttara Sector 7",
        district: "Dhaka",
        division: "Dhaka",
        postalCode: "1230",
        type: "shipping",
        isDefault: false,
    },
];

const AddressCard: Component<{
    address: Address;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
}> = (props) => {
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
                    {props.address.name}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {props.address.phone}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {props.address.street}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {props.address.area}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {props.address.district}, {props.address.division} -{" "}
                    {props.address.postalCode}
                </p>
            </div>

            {/* Actions */}
            <div class="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={() => props.onEdit(props.address.id)}
                    class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <PencilIcon class="w-4 h-4" />
                    {t("common.edit")}
                </button>

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

const AddressesPage: Component = () => {
    const { t } = useI18n();
    const [addresses, setAddresses] = createSignal<Address[]>(staticAddresses);
    const [activeTab, setActiveTab] = createSignal<"all" | "shipping" | "billing">("all");

    const filteredAddresses = () => {
        const tab = activeTab();
        if (tab === "all") return addresses();
        return addresses().filter((a) => a.type === tab);
    };

    const shippingAddresses = () => addresses().filter((a) => a.type === "shipping");
    const billingAddresses = () => addresses().filter((a) => a.type === "billing");

    const handleDelete = (id: string) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
    };

    const handleSetDefault = (id: string) => {
        setAddresses((prev) =>
            prev.map((a) => ({
                ...a,
                isDefault: a.id === id ? true : a.type === prev.find((x) => x.id === id)?.type ? false : a.isDefault,
            }))
        );
    };

    const handleEdit = (_id: string) => {
        // Placeholder for future edit modal
    };

    return (
        <div class="min-h-screen py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div class="mb-8">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-md shadow-forest-500/20">
                                <MapPinIcon class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {t("buyer.addresses.title")}
                                </h1>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    {t("buyer.addresses.subtitle")}
                                </p>
                            </div>
                        </div>
                        <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 dark:bg-sage-600 hover:bg-forest-700 dark:hover:bg-sage-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm">
                            <PlusIcon class="w-4 h-4" />
                            {t("buyer.addresses.addNew")}
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {t("buyer.addresses.stats.total")}
                                </p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {addresses().length}
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
                                    {t("buyer.addresses.stats.shipping")}
                                </p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {shippingAddresses().length}
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
                                    {t("buyer.addresses.stats.billing")}
                                </p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {billingAddresses().length}
                                </p>
                            </div>
                            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center shadow-sm">
                                <BankIcon class="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                    <div class="flex items-center gap-2 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                        {(["all", "shipping", "billing"] as const).map((tab) => (
                            <button
                                onClick={() => setActiveTab(tab)}
                                class={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                    activeTab() === tab
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
                                        ? addresses().length
                                        : tab === "shipping"
                                        ? shippingAddresses().length
                                        : billingAddresses().length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Address Cards */}
                {filteredAddresses().length === 0 ? (
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
                        <button class="inline-flex items-center gap-2 px-5 py-3 bg-forest-600 dark:bg-sage-600 text-white font-semibold rounded-xl hover:bg-forest-700 dark:hover:bg-sage-700 transition-colors">
                            <PlusIcon class="w-5 h-5" />
                            {t("buyer.addresses.addNew")}
                        </button>
                    </div>
                ) : (
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAddresses().map((address) => (
                            <AddressCard
                                address={address}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onSetDefault={handleSetDefault}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressesPage;
