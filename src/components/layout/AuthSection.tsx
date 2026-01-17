import { A, useNavigate } from "@solidjs/router";
import { Show, createSignal, onMount, onCleanup } from "solid-js";
import { useSession } from "~/lib/auth";
import {
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Squares2x2Icon,
} from "../icons";

import { getInitials } from "~/lib/utils/string.utils";
import { useI18n } from "~/i18n";

export function AuthSection() {
    const user = useSession();
    const navigate = useNavigate();
    const { t } = useI18n();
    const [dropdownOpen, setDropdownOpen] = createSignal(false);
    const [isLoggingOut, setIsLoggingOut] = createSignal(false);

    // Removed local getInitials

    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".profile-dropdown-container")) {
            setDropdownOpen(false);
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
        const { performLogout } = await import("~/lib/auth");
        setIsLoggingOut(true);
        try {
            await performLogout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoggingOut(false);
            setDropdownOpen(false);
        }
    };

    return (
        <Show
            when={user()}
            fallback={
                <div class="hidden md:flex items-center gap-3">
                    <A
                        href="/login"
                        class="text-gray-800 dark:text-gray-200 font-semibold text-sm px-4 py-2 hover:text-forest-600 dark:hover:text-sage-400 transition-colors"
                    >
                        {t("common.signIn")}
                    </A>
                    <A
                        href="/register"
                        class="bg-forest-600 dark:bg-sage-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-forest-700 dark:hover:bg-sage-600 hover:shadow-lg transition-all"
                    >
                        {t("common.signUp")}
                    </A>
                </div>
            }
        >
            {(userData) => (
                <div class="relative profile-dropdown-container hidden lg:block">
                    {/* Profile Button */}
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen())}
                        class="flex items-center gap-3 px-3 py-1 pr-1 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all cursor-pointer"
                        aria-label="User menu"
                    >
                        <span class="text-sm font-medium text-gray-800 dark:text-gray-200 block">
                            {userData().userName}
                        </span>
                        <div class="w-8 h-8 rounded-full bg-forest-600 dark:bg-sage-500 text-white flex items-center justify-center font-semibold text-xs ring-2 ring-white dark:ring-gray-800">
                            {getInitials(userData().userName)}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    <Show when={dropdownOpen()}>
                        <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User Info Header */}
                            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                    {userData().userName}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {userData().email}
                                </p>
                            </div>

                            {/* Menu Items */}
                            <div class="py-1">
                                <Show when={userData().emailVerified}>
                                    <A
                                        href="/dashboard"
                                        class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <Squares2x2Icon class="w-4 h-4" />
                                        {t("common.dashboard")}
                                    </A>

                                    <A
                                        href="/profile"
                                        class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <UserIcon class="w-4 h-4" />
                                        {t("common.profile")}
                                    </A>

                                    <A
                                        href="/settings"
                                        class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <Cog6ToothIcon class="w-4 h-4" />
                                        {t("common.settings")}
                                    </A>
                                </Show>
                            </div>

                            {/* Logout Button */}
                            <div class="border-t border-gray-200 dark:border-gray-700 pt-1">
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut()}
                                    class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                >
                                    <ArrowRightOnRectangleIcon class="w-4 h-4" />
                                    {isLoggingOut() ? t("common.loading") : t("common.signOut")}
                                </button>
                            </div>
                        </div>
                    </Show>
                </div>
            )}
        </Show>
    );
}
