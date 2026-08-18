import { query, createAsync, action } from "@solidjs/router";
import { authApi } from "~/lib/api/endpoints/user/auth.api";
import { invalidateAllCart } from "~/lib/api/endpoints/buyer/cart.api";
import { invalidateWishlist } from "~/lib/api/endpoints/buyer/wishlist.api";
import { invalidateAllOrders } from "~/lib/api/endpoints/buyer/orders.api";

/**
 * Session Management for ByteForge Frontend
 *
 * OIDC-only: session is resolved via the API resource server (`oidc-check`).
 * Access tokens live in HTTP-only cookies on the API host (`bfAccessToken`).
 */

function logSessionCheckFailure(error: unknown): void {
  if (!import.meta.env.DEV) return;
  const message = error instanceof Error ? error.message : String(error);
  console.warn("[Auth] oidc-check failed:", message);
}

export const getSession = query(async () => {
  "use server";
  try {
    return await authApi.oidcCheck();
  } catch (error) {
    logSessionCheckFailure(error);
    return null;
  }
}, "user-session");

export const logoutAction = action(async (): Promise<{ success: boolean }> => {
  "use server";
  try {
    await authApi.logout();
  } catch (error: unknown) {
    const statusCode =
      typeof error === "object" && error !== null
        ? (error as Record<string, unknown>)?.statusCode
        : undefined;
    if (statusCode !== 401) {
      console.error("[Auth] Logout API error:", error);
    }
  }

  const { revalidate } = await import("@solidjs/router");
  await revalidate("user-session");

  try {
    await authApi.oidcCheck();
    return { success: false };
  } catch {
    invalidateAllCart();
    invalidateWishlist();
    invalidateAllOrders();
    return { success: true };
  }
}, "logout-action");

export const performLogout = async (): Promise<boolean> => {
  const result = await logoutAction();
  return result.success;
};

export const useSession = () => createAsync(() => getSession(), { deferStream: true });
