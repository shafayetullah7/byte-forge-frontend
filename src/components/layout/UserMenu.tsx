import { Component, createSignal, Show, onMount, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
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
        if (!isServer) {
            document.addEventListener("click", handleClickOutside);
        }
    });

    onCleanup(() => {
        if (!isServer) {
            document.removeEventListener("click", handleClickOutside);
        }
    });

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await performLogout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setIsLoggingOut(false);
            setIsOpen(false);
        }
    };

    return (
        <div class="relative user-menu-container">
            {/* Profile Trigger Button - Capsule Design */}
            <button
                onClick={() => setIsOpen(!isOpen())}
                class="flex items-center gap-2.5 px-2.5 py-1.5 pr-2 rounded-full bg-forest-50/80 dark:bg-forest-900/40 hover:bg-forest-100 dark:hover:bg-forest-800/60 border border-forest-200 dark:border-forest-700 transition-standard cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 group"
                aria-label="User menu"
                aria-expanded={isOpen()}
                type="button"
            >
                <span class="body-small font-semibold text-forest-800 dark:text-cream-100 hidden sm:inline-block">
                    {props.user.userName || props.user.email?.split('@')[0] || "User"}
                </span>
                <div class="w-8 h-8 rounded-full bg-linear-to-br from-forest-500 to-forest-600 dark:from-forest-400 dark:to-forest-500 text-white dark:text-cream-50 flex items-center justify-center font-bold text-xs ring-2 ring-white dark:ring-forest-800 shadow-sm transition-transform group-hover:scale-105 group-focus:scale-105">
                    {getInitials(props.user.userName || props.user.email || "U")}
                </div>
            </button>

            <Show when={isOpen()}>
                {/* Dropdown Menu - Flat Card Design */}
                <div class="absolute right-0 mt-2 w-72 flat-card bg-white dark:bg-forest-800 shadow-lg overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header - Tinted Background */}
                    <div class="px-4 py-3.5 bg-forest-50/80 dark:bg-forest-900/40 border-b border-cream-200 dark:border-forest-700">
                        <p class="h6 text-forest-800 dark:text-cream-50 truncate">
                            {props.user.userName || "User"}
                        </p>
                        <p class="body-small text-forest-700/70 dark:text-gray-400 truncate mt-0.5">
                            {props.user.email || ""}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <div class="py-2 px-2">
                        <Show when={props.showDashboardLink}>
                            <A
                                href="/app"
                                class="flex items-center gap-3 px-3 py-2.5 body-small font-medium text-forest-700 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-forest-900/40 hover:text-forest-800 dark:hover:text-forest-300 rounded-lg transition-standard"
                                activeClass="bg-forest-100 dark:bg-forest-900/40 text-forest-800 dark:text-forest-300 font-semibold"
                                end
                                onClick={() => setIsOpen(false)}
                            >
                                <Squares2x2Icon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
                                {t("common.dashboard")}
                            </A>
                        </Show>

                        <A
                            href="/app/profile"
                            class="flex items-center gap-3 px-3 py-2.5 body-small font-medium text-forest-700 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-forest-900/40 hover:text-forest-800 dark:hover:text-forest-300 rounded-lg transition-standard"
                            activeClass="bg-forest-100 dark:bg-forest-900/40 text-forest-800 dark:text-forest-300 font-semibold"
                            end
                            onClick={() => setIsOpen(false)}
                        >
                            <UserIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
                            {t("common.profile")}
                        </A>

                        <A
                            href="/app/settings"
                            class="flex items-center gap-3 px-3 py-2.5 body-small font-medium text-forest-700 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-forest-900/40 hover:text-forest-800 dark:hover:text-forest-300 rounded-lg transition-standard"
                            activeClass="bg-forest-100 dark:bg-forest-900/40 text-forest-800 dark:text-forest-300 font-semibold"
                            end
                            onClick={() => setIsOpen(false)}
                        >
                            <Cog6ToothIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
                            {t("common.settings")}
                        </A>
                    </div>

                    {/* Logout Button - Separated with Border */}
                    <div class="border-t border-cream-200 dark:border-forest-700 py-2 px-2">
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut()}
                            class="flex items-center gap-3 w-full px-3 py-2.5 body-small font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-standard disabled:opacity-50 disabled:cursor-not-allowed"
                            type="button"
                        >
                            <ArrowRightOnRectangleIcon class="w-5 h-5" />
                            {isLoggingOut() ? t("common.loading") : t("common.signOut")}
                        </button>
                    </div>
                </div>
            </Show>
        </div>
    );
};
