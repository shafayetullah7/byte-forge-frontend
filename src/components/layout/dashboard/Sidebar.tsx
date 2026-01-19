import { Component, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useI18n } from "~/i18n";
import {
    Squares2x2Icon,
    ShoppingBagIcon,
    ChevronRightIcon
} from "~/components/icons";

// Mock Role Context (Will replace with actual context later)
// For now, we assume Buyer mode default
import { useRole } from "~/lib/context/role-context";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}


export const Sidebar: Component<SidebarProps> = (props) => {
    const location = useLocation();
    const { t } = useI18n();
    const { isSeller } = useRole();

    const isActive = (path: string) => {
        // Exact match for root, startsWith for others
        if (path === "/app") return location.pathname === "/app";
        return location.pathname.startsWith(path);
    };

    const NavItem = (itemProps: { href: string; icon: any; label: string }) => (
        <A
            href={itemProps.href}
            class={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors mb-1 ${isActive(itemProps.href)
                ? isSeller()
                    ? "bg-terracotta-50 dark:bg-terracotta-900/40 text-terracotta-700 dark:text-terracotta-300"
                    : "bg-forest-50 dark:bg-forest-900/40 text-forest-700 dark:text-sage-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            onClick={props.onClose} // Close sidebar on mobile when clicked
        >
            <itemProps.icon class={`mr-3 flex-shrink-0 h-5 w-5 ${isActive(itemProps.href)
                ? isSeller() ? "text-terracotta-600" : "text-forest-600 dark:text-sage-500"
                : "text-gray-400 group-hover:text-gray-500"
                }`} />
            {itemProps.label}
        </A>
    );

    return (
        <>
            {/* Mobile Backdrop */}
            <Show when={props.isOpen}>
                <div
                    class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
                    onClick={props.onClose}
                ></div>
            </Show>

            {/* Sidebar Container */}
            <div class={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:inset-0 ${props.isOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div class="h-full flex flex-col">
                    {/* Logo Area */}
                    <div class="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
                        <A href="/" class="text-xl font-bold text-forest-800 dark:text-sage-400 flex items-center gap-2">
                            GreenHaven
                            <span class="w-2 h-2 bg-forest-500 rounded-full"></span>
                        </A>
                    </div>

                    {/* Navigation Links */}
                    <div class="flex-1 flex flex-col overflow-y-auto pt-5 pb-4 px-3">
                        <nav class="flex-1 space-y-1">
                            <Show
                                when={!isSeller()}
                                fallback={
                                    // Seller Links
                                    <>
                                        <div class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            {t("common.sellerWorkspace")}
                                        </div>
                                        <NavItem href="/app/seller" icon={Squares2x2Icon} label={t("common.dashboard")} />
                                        <NavItem href="/app/seller/shops" icon={ShoppingBagIcon} label={t("common.shops")} />
                                    </>
                                }
                            >
                                {/* Buyer Links */}
                                <NavItem href="/app" icon={Squares2x2Icon} label={t("common.dashboard")} />
                                <NavItem href="/app/orders" icon={ShoppingBagIcon} label={t("buyer.orders.title")} />
                                <NavItem href="/app/favorites" icon={ShoppingBagIcon} label="Favorites" />
                            </Show>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};
