import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import { useSession } from "~/lib/auth";
import { UserMenu } from "./UserMenu";
import { useI18n } from "~/i18n";
import LinkButton from "../ui/LinkButton";

export function AuthSection() {
    const user = useSession();
    const navigate = useNavigate();
    const { t } = useI18n();

    return (
        <Show
            when={user()}
            keyed
            fallback={
                <div class="hidden md:flex items-center gap-3">
                    <LinkButton
                        href="/login"
                        variant="secondary"
                        class="font-semibold"
                    >
                        {t("common.signIn")}
                    </LinkButton>
                    <LinkButton
                        href="/register"
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
