import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  middleware: "./src/middleware/index.ts",
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: "log-env",
        configResolved(config: any) {
          if (config.router?.name === "ssr") {
            console.log("\n--- Environment Configuration ---");
            console.log("VITE_API_BASE_URL:", config.env.VITE_API_BASE_URL);
            console.log("VITE_CLIENT_TIMEOUT:", config.env.VITE_CLIENT_TIMEOUT);
            console.log("VITE_SERVER_TIMEOUT:", config.env.VITE_SERVER_TIMEOUT);
            console.log("---------------------------------\n");
          }
        },
      },
    ],
  },
});
