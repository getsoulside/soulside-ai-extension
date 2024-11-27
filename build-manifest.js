const fs = require("fs");
const path = require("path");

const APP_ENV = process.env.APP_ENV || "dev";

// Define environment-specific values
const config = {
  dev: {
    APP_ENV: "dev",
    API_ENDPOINT: "https://backend.dev.soulsidehealth.com/api/v1",
    PLATFORM_URL: "https://ehr.dev.soulsidehealth.com",
  },
  prod: {
    APP_ENV: "prod",
    API_ENDPOINT: "https://backend.prod.soulsidehealth.com/api/v1",
    PLATFORM_URL: "https://ehr.soulsidehealth.com",
  },
};

// Read the template
const template = fs.readFileSync(path.resolve(__dirname, "manifest.template.json"), "utf-8");

// Replace placeholders with environment-specific values
const manifest = template.replace(/\$\{(.*?)\}/g, (_, key) => config[APP_ENV][key]);

// Write the final manifest.json
fs.writeFileSync(path.resolve(__dirname + "/build", "manifest.json"), manifest);

console.log(`Manifest generated for ${APP_ENV} environment.`);
