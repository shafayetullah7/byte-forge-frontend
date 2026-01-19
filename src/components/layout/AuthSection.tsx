import { A, useNavigate } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { useSession } from "~/lib/auth";
import { UserMenu } from "./UserMenu";
import { useI18n } from "~/i18n";

export function AuthSection() {
    const user = useSession();
    const navigate = useNavigate();
    const { t } = useI18n();

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
                <div class="hidden lg:block relative z-50">
                    <UserMenu user={userData()} showDashboardLink={true} />
                </div>
            )}
        </Show>
    );
}
