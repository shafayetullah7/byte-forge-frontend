export const OIDC_ERROR_CODES = [
  "access_denied",
  "login_required",
  "temporarily_unavailable",
  "provision_failed",
  "token_exchange_failed",
  "failed",
] as const;

export type OidcErrorCode = (typeof OIDC_ERROR_CODES)[number];

const ALLOWED = new Set<string>(OIDC_ERROR_CODES);

export function parseOidcErrorParam(
  value: string | string[] | undefined | null,
): OidcErrorCode | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string" || !raw.trim()) {
    return null;
  }

  const code = raw.trim();
  if (ALLOWED.has(code)) {
    return code as OidcErrorCode;
  }

  return "failed";
}

/** Auto-redirect to OIDC only when there is no error to show. */
export function shouldAutoRedirectToOidcLogin(
  oidcError: string | string[] | undefined | null,
): boolean {
  return parseOidcErrorParam(oidcError) === null;
}

export function oidcErrorMessageKey(code: OidcErrorCode): string {
  return `auth.oidcError.${code}`;
}
