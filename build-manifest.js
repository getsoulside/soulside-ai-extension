const fs = require("fs");
const path = require("path");

const APP_ENV = process.env.APP_ENV || "dev";

// Read the template
const template = fs.readFileSync(path.resolve(__dirname, "manifest.template.json"), "utf-8");

// Replace placeholders with environment-specific values
const manifest = template;

// Ensure the directory exists
const outputDir = path.resolve(__dirname, "extension-build");
fs.mkdirSync(outputDir, { recursive: true });

// Write the final manifest.json
fs.writeFileSync(path.join(outputDir, "manifest.json"), manifest);

console.log(`Manifest generated for ${APP_ENV} environment.`);
