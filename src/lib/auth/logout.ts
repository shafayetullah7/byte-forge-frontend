import { config } from "~/lib/config";

/**
 * Soft logout: clears BF cookies via API; Aponika SSO may remain.
 */
export { performLogout, logoutAction } from "./session";

/**
 * Federated logout URL — browser navigates here; API clears cookies then submits
 * to IdP end_session (registered post_logout_redirect_uri only).
 */
export function buildFederatedLogoutUrl(): string {
  const base = config.api.baseUrl.replace(/\/$/, "");
  return `${base}/api/v1/user/auth/oidc/logout`;
}

export function performFederatedLogout(): void {
  if (typeof window === "undefined") return;
  window.location.assign(buildFederatedLogoutUrl());
}
