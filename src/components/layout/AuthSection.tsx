import { Show } from "solid-js";
import { useLocation } from "@solidjs/router";
import { useSession, getOidcLoginUrlFromLocation } from "~/lib/auth";
import { UserMenu } from "./UserMenu";
import { useI18n } from "~/i18n";
import LinkButton from "../ui/LinkButton";

export function AuthSection() {
    const user = useSession();
    const location = useLocation();
    const { t } = useI18n();

    return (
        <Show
            when={user()}
            keyed
            fallback={
                <LinkButton
                    href={getOidcLoginUrlFromLocation(location.pathname, location.search)}
                    variant="outline"
                    size="sm"
                    class="!rounded-full whitespace-nowrap font-semibold"
                    aria-label={t("landing.nav.beginAriaLabel")}
                >
                    {t("landing.nav.begin")}
                </LinkButton>
            }
        >
            {(userData) => (
                <div class="relative z-20">
                    <UserMenu user={userData} showDashboardLink={true} />
                </div>
            )}
        </Show>
    );
}
