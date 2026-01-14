import { query, createAsync } from "@solidjs/router";
import { authApi } from "~/lib/api";

/**
 * Server-side session loader
 * Uses SolidStart's query to ensure the check only happens once per request
 * on the server, and is hydrated correctly on the client.
 */
export const getSession = query(async () => {
  "use server";
  try {
    const response = await authApi.checkAuth();
    return response.success ? response.data : null;
  } catch (error) {
    // Fail silently for public session checks
    return null;
  }
}, "user-session");

/**
 * Client/Server hook to access the current session
 * Components using this will only trigger an auth check if they are rendered.
 */
export const useSession = () => createAsync(() => getSession());
