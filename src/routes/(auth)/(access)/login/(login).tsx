import { A, useSearchParams } from "@solidjs/router";
import { Show } from "solid-js";
import { Button } from "~/components/ui";
import { useI18n } from "~/i18n";
import { appendReturnToQuery } from "~/lib/auth";
import { config } from "~/lib/config";
import { ThemeToggle } from "~/components/layout/ThemeToggle";
import { LanguageSwitcher } from "~/components/layout/LanguageSwitcher";

export default function Login() {
  const [searchParams] = useSearchParams();
  const { t } = useI18n();

  const returnTo =
    typeof searchParams.returnTo === "string" ? searchParams.returnTo : "/";

  const handleOidcLogin = () => {
    if (!config.auth.oidcLoginEnabled) return;

    const loginUrl = appendReturnToQuery(config.auth.oidcLoginUrl, returnTo);
    window.location.assign(loginUrl);
  };

  const registerHref = () =>
    appendReturnToQuery(config.auth.aponikaRegisterUrl, returnTo);

  return (
    <div class="w-full sm:min-w-90 max-w-md">
      <div class="flex justify-end mb-4">
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher variant="compact" />
        </div>
      </div>

      <div class="space-y-6">
        <Show
          when={config.auth.oidcLoginEnabled}
          fallback={
            <p class="text-sm text-center text-gray-600 dark:text-gray-400">
              Sign-in is temporarily unavailable.
            </p>
          }
        >
          <Button
            type="button"
            variant="primary"
            size="lg"
            class="w-full"
            onClick={handleOidcLogin}
          >
            Sign in with Aponika
          </Button>
        </Show>

        <p class="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
          {t("auth.login.noAccount")}{" "}
          <A
            href={registerHref()}
            class="text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300 font-bold transition-colors underline-offset-4 hover:underline"
          >
            {t("auth.login.createAccount")}
          </A>
        </p>
      </div>
    </div>
  );
}
