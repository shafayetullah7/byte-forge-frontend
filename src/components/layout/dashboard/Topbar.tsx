import { Component, createSignal, Show, onMount, onCleanup } from "solid-js";
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    TagIcon,
    ArrowsRightLeftIcon,
    GlobeAltIcon
} from "~/components/icons";
import { useI18n } from "~/i18n";
import { UserMenu } from "../UserMenu";
import { useSession } from "~/lib/auth";
import { A, useLocation } from "@solidjs/router";
import Input from "~/components/ui/Input";
// Removed SegmentedControl import as it's no longer used in this file

interface TopbarProps {
    onMenuClick: () => void;
}

export const Topbar: Component<TopbarProps> = (props) => {
    const { locale, toggleLocale } = useI18n();
    const location = useLocation();
    const isSeller = () => location.pathname.startsWith("/app/seller");
    const { t } = useI18n();
    const session = useSession();

    return (
        <header class="bg-white dark:bg-forest-800 border-b border-gray-200 dark:border-forest-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-10 sticky top-0">
            {/* Left Side: Mobile Menu Trigger & Search */}
            <div class="flex items-center flex-1 gap-4">
                <button
                    onClick={props.onMenuClick}
                    class="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                    <Bars3Icon class="h-6 w-6" />
                </button>

                {/* Global Search (Optional) */}
                <div class="relative max-w-md w-full hidden sm:block">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search..."
                        class="pl-10 bg-gray-50 dark:bg-forest-700 focus:bg-white dark:focus:bg-forest-800"
                    />
                </div>
            </div>

            {/* Right Side: Actions */}
            <div class="flex items-center gap-4">
                {/* Dashboard Links */}
                <A
                    href="/app"
                    class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200"
                    classList={{
                        "bg-forest-100 border-forest-200 text-forest-800": !isSeller(),
                        "bg-forest-50 border-forest-100 text-forest-700 hover:border-forest-200 hover:bg-forest-100": isSeller()
                    }}
                    title="Buyer Dashboard"
                >
                    <ShoppingBagIcon class="w-4 h-4" />
                    <span class="text-xs font-semibold uppercase tracking-wide">Buyer</span>
                </A>
                <A
                    href="/app/seller/shops"
                    class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200"
                    classList={{
                        "bg-terracotta-100 border-terracotta-200 text-terracotta-800": isSeller(),
                        "bg-terracotta-50 border-terracotta-100 text-terracotta-700 hover:border-terracotta-200 hover:bg-terracotta-100": !isSeller()
                    }}
                    title="Seller Dashboard"
                >
                    <TagIcon class="w-4 h-4" />
                    <span class="text-xs font-semibold uppercase tracking-wide">Seller</span>
                </A>

                <div class="h-6 w-px bg-gray-200 dark:bg-forest-700 mx-1"></div>

                {/* Language Switcher - Minimalist Globe */}
                <button
                    onClick={toggleLocale}
                    class="flex items-center gap-1.5 p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Change Language"
                >
                    <GlobeAltIcon class="w-5 h-5" />
                    <span class="text-xs font-semibold w-5">{locale().toUpperCase()}</span>
                </button>

                {/* User Avatar Dropdown */}
                <Show when={session()}>
                    {(user) => (
                        <UserMenu user={user()} showDashboardLink={false} />
                    )}
                </Show>
            </div>
        </header>
    );
};
