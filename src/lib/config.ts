/**
 * Global Application Configuration
 * Bridges environment variables from .env to the rest of the application.
 * Works on both Server-Side (SSR) and Client-Side (CSR).
 */
export const config = {
  api: {
    // Vite requires VITE_ prefix to expose variables to the browser
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
    timeout: {
      client: Number(import.meta.env.VITE_CLIENT_TIMEOUT) || 30000,
      server: Number(import.meta.env.VITE_SERVER_TIMEOUT) || 10000,
    },
  },
  auth: {
    loginUrl: "/login",
    registerUrl: "/register",
    verifyUrl: "/verify-account",
  },
  publicShopApi: {
    profile: import.meta.env.VITE_PUBLIC_SHOP_API_PROFILE === "true",
    products: import.meta.env.VITE_PUBLIC_SHOP_API_PRODUCTS === "true",
    reviews: import.meta.env.VITE_PUBLIC_SHOP_API_REVIEWS === "true",
  },
  isDev: import.meta.env.DEV,
  isServer: typeof window === "undefined",
} as const;

console.log("config: ", config);

export type AppConfig = typeof config;
