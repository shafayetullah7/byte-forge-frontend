import { Show, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { parseReturnToParam, safeReturnTo } from "~/lib/auth/return-to";
import { goToLogin, loginRedirect, getOidcLoginUrl } from "~/lib/auth/login-redirect";
import {
  oidcErrorMessageKey,
  parseOidcErrorParam,
  shouldAutoRedirectToOidcLogin,
} from "~/lib/auth/oidc-error";
import { useI18n } from "~/i18n";
import LinkButton from "~/components/ui/LinkButton";

function resolveLoginReturnTo(
  returnToParam: string | string[] | undefined,
): string {
  const raw = Array.isArray(returnToParam) ? returnToParam[0] : returnToParam;
  return parseReturnToParam(raw) ?? safeReturnTo(raw, "/");
}

function oidcErrorFromUrl(url: string): string | null {
  return new URL(url).searchParams.get("oidc_error");
}

export const route = {
  load: () => {
    const event = getRequestEvent();
    if (event?.request.url) {
      const url = new URL(event.request.url);
      if (!shouldAutoRedirectToOidcLogin(oidcErrorFromUrl(event.request.url))) {
        return;
      }
      loginRedirect(
        resolveLoginReturnTo(url.searchParams.get("returnTo") ?? undefined),
      );
    }
    loginRedirect("/");
  },
};

/**
 * `/login` — OIDC start unless `oidc_error` is present (show message, do not loop).
 */
export default function LoginRedirect() {
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const errorCode = () => parseOidcErrorParam(searchParams.oidc_error);

  onMount(() => {
    if (shouldAutoRedirectToOidcLogin(searchParams.oidc_error)) {
      goToLogin(resolveLoginReturnTo(searchParams.returnTo));
    }
  });

  return (
    <Show
      when={errorCode()}
      keyed
      fallback={
        <p class="text-sm text-center text-gray-500 dark:text-gray-400">
          {t("auth.oidcError.redirecting")}
        </p>
      }
    >
      {(code) => (
        <div class="mx-auto max-w-md px-4 py-16 text-center">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("auth.oidcError.title")}
          </h1>
          <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {t(oidcErrorMessageKey(code))}
          </p>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href={getOidcLoginUrl("/")} variant="primary">
              {t("auth.oidcError.tryAgain")}
            </LinkButton>
            <LinkButton href="/" variant="secondary">
              {t("common.home")}
            </LinkButton>
          </div>
        </div>
      )}
    </Show>
  );
}
