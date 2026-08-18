import { config } from "~/lib/config";

/**
 * Soft logout: clears BF cookies via API; Aponika SSO may remain.
 * Used when token refresh fails — must not hit end_session.
 */
export { performLogout, logoutAction } from "./session";

const XSRF_COOKIE = "bf-xsrf-token";

/**
 * Federated logout URL — browser POSTs here; API clears cookies then submits
 * to IdP end_session (registered post_logout_redirect_uri only).
 */
export function buildFederatedLogoutUrl(): string {
  const base = config.api.baseUrl.replace(/\/$/, "");
  return `${base}/api/v1/user/auth/oidc/logout`;
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Top-level POST so CSRF cookie + form field are sent; GET is rejected. */
export function performFederatedLogout(options?: { allDevices?: boolean }): void {
  if (typeof window === "undefined") return;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = buildFederatedLogoutUrl();
  form.style.display = "none";

  const xsrf = readCookie(XSRF_COOKIE);
  if (xsrf) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "xsrf";
    input.value = xsrf;
    form.appendChild(input);
  }

  if (options?.allDevices) {
    const allDevices = document.createElement("input");
    allDevices.type = "hidden";
    allDevices.name = "allDevices";
    allDevices.value = "1";
    form.appendChild(allDevices);
  }

  document.body.appendChild(form);
  form.submit();
}
