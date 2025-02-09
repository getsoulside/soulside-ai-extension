const fs = require("fs");
const path = require("path");

const APP_ENV = process.env.APP_ENV || "dev";
const NODE_ENV = process.env.NODE_ENV || "development";

const buildFolder =
  NODE_ENV === "development"
    ? `build/extension-local-${APP_ENV}`
    : `build/extension-build-${APP_ENV}`;

// Read the template
const template = fs.readFileSync(path.resolve(__dirname, "manifest.template.json"), "utf-8");

const manifestJson = JSON.parse(template);

if (NODE_ENV === "development") {
  if (manifestJson?.host_permissions) {
    manifestJson.host_permissions.push("http://localhost:5173/*");
    manifestJson.host_permissions.push("http://localhost:5174/*");
  }
  manifestJson.name = `Soulside AI - Local (${APP_ENV.toUpperCase()})`;
} else {
  if (
    manifestJson?.content_scripts?.[0]?.js &&
    !manifestJson.content_scripts[0].js.includes("scripts/contentApp.bundle.js")
  ) {
    manifestJson.content_scripts[0].js.push("scripts/contentApp.bundle.js");
  }
  if (APP_ENV === "dev") {
    manifestJson.name = `Soulside AI - Dev`;
  }
}

const manifest = JSON.stringify(manifestJson, null, 2);

// Ensure the directory exists
const outputDir = path.resolve(__dirname, buildFolder);
fs.mkdirSync(outputDir, { recursive: true });

// Write the final manifest.json
fs.writeFileSync(path.join(outputDir, "manifest.json"), manifest);

console.log(`Manifest generated for ${APP_ENV} environment.`);
