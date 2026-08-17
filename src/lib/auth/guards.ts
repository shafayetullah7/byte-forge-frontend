import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getSession } from "~/lib/auth";
import { buildLoginHrefFromLocation } from "~/lib/auth/return-to";

function loginRedirectUrl(): string {
  const event = getRequestEvent();
  if (event?.request.url) {
    const { pathname, search } = new URL(event.request.url);
    return buildLoginHrefFromLocation(pathname, search);
  }
  return "/login";
}

/**
 * Server-side route guard — requires OIDC-authenticated user.
 */
export const requireAuth = query(async () => {
  "use server";

  const user = await getSession();

  if (!user) {
    throw redirect(loginRedirectUrl());
  }

  return user;
}, "auth-guard");
