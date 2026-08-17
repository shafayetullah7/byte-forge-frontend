import { ApiError } from "../types";
import {
  loginRedirect,
  loginRedirectFromRequest,
} from "../../auth/login-redirect";

/**
 * Handle API errors in SolidStart route loaders and server functions.
 * On 401, redirects to OIDC login.
 */
export function handleServerAuthError(
  error: unknown,
  returnTo?: string | null,
): void {
  if (error instanceof ApiError && error.statusCode === 401) {
    if (returnTo != null && returnTo !== "") {
      loginRedirect(returnTo);
    }
    loginRedirectFromRequest();
  }
}

export async function withServerAuthRedirect<T>(
  apiCall: () => Promise<T>,
  returnTo?: string | null,
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    handleServerAuthError(error, returnTo);
    throw error;
  }
}
