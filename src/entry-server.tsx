// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
// import { parseCookies } from "vinxi/http"; // Removed due to type mismatch

export default createHandler((event) => {
  const cookieHeader = event.request.headers.get("cookie") || "";
  const matchLocale = cookieHeader.match(new RegExp("(^| )locale=([^;]+)"));
  const locale = matchLocale ? matchLocale[2] : "en";

  const matchTheme = cookieHeader.match(new RegExp("(^| )theme=([^;]+)"));
  const theme = matchTheme ? matchTheme[2] : "system";

  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang={locale} class={theme === "dark" ? "dark" : ""}>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
            {/* Theme Pre-loader Script */}
            <script
              innerHTML={`
              (function() {
                const theme = document.cookie.match(/(^| )theme=([^;]+)/)?.[2] || 'system';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })()
            `}
            />
            {assets}
          </head>
          <body>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      )}
    />
  );
});
