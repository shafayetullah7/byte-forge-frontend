/**
 * Global Application Configuration
 * Bridges environment variables from .env to the rest of the application.
 */
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
    timeout: {
      client: Number(import.meta.env.VITE_CLIENT_TIMEOUT) || 30000,
      server: Number(import.meta.env.VITE_SERVER_TIMEOUT) || 10000,
    },
  },
  auth: {
    loginUrl: "/login",
    /** External Aponika account registration (OIDC IdP) */
    get registerUrl(): string {
      return (
        import.meta.env.VITE_APONIKA_REGISTER_URL ||
        "http://localhost:3011/register"
      );
    },
    oidcLoginEnabled: import.meta.env.VITE_OIDC_LOGIN_ENABLED !== "false",
    aponikaRegisterUrl:
      import.meta.env.VITE_APONIKA_REGISTER_URL ||
      "http://localhost:3011/register",
    /** API-owned OIDC login — sets bfAccessToken on the API host */
    get oidcLoginUrl(): string {
      const base = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3005").replace(
        /\/$/,
        "",
      );
      return `${base}/api/v1/user/auth/oidc/login`;
    },
  },
  isDev: import.meta.env.DEV,
  isServer: typeof window === "undefined",
  campaignsEnabled: true,
  articlesEnabled: true,
  followEnabled: true,
  get shopPhaseCEnabled(): boolean {
    return this.campaignsEnabled && this.articlesEnabled && this.followEnabled;
  },
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "",
};

export type AppConfig = typeof config;
