const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv");

console.log("env", process.env.NODE_ENV);

const buildFolder = "extension-build";

module.exports = env => {
  const nodeEnv = process.env.NODE_ENV || "development"; // Default to 'development' if NODE_ENV is not set
  const appEnv = process.env.APP_ENV === "dev" ? "development" : "production";
  const envPaths = [".env", `.env.${appEnv}`]; // Load .env .env.<APP_ENV>;
  if (nodeEnv === "development") {
    envPaths.push(`.env.${appEnv}.local`); // Load .env.<APP_ENV>.local;
  }
  return {
    entry: {
      background: "./src/background/index.ts",
      content: "./src/content/index.ts",
    },
    output: {
      filename: "[name].bundle.js", // Outputs background.bundle.js and content.bundle.js
      path: path.resolve(__dirname + `/${buildFolder}/scripts`),
      clean: true,
    },
    mode: nodeEnv === "production" ? "production" : "development",
    devtool: nodeEnv === "development" ? "inline-source-map" : false,
    devServer: {
      static: path.resolve(__dirname + `/${buildFolder}/scripts`),
      hot: true, // Disable HMR for dev server
      liveReload: true, // Disable live reload for background scripts
      port: 9000,
      devMiddleware: {
        writeToDisk: true, // Write files to disk for Chrome to read
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader", // Use TypeScript loader
          exclude: [/node_modules/, path.resolve(__dirname, "/src/content-app")],
        },
        // Add a rule to exclude all `.pem` files from being bundled
        {
          test: /\.pem$/,
          loader: "ignore-loader", // Ignore .pem files
        },
      ],
    },
    plugins: [
      // Ignore the test files in the package
      new webpack.IgnorePlugin({
        resourceRegExp: /\/test\//, // Match all test files in node_modules
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src/assets"),
            to: path.resolve(__dirname, `${buildFolder}/assets`),
          },
        ],
      }),
      new webpack.DefinePlugin(
        envPaths.reduce((acc, envPath) => {
          const envConfig = Dotenv.config({ path: envPath }).parsed;
          for (const key in envConfig) {
            acc[`process.env.${key}`] = JSON.stringify(envConfig[key]);
          }
          return acc;
        }, {})
      ),
    ],
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
        crypto: require.resolve("crypto-browserify"),
      },
    },
  };
};
