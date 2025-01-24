import { defineConfig } from "vite";
import { loadEnv } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths";
import svgLoader from "vite-svg-loader";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all environment variables for the current mode
  const envDir = path.resolve(__dirname, "../../env/");
  console.log("envDir", envDir);

  const env = loadEnv(mode, envDir, "SOULSIDE_");
  console.log("env", JSON.stringify(env), mode);

  // Return the configuration
  return {
    define: {
      // Expose variables with your custom prefix
      __APP_ENV__: JSON.stringify(env),
    },
    plugins: [reactRefresh(), tsconfigPaths(), svgLoader()],
    envDir,
  };
});
