import { onMount } from "solid-js";
import { goToLoginFromLocation } from "~/lib/auth/login-redirect";

/** Client fallback when a 401 must start OIDC login (external URL). */
export function RedirectToLogin() {
  onMount(() => {
    goToLoginFromLocation(window.location.pathname, window.location.search);
  });

  return (
    <p class="text-sm text-center text-gray-500 dark:text-gray-400 py-8">
      Redirecting to sign in…
    </p>
  );
}
