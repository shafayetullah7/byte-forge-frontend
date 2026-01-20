import { query, redirect } from "@solidjs/router";
import { getSession } from "~/lib/auth";

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
    throw redirect("/login");
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
    throw redirect("/login");
  }
  
  if (!user.emailVerified) {
    throw redirect("/verify-account");
  }
  
  return user;
}, "verified-guard");
