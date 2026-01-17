import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createEffect } from "solid-js";
import { Toaster } from "~/components/ui/Toast";
import "./app.css";
import { I18nContext, createI18n, type Locale } from "~/i18n";
import { getRequestEvent, isServer } from "solid-js/web";
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

export default function App() {
  const initialLocale = getInitialLocale();
  const i18n = createI18n(initialLocale);

  // Sync cookie when locale changes
  createEffect(() => {
    const loc = i18n.locale();
    if (!isServer) {
      document.cookie = `locale=${loc}; path=/; max-age=31536000; SameSite=Lax`;
    }
  });

  return (
    <I18nContext.Provider value={i18n}>
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
    </I18nContext.Provider>
  );
}
