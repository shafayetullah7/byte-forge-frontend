import { ApiError } from "../types";
import { getOidcLoginUrlFromLocation } from "../../auth/login-redirect";

function defaultOidcLoginUrl(): string {
  return getOidcLoginUrlFromLocation(
    window.location.pathname,
    window.location.search,
  );
}

/**
 * Client-Side Auth Redirect Wrapper
 *
 * On 401, performs a full-page redirect to OIDC login (external API URL).
 */
export async function withAuthRedirect<T>(
  apiCall: () => Promise<T>,
  redirectUrl?: string,
): Promise<T> {
  if (typeof window === "undefined") {
    throw new Error(
      "withAuthRedirect() can only be used on the client. " +
        "Use withServerAuthRedirect() for server-side code.",
    );
  }

  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      const loginUrl = redirectUrl ?? defaultOidcLoginUrl();
      console.info(`[Auth] Redirecting to OIDC login due to 401`);
      window.location.href = loginUrl;
      throw error;
    }

    throw error;
  }
}

export async function withAuthRedirectCustom<T>(
  apiCall: () => Promise<T>,
  onUnauthorized: (error: ApiError) => void,
  redirectUrl?: string,
): Promise<T> {
  if (typeof window === "undefined") {
    throw new Error(
      "withAuthRedirectCustom() can only be used on the client. " +
        "Use withServerAuthRedirect() for server-side code.",
    );
  }

  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      onUnauthorized(error);
      const loginUrl = redirectUrl ?? defaultOidcLoginUrl();
      console.info(`[Auth] Redirecting to OIDC login due to 401`);
      window.location.href = loginUrl;
      throw error;
    }

    throw error;
  }
}
