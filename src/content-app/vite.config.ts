import { defineConfig } from "vite";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all environment variables for the current mode
  const envDir = path.resolve(__dirname, "../../../");
  const env = loadEnv(mode, envDir, "SOULSIDE_");

  // Return the configuration
  return {
    define: {
      // Expose variables with your custom prefix
      __APP_ENV__: JSON.stringify(env),
    },
    plugins: [react(), tsconfigPaths()],
  };
});
