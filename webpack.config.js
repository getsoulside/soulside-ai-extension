const path = require("path");
const webpack = require("webpack");

console.log("env", process.env.NODE_ENV);

module.exports = {
  entry: {
    background: "./src/background.js",
    content: "./src/content.js",
    advancedmdContent: "./src/content/advancedmd/main.js",
  },
  output: {
    filename: "[name].bundle.js", // Outputs background.bundle.js and content.bundle.js
    path: path.resolve(__dirname + "/build", "scripts"),
    clean: true,
  },
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV === "development" ? "inline-source-map" : false,
  devServer: {
    static: path.resolve(__dirname + "/build", "scripts"),
    hot: false, // Disable HMR for dev server
    liveReload: false, // Disable live reload for background scripts
    port: 9000,
    devMiddleware: {
      writeToDisk: true, // Write files to disk for Chrome to read
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!public-encrypt)/, // Exclude all node_modules except public-encrypt
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
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
  ],
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
    },
  },
};
