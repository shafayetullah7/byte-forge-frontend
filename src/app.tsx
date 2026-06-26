import { MetaProvider, Title, Meta } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createEffect } from "solid-js";
import { revalidate } from "@solidjs/router";
import { Toaster } from "~/components/ui/Toast";
import { I18nContext, createI18n, type Locale } from "~/i18n";
import { ThemeProvider, Theme } from "~/lib/context/theme-context";
import { getRequestEvent, isServer } from "solid-js/web";
import { AutoTokenRefreshProvider } from "~/lib/hooks/useTokenRefresh";
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

  // Revalidate localized queries when locale changes
  let prevLocale = initialLocale;
  createEffect(() => {
    const newLocale = i18n.locale();
    if (prevLocale !== newLocale) {
      revalidate();
      prevLocale = newLocale;
    }
  });

  return (
    <I18nContext.Provider value={i18n}>
      <ThemeProvider initialTheme={initialTheme}>
        <Router
          root={(props) => (
            <MetaProvider>
              <Title>Byte Forge</Title>
              <Meta
                name="description"
                content="Bangladesh's plant marketplace — discover verified nurseries, shop indoor and outdoor plants, and order with COD."
              />
              <Meta property="og:site_name" content="Byte Forge" />
              <Meta property="og:type" content="website" />
              <Meta name="twitter:card" content="summary_large_image" />
              <Suspense
                fallback={
                  <div class="flex items-center justify-center min-h-screen">
                    <div class="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              >
                <AutoTokenRefreshProvider />
                {props.children}
                <Toaster />
              </Suspense>
            </MetaProvider>
          )}
        >
          <FileRoutes />
        </Router>
      </ThemeProvider>
    </I18nContext.Provider>
  );
}
