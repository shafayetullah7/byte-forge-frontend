import { Show } from "solid-js";
import { useLocation } from "@solidjs/router";
import { useSession, getOidcLoginUrlFromLocation } from "~/lib/auth";
import { UserMenu } from "./UserMenu";
import { useI18n } from "~/i18n";
import { config } from "~/lib/config";
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
                <div class="hidden md:flex items-center gap-3">
                    <LinkButton
                        href={getOidcLoginUrlFromLocation(location.pathname, location.search)}
                        variant="secondary"
                        class="font-semibold"
                    >
                        {t("common.signIn")}
                    </LinkButton>
                    <LinkButton
                        href={config.auth.registerUrl}
                        variant="primary"
                        class="font-semibold"
                    >
                        {t("common.signUp")}
                    </LinkButton>
                </div>
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
