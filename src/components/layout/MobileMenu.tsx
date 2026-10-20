import { useLocation } from "@solidjs/router";
import { Show, type Accessor } from "solid-js";
import { ArrowRightOnRectangleIcon } from "../icons";
import { performFederatedLogout, getOidcLoginUrlFromLocation } from "~/lib/auth";
import { type AuthUser } from "~/lib/api/types/auth.types";
import { useI18n } from "~/i18n";
import LinkButton from "../ui/LinkButton";
import { NavbarPlantSearch } from "./NavbarPlantSearch";
import { NavbarPrimaryLinks } from "./NavbarPrimaryLinks";
import { MobileMenuPreferences } from "./MobileMenuPreferences";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user: Accessor<AuthUser | null | undefined>;
}

export function MobileMenu(props: MobileMenuProps) {
    const location = useLocation();
    const { t } = useI18n();

    const handleLogout = () => {
        props.onClose();
        performFederatedLogout();
    };

    const handleFederatedLogout = () => {
        props.onClose();
        performFederatedLogout({ allDevices: true });
    };

    return (
        <Show when={props.isOpen}>
            <div class="absolute right-4 top-16 w-64 bg-white/95 dark:bg-forest-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-cream-200 dark:border-forest-700/50 pt-2 pb-2 animate-in fade-in slide-in-from-top-2 duration-200 mobile-menu-container">
                <NavbarPlantSearch variant="mobile" onAfterSubmit={props.onClose} />
                <div class="border-b border-cream-200 dark:border-forest-700/50 mb-1" />
                <div class="py-2 flex flex-col">
                    <NavbarPrimaryLinks variant="mobile" onLinkClick={props.onClose} />
                    <MobileMenuPreferences />

                    <div class="border-t border-cream-200 dark:border-forest-700 my-2"></div>

                    <Show
                        when={props.user()}
                        fallback={
                            <div class="px-4">
                                <LinkButton
                                    href={getOidcLoginUrlFromLocation(location.pathname, location.search)}
                                    variant="outline"
                                    class="w-full font-semibold !rounded-full"
                                    aria-label={t("landing.nav.beginAriaLabel")}
                                    onClick={props.onClose}
                                >
                                    {t("landing.nav.begin")}
                                </LinkButton>
                            </div>
                        }
                    >
                        <div class="pt-1 space-y-1">
                            <button
                                onClick={handleLogout}
                                class="flex items-center gap-3 w-full px-4 py-3 text-sm text-forest-700 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-forest-900/40 transition-colors duration-200"
                                type="button"
                            >
                                <ArrowRightOnRectangleIcon class="w-4 h-4" />
                                {t("common.signOut")}
                            </button>
                            <button
                                onClick={handleFederatedLogout}
                                class="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                type="button"
                            >
                                <ArrowRightOnRectangleIcon class="w-4 h-4" />
                                {t("common.signOutEverywhere")}
                            </button>
                        </div>
                    </Show>
                </div>
            </div>
        </Show>
    );
}
