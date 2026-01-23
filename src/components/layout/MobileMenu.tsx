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
            <div class="absolute right-4 top-20 w-64 bg-white dark:bg-forest-800 rounded-xl shadow-xl border border-gray-200 dark:border-forest-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200 mobile-menu-container">
                <div class="py-2 flex flex-col">
                    <A
                        href="/"
                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={props.onClose}
                    >
                        {t("common.home")}
                    </A>
                    <A
                        href="/plants"
                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={props.onClose}
                    >
                        {t("common.plants")}
                    </A>
                    <A
                        href="/shops"
                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={props.onClose}
                    >
                        {t("common.shops")}
                    </A>
                    <A
                        href="/about"
                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={props.onClose}
                    >
                        {t("common.about")}
                    </A>

                    {/* Mobile Language Toggle */}
                    <button
                        onClick={toggleLocale}
                        class="px-4 py-2 text-sm font-medium text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                    >
                        <span>{t("common.language")}</span>
                        <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-forest-700 font-bold text-xs uppercase text-forest-600 dark:text-sage-400">
                            {locale() === "en" ? "English" : "বাংলা"}
                        </span>
                    </button>

                    <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    <Show
                        when={props.user()}
                        fallback={
                            <div class="px-4 flex flex-col gap-2">
                                <A
                                    href="/login"
                                    class="text-center text-gray-800 dark:text-gray-200 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={props.onClose}
                                >
                                    {t("common.signIn")}
                                </A>
                                <A
                                    href="/register"
                                    class="text-center bg-forest-600 dark:bg-sage-500 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-forest-700 dark:hover:bg-sage-600"
                                    onClick={props.onClose}
                                >
                                    {t("common.signUp")}
                                </A>
                            </div>
                        }
                    >
                        {(userData) => (
                            <>
                                <div class="px-4 py-2">
                                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                        {userData().userName}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {userData().email}
                                    </p>
                                </div>

                                <Show when={userData().emailVerified}>
                                    <A
                                        href="/app"
                                        class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={props.onClose}
                                    >
                                        <Squares2x2Icon class="w-4 h-4" />
                                        {t("common.dashboard")}
                                    </A>
                                    <A
                                        href="/app/profile"
                                        class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={props.onClose}
                                    >
                                        <UserIcon class="w-4 h-4" />
                                        {t("common.profile")}
                                    </A>
                                    <A
                                        href="/app/settings"
                                        class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={props.onClose}
                                    >
                                        <Cog6ToothIcon class="w-4 h-4" />
                                        {t("common.settings")}
                                    </A>
                                </Show>

                                <div class="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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
