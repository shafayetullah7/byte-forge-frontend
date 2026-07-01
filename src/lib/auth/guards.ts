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
 * Server-side route guard - Requires user to be authenticated
 * 
 * @throws {Response} Redirects to /login if not authenticated
 * @returns {Promise<AuthUser>} Authenticated user
 * 
 * @example
 * ```typescript
 * // In route file
 * export const route = {
 *   load: () => requireAuth()
 * };
 * ```
 */
export const requireAuth = query(async () => {
  "use server";
  
  const user = await getSession();
  
  if (!user) {
    throw redirect(loginRedirectUrl());
  }
  
  return user;
}, "auth-guard");

/**
 * Server-side route guard - Requires user to have verified email
 * 
 * @throws {Response} Redirects to /login if not authenticated
 * @throws {Response} Redirects to /verify-account if email not verified
 * @returns {Promise<AuthUser>} Authenticated user with verified email
 * 
 * @example
 * ```typescript
 * // In protected route file
 * export const route = {
 *   load: () => requireVerifiedEmail()
 * };
 * ```
 */
export const requireVerifiedEmail = query(async () => {
  "use server";
  
  // Call getSession directly instead of requireAuth to avoid nesting query functions
  const user = await getSession();
  
  if (!user) {
    throw redirect(loginRedirectUrl());
  }
  
  if (!user.emailVerified) {
    throw redirect("/verify-account");
  }
  
  return user;
}, "verified-guard");
