import { defineConfig } from "vite";
import { loadEnv } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths";
import svgLoader from "vite-svg-loader";
import path from "path";
import cspPlugin from "vite-plugin-csp";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all environment variables for the current mode
  const envDir = path.resolve(__dirname, "../../env/");

  const env = loadEnv(mode, envDir, "SOULSIDE_");

  // Return the configuration
  return {
    define: {
      // Expose variables with your custom prefix
      __APP_ENV__: JSON.stringify(env),
    },
    plugins: [
      reactRefresh(),
      tsconfigPaths(),
      svgLoader(),
      cspPlugin({
        policy: {
          "script-src": ["self", "unsafe-eval", "unsafe-inline", "http://localhost:5174"],
        },
      }),
    ],
    build: {
      outDir: "build",
      rollupOptions: {
        output: {
          format: "iife" as const, // Type assertion to fix format type
          entryFileNames: "index.bundle.js",
        },
      },
      emptyOutDir: true,
    },
    server: {
      port: 5174, // Set dev server port to 5174
      strictPort: true,
    },
    envDir,
  };
});
