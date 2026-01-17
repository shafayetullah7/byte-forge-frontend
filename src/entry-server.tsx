// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
// import { parseCookies } from "vinxi/http"; // Removed due to type mismatch

export default createHandler((event) => {
  const cookieHeader = event.request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp("(^| )locale=([^;]+)"));
  const locale = match ? match[2] : "en";

  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang={locale}>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
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
