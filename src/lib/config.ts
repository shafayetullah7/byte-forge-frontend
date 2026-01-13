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
  isDev: import.meta.env.DEV,
  isServer: typeof window === "undefined",
} as const;

export type AppConfig = typeof config;
