const BLOCKED_RETURN_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-reset",
  "/verify-account",
] as const;

function isBlockedReturnPath(pathname: string): boolean {
  return BLOCKED_RETURN_PATHS.some(
    (blocked) => pathname === blocked || pathname.startsWith(`${blocked}/`),
  );
}

/**
 * Validates a returnTo query value as a safe in-app relative path.
 */
export function parseReturnToParam(
  value: string | string[] | undefined | null,
): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string" || !raw) return null;

  const pathname = raw.split("?")[0] ?? raw;
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return null;
  if (isBlockedReturnPath(pathname)) return null;

  return raw;
}

export function safeReturnTo(
  value: string | string[] | undefined | null,
  fallback = "/",
): string {
  return parseReturnToParam(value) ?? fallback;
}

export function buildLoginHref(returnTo?: string | string[] | null): string {
  const safe = parseReturnToParam(returnTo ?? undefined);
  if (!safe) return "/login";
  return `/login?returnTo=${encodeURIComponent(safe)}`;
}

export function buildLoginHrefFromLocation(pathname: string, search = ""): string {
  const normalizedSearch = search
    ? search.startsWith("?")
      ? search
      : `?${search}`
    : "";
  const pathnameOnly = pathname.split("?")[0] ?? pathname;

  if (isBlockedReturnPath(pathnameOnly)) {
    return "/login";
  }

  const returnPath = `${pathnameOnly}${normalizedSearch}`;
  return buildLoginHref(returnPath);
}

export function appendReturnToQuery(
  href: string,
  returnTo?: string | string[] | null,
): string {
  const safe = parseReturnToParam(returnTo ?? undefined);
  if (!safe) return href;

  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}returnTo=${encodeURIComponent(safe)}`;
}
