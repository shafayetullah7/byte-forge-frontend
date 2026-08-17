import { redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { config } from "~/lib/config";
import { appendReturnToQuery, parseReturnToParam } from "./return-to";

const BLOCKED_RETURN_PATHS = ["/login"] as const;

function isBlockedReturnPath(pathname: string): boolean {
  return BLOCKED_RETURN_PATHS.some(
    (blocked) => pathname === blocked || pathname.startsWith(`${blocked}/`),
  );
}

/**
 * OIDC login start URL (API-owned). Top-level GET only — use with `<a href>` or
 * `window.location.assign`, not Solid `navigate()`.
 */
export function getOidcLoginUrl(returnTo?: string | string[] | null): string {
  const base = config.auth.oidcLoginUrl;
  const safe = parseReturnToParam(returnTo ?? undefined);
  return appendReturnToQuery(base, safe);
}

/** Build OIDC login URL preserving the current in-app path as returnTo. */
export function getOidcLoginUrlFromLocation(
  pathname: string,
  search = "",
): string {
  const normalizedSearch = search
    ? search.startsWith("?")
      ? search
      : `?${search}`
    : "";
  const pathnameOnly = pathname.split("?")[0] ?? pathname;

  if (isBlockedReturnPath(pathnameOnly)) {
    return getOidcLoginUrl("/");
  }

  const returnPath = `${pathnameOnly}${normalizedSearch}`;
  return getOidcLoginUrl(returnPath);
}

/** Client-only: full-page redirect to OIDC login. */
export function goToLogin(returnTo?: string | string[] | null): void {
  if (typeof window === "undefined") return;
  window.location.assign(getOidcLoginUrl(returnTo));
}

/** Client-only: OIDC login with current page as returnTo. */
export function goToLoginFromLocation(pathname: string, search = ""): void {
  if (typeof window === "undefined") return;
  window.location.assign(getOidcLoginUrlFromLocation(pathname, search));
}

/** Server route guard / loader: redirect to OIDC login. */
export function loginRedirect(returnTo?: string | string[] | null): never {
  throw redirect(getOidcLoginUrl(returnTo));
}

/** Server: redirect using the incoming request URL as returnTo. */
export function loginRedirectFromRequest(): never {
  const event = getRequestEvent();
  if (event?.request.url) {
    const { pathname, search } = new URL(event.request.url);
    throw redirect(getOidcLoginUrlFromLocation(pathname, search));
  }
  throw redirect(getOidcLoginUrl("/"));
}
