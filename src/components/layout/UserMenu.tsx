import { Component, createSignal, Show, onMount, onCleanup } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { performLogout } from "~/lib/auth";
import { useI18n } from "~/i18n";
import { getInitials } from "~/lib/utils/string.utils";
import {
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Squares2x2Icon
} from "~/components/icons";

interface UserMenuProps {
    user: {
        userName: string;
        email: string;
        emailVerified: boolean;
    };
    showDashboardLink?: boolean;
}

export const UserMenu: Component<UserMenuProps> = (props) => {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = createSignal(false);
    const [isLoggingOut, setIsLoggingOut] = createSignal(false);

    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".user-menu-container")) {
            setIsOpen(false);
        }
    };

    onMount(() => {
        if (typeof window !== "undefined") {
            document.addEventListener("click", handleClickOutside);
        }
    });

    onCleanup(() => {
        if (typeof window !== "undefined") {
            document.removeEventListener("click", handleClickOutside);
        }
    });

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await performLogout();
            navigate("/"); // Redirect to home/login
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setIsLoggingOut(false);
            setIsOpen(false);
        }
    };

    return (
        <div class="relative user-menu-container">
            {/* Profile Capsule Button */}
            <button
                onClick={() => setIsOpen(!isOpen())}
                class="flex items-center gap-3 px-3 py-1 pr-1 rounded-full bg-forest-50/50 dark:bg-white/10 hover:bg-forest-100 dark:hover:bg-white/15 border border-transparent hover:border-forest-200 dark:hover:border-white/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-forest-500"
                aria-label="User menu"
                aria-expanded={isOpen()}
            >
                <span class="text-sm font-medium text-gray-800 dark:text-gray-200 block hidden md:block">
                    {props.user.userName}
                </span>
                <div class="w-8 h-8 rounded-full bg-forest-600 dark:bg-sage-500 text-white flex items-center justify-center font-semibold text-xs ring-2 ring-white dark:ring-gray-800 shadow-sm">
                    {getInitials(props.user.userName)}
                </div>
            </button>

            <Show when={isOpen()}>
                {/* Dropdown Menu */}
                <div class="absolute right-0 mt-2 w-64 bg-white dark:bg-forest-800 rounded-xl shadow-xl border border-gray-100 dark:border-forest-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    {/* User Info Header */}
                    <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-white/5 mx-2 rounded-lg mb-2">
                        <p class="text-sm font-semibold text-gray-900 dark:text-white">
                            {props.user.userName}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {props.user.email}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <div class="px-2 space-y-1">
                        <Show when={props.showDashboardLink}>
                            <A
                                href="/app"
                                class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-forest-900/30 hover:text-forest-700 dark:hover:text-sage-400 rounded-lg transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Squares2x2Icon class="w-4.5 h-4.5" />
                                {t("common.dashboard")}
                            </A>
                        </Show>

                        <A
                            href="/app/profile"
                            class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-forest-900/30 hover:text-forest-700 dark:hover:text-sage-400 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <UserIcon class="w-4.5 h-4.5" />
                            {t("common.profile")}
                        </A>

                        <A
                            href="/app/settings"
                            class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-forest-900/30 hover:text-forest-700 dark:hover:text-sage-400 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Cog6ToothIcon class="w-4.5 h-4.5" />
                            {t("common.settings")}
                        </A>
                    </div>

                    {/* Logout Button */}
                    <div class="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 px-2">
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut()}
                            class="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <ArrowRightOnRectangleIcon class="w-4.5 h-4.5" />
                            {isLoggingOut() ? t("common.loading") : t("common.signOut")}
                        </button>
                    </div>
                </div>
            </Show>
        </div>
    );
};
