import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createEffect } from "solid-js";
import { Toaster } from "~/components/ui/Toast";
import { I18nContext, createI18n, type Locale } from "~/i18n";
import { ThemeProvider, Theme } from "~/lib/context/theme-context";
import { getRequestEvent, isServer } from "solid-js/web";
import { useAutoTokenRefresh } from "~/lib/hooks/useTokenRefresh";
import "./app.css";
// import { parseCookies } from "vinxi/http";

function getInitialLocale(): Locale {
  if (isServer) {
    const event = getRequestEvent();
    if (event) {
      const cookieHeader = event.request.headers.get("cookie") || "";
      const match = cookieHeader.match(new RegExp("(^| )locale=([^;]+)"));
      return (match ? match[2] : "en") as Locale;
    }
  } else {
    // Client-side: parse document.cookie
    // Simple regex fallback if vinxi/http isn't available on client (it usually isn't)
    const match = document.cookie.match(new RegExp("(^| )locale=([^;]+)"));
    const cookieLocale = match ? match[2] : null;
    return (cookieLocale as Locale) || "en";
  }
  return "en";
}

function getInitialTheme(): Theme {
  if (isServer) {
    const event = getRequestEvent();
    if (event) {
      const cookieHeader = event.request.headers.get("cookie") || "";
      const match = cookieHeader.match(new RegExp("(^| )theme=([^;]+)"));
      return (match ? match[2] : "system") as Theme;
    }
  } else {
    // Client-side: parse document.cookie
    const match = document.cookie.match(new RegExp("(^| )theme=([^;]+)"));
    const cookieTheme = match ? match[2] : null;
    return (cookieTheme as Theme) || "system";
  }
  return "system";
}

export default function App() {
  const initialLocale = getInitialLocale();
  const initialTheme = getInitialTheme();
  const i18n = createI18n(initialLocale);

  // Sync cookie when locale changes
  createEffect(() => {
    const loc = i18n.locale();
    if (!isServer) {
      document.cookie = `locale=${loc}; path=/; max-age=31536000; SameSite=Lax`;
    }
  });

  // Initialize automatic token refresh for JWT authentication
  // This hook auto-manages token refresh based on session state (no return value needed)
  useAutoTokenRefresh();

  return (
    <I18nContext.Provider value={i18n}>
      <ThemeProvider initialTheme={initialTheme}>
        <Router
          root={(props) => (
            <Suspense>
              {props.children}
              <Toaster />
            </Suspense>
          )}
        >
          <FileRoutes />
        </Router>
      </ThemeProvider>
    </I18nContext.Provider>
  );
}
