import { onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { parseReturnToParam, safeReturnTo } from "~/lib/auth/return-to";
import { goToLogin, loginRedirect } from "~/lib/auth/login-redirect";

function resolveLoginReturnTo(
  returnToParam: string | string[] | undefined,
): string {
  const raw = Array.isArray(returnToParam) ? returnToParam[0] : returnToParam;
  return parseReturnToParam(raw) ?? safeReturnTo(raw, "/");
}

export const route = {
  load: () => {
    const event = getRequestEvent();
    if (event?.request.url) {
      const url = new URL(event.request.url);
      loginRedirect(
        resolveLoginReturnTo(url.searchParams.get("returnTo") ?? undefined),
      );
    }
    loginRedirect("/");
  },
};

/**
 * Legacy `/login` path — immediate redirect to API OIDC login (no launcher UI).
 */
export default function LoginRedirect() {
  const [searchParams] = useSearchParams();

  onMount(() => {
    goToLogin(resolveLoginReturnTo(searchParams.returnTo));
  });

  return (
    <p class="text-sm text-center text-gray-500 dark:text-gray-400">
      Redirecting to sign in…
    </p>
  );
}
