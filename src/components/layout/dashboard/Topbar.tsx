import { Component, createSignal, Show, onMount, onCleanup } from "solid-js";
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    TagIcon,
    GlobeAltIcon
} from "~/components/icons";
import { useI18n } from "~/i18n";
import { UserMenu } from "../UserMenu";
import { useSession } from "~/lib/auth";
import { A, useLocation, useNavigate } from "@solidjs/router";
import Input from "~/components/ui/Input";
import { ThemeToggle } from "../ThemeToggle";
import SegmentedControl from "~/components/ui/SegmentedControl";

interface TopbarProps {
    onMenuClick: () => void;
}

export const Topbar: Component<TopbarProps> = (props) => {
    const { locale, toggleLocale } = useI18n();
    const location = useLocation();
    const navigate = useNavigate();
    const isSeller = () => location.pathname.startsWith("/app/seller");
    const { t } = useI18n();
    const session = useSession();

    const handleDashboardChange = (value: "buyer" | "seller") => {
        navigate(value === "seller" ? "/app/seller" : "/app");
    };

    return (
        <header class="bg-white dark:bg-forest-800 border-b border-cream-200 dark:border-forest-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-10 sticky top-0">
            {/* Left Side: Logo & Mobile Menu */}
            <div class="flex items-center gap-2">
                {/* Site Logo */}
                <A
                    href="/"
                    class="text-xl font-bold text-forest-800 dark:text-sage-400 flex items-center gap-2 hover:text-forest-700 dark:hover:text-sage-300 transition-standard shrink-0"
                >
                    GreenHaven
                    <span class="w-2 h-2 bg-forest-500 rounded-full"></span>
                </A>

                {/* Mobile Menu Button */}
                <button
                    onClick={props.onMenuClick}
                    class="p-2 -ml-2 text-forest-700/70 dark:text-cream-100/70 hover:text-forest-600 dark:hover:text-cream-100 md:hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500/30 transition-standard"
                    aria-label="Open menu"
                >
                    <Bars3Icon class="h-6 w-6" />
                </button>
            </div>

            {/* Center: Global Search */}
            <div class="flex-1 max-w-md mx-4 hidden sm:block">
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <MagnifyingGlassIcon class="h-5 w-5 text-forest-600/70 dark:text-forest-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder={t("common.search") || "Search..."}
                        class="pl-10 bg-cream-50 dark:bg-forest-900/40 focus:bg-white dark:focus:bg-forest-800 border-cream-200 dark:border-forest-700 focus:border-forest-500"
                    />
                </div>
            </div>

            {/* Right Side: Actions */}
            <div class="flex items-center gap-4">
                {/* Dashboard Toggle - Using SegmentedControl */}
                <SegmentedControl<"buyer" | "seller">
                    options={[
                        { value: "buyer", label: "Buyer", icon: ShoppingBagIcon },
                        { value: "seller", label: "Seller", icon: TagIcon }
                    ]}
                    value={isSeller() ? "seller" : "buyer"}
                    onChange={handleDashboardChange}
                    size="md"
                    class="hidden md:flex"
                />

                {/* Divider */}
                <div class="h-5 w-px bg-cream-200 dark:bg-forest-600 mx-1.5"></div>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Language Switcher */}
                <button
                    onClick={toggleLocale}
                    class="flex items-center gap-1.5 p-2.5 rounded-lg text-forest-700/70 dark:text-cream-100/70 hover:text-forest-600 dark:hover:text-cream-100 hover:bg-forest-50 dark:hover:bg-forest-900/30 transition-standard"
                    title="Change Language"
                    aria-label="Change language"
                >
                    <GlobeAltIcon class="w-5 h-5" />
                    <span class="body-small font-semibold w-5">{locale().toUpperCase()}</span>
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
