import { query } from "@solidjs/router";
import { getSession } from "./session";
import { loginRedirectFromRequest } from "./login-redirect";

/**
 * Server-side route guard — requires OIDC-authenticated user.
 */
export const requireAuth = query(async () => {
  "use server";

  const user = await getSession();

  if (!user) {
    loginRedirectFromRequest();
  }

  return user;
}, "auth-guard");
