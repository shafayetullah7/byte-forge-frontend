import { config } from "~/lib/config";
import { toaster } from "~/components/ui/Toast";
import { resolveClientAuthMessage } from "./client-auth-message";
import { performLogout } from "./session";

/**
 * Soft logout: clears BF cookies via API; Aponika SSO may remain.
 * Used when token refresh fails — must not hit end_session.
 */
export { performLogout, logoutAction } from "./session";

export const BF_XSRF_COOKIE = "bf-xsrf-token";

/**
 * Federated logout URL — browser POSTs here; API clears cookies then submits
 * to IdP end_session (registered post_logout_redirect_uri only).
 */
export function buildFederatedLogoutUrl(): string {
  const base = config.api.baseUrl.replace(/\/$/, "");
  return `${base}/api/v1/user/auth/oidc/logout`;
}

/** Read a cookie value from a Cookie header string (testable without `document`). */
export function readCookieFromHeader(
  cookieHeader: string,
  name: string,
): string | undefined {
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function hasBfXsrfCookie(cookieHeader: string): boolean {
  const value = readCookieFromHeader(cookieHeader, BF_XSRF_COOKIE);
  return Boolean(value?.trim());
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return readCookieFromHeader(document.cookie, name);
}

/**
 * Top-level POST so CSRF cookie + form field are sent; GET is rejected.
 * If `bf-xsrf-token` is missing, soft-logout + toast instead of a silent 403.
 */
export function performFederatedLogout(options?: {
  allDevices?: boolean;
}): void {
  if (typeof window === "undefined") return;

  const xsrf = readCookie(BF_XSRF_COOKIE);
  if (!xsrf?.trim()) {
    void fallbackSoftLogoutMissingXsrf();
    return;
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = buildFederatedLogoutUrl();
  form.style.display = "none";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "xsrf";
  input.value = xsrf;
  form.appendChild(input);

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

async function fallbackSoftLogoutMissingXsrf(): Promise<void> {
  await performLogout();
  toaster.warning(resolveClientAuthMessage("logoutMissingXsrf"));
  window.location.assign("/");
}
