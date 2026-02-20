import { A, useNavigate } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import {
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Squares2x2Icon,
} from "../icons";

import { type Accessor } from "solid-js";
import { type AuthUser } from "~/lib/api/types/auth.types";
import { useI18n } from "~/i18n";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import LinkButton from "../ui/LinkButton";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user: Accessor<AuthUser | null | undefined>;
}

export function MobileMenu(props: MobileMenuProps) {
    // const user = useSession(); // Removed local call
    const navigate = useNavigate();
    const { t, locale, toggleLocale } = useI18n();

    const [isLoggingOut, setIsLoggingOut] = createSignal(false);

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
            props.onClose();
        }
    };

    return (
        <Show when={props.isOpen}>
            <div class="absolute right-4 top-16 w-64 bg-white dark:bg-forest-800 rounded-xl shadow-xl border border-cream-200 dark:border-forest-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200 mobile-menu-container">
                <div class="py-2 flex flex-col">
                    <A
                        href="/"
                        class="px-4 py-3 text-sm font-medium text-forest-700 dark:text-gray-300 hover:bg-terracotta-50/50 dark:hover:bg-terracotta-900/30 transition-colors duration-200"
                        activeClass="text-terracotta-600 dark:text-terracotta-400 font-semibold bg-terracotta-50/30 dark:bg-terracotta-900/40"
                        onClick={props.onClose}
                        end
                    >
                        {t("common.home")}
                    </A>
                    <A
                        href="/plants"
                        class="px-4 py-3 text-sm font-medium text-forest-700 dark:text-gray-300 hover:bg-terracotta-50/50 dark:hover:bg-terracotta-900/30 transition-colors duration-200"
                        activeClass="text-terracotta-600 dark:text-terracotta-400 font-semibold bg-terracotta-50/30 dark:bg-terracotta-900/40"
                        onClick={props.onClose}
                    >
                        {t("common.plants")}
                    </A>
                    <A
                        href="/shops"
                        class="px-4 py-3 text-sm font-medium text-forest-700 dark:text-gray-300 hover:bg-terracotta-50/50 dark:hover:bg-terracotta-900/30 transition-colors duration-200"
                        activeClass="text-terracotta-600 dark:text-terracotta-400 font-semibold bg-terracotta-50/30 dark:bg-terracotta-900/40"
                        onClick={props.onClose}
                    >
                        {t("common.shops")}
                    </A>
                    <A
                        href="/about"
                        class="px-4 py-3 text-sm font-medium text-forest-700 dark:text-gray-300 hover:bg-terracotta-50/50 dark:hover:bg-terracotta-900/30 transition-colors duration-200"
                        activeClass="text-terracotta-600 dark:text-terracotta-400 font-semibold bg-terracotta-50/30 dark:bg-terracotta-900/40"
                        onClick={props.onClose}
                    >
                        {t("common.about")}
                    </A>

                    {/* Mobile Theme Toggle */}
                    <div class="px-4 py-3 text-sm font-medium text-left text-forest-700 dark:text-gray-300 flex items-center justify-between transition-colors duration-200">
                        <span>{t("common.appearance") || "Appearance"}</span>
                        <ThemeToggle />
                    </div>

                    {/* Mobile Language Toggle */}
                    <div class="px-4 py-3 text-sm font-medium text-left text-forest-700 dark:text-gray-300 flex items-center justify-between transition-colors duration-200">
                        <span>{t("common.language")}</span>
                        <LanguageSwitcher variant="full" />
                    </div>

                    <div class="border-t border-cream-200 dark:border-forest-700 my-2"></div>

                    <Show
                        when={props.user()}
                        fallback={
                            <div class="px-4 flex flex-col gap-2">
                                <LinkButton
                                    href="/login"
                                    variant="secondary"
                                    class="w-full font-semibold"
                                    onClick={props.onClose}
                                >
                                    {t("common.signIn")}
                                </LinkButton>
                                <LinkButton
                                    href="/register"
                                    variant="primary"
                                    class="w-full font-semibold"
                                    onClick={props.onClose}
                                >
                                    {t("common.signUp")}
                                </LinkButton>
                            </div>
                        }
                    >
                        {(userData) => (
                            <>
                                <div class="px-4 py-2">
                                    <p class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                                        {userData().userName}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {userData().email}
                                    </p>
                                </div>

                                <Show when={userData().emailVerified}>
                                    <A
                                        href="/app"
                                        class="flex items-center gap-3 px-4 py-3 text-sm text-forest-700 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-forest-700 transition-colors duration-200"
                                        onClick={props.onClose}
                                    >
                                        <Squares2x2Icon class="w-4 h-4" />
                                        {t("common.dashboard")}
                                    </A>
                                    <A
                                        href="/app/profile"
                                        class="flex items-center gap-3 px-4 py-3 text-sm text-forest-700 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-forest-700 transition-colors duration-200"
                                        onClick={props.onClose}
                                    >
                                        <UserIcon class="w-4 h-4" />
                                        {t("common.profile")}
                                    </A>
                                    <A
                                        href="/app/settings"
                                        class="flex items-center gap-3 px-4 py-3 text-sm text-forest-700 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-forest-700 transition-colors duration-200"
                                        onClick={props.onClose}
                                    >
                                        <Cog6ToothIcon class="w-4 h-4" />
                                        {t("common.settings")}
                                    </A>
                                </Show>

                                <div class="border-t border-cream-200 dark:border-forest-700 mt-2 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        class="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                        disabled={isLoggingOut()}
                                    >
                                        <ArrowRightOnRectangleIcon class="w-4 h-4" />
                                        {isLoggingOut() ? t("common.loading") : t("common.signOut")}
                                    </button>
                                </div>
                            </>
                        )}
                    </Show>
                </div>
            </div>
        </Show>
    );
}
