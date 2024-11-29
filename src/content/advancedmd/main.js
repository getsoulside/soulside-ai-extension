import { addIframe, findAndRemovePatientChartIframes } from "./iframeManager.js";
import { IFRAME_TYPES } from "./constants.js";
import {
  BrowserClient,
  defaultStackParser,
  getDefaultIntegrations,
  makeFetchTransport,
  Scope,
} from "@sentry/browser";

console.log("Soulside Extension Script Injected");
try {
  // filter integrations that use the global variable
  const integrations = getDefaultIntegrations({}).filter(defaultIntegration => {
    return !["BrowserApiErrors", "Breadcrumbs", "GlobalHandlers"].includes(defaultIntegration.name);
  });
  const client = new BrowserClient({
    dsn: "https://fdb0d58fe1d1acba4380809373777a3c@o4507034879066112.ingest.us.sentry.io/4508383422382080",
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    integrations: integrations,
  });
  const scope = new Scope();
  scope.setClient(client);
  client.init(); // initializing has to be done after setting the client on the scope

  // You can capture exceptions manually for this client like this:
  const originalLog = console.log;
  const originalErrorLog = console.error;
  console.error = (...args) => {
    originalErrorLog(...args);
    const logMessage = args
      .map(arg => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg))
      .join(" ");
    scope.captureException(new Error(logMessage), {
      extra: {
        args, // Send the original arguments as extra data
      },
    });
  };
  console.log = (...args) => {
    originalLog(...args);
    const logMessage = args
      .map(arg => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg))
      .join(" ");
    scope.captureMessage(logMessage, "info", {
      level: "info", // Set the log level as "info" for regular logs
      extra: {
        args, // Send the original arguments as extra data
      },
    });
  };
} catch (error) {
  console.log("Error initiating Sentry");
}

const rootObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.tagName === "IFRAME" && node.src.includes(IFRAME_TYPES.PATIENT_CHART)) {
        addIframe(node, IFRAME_TYPES.PATIENT_CHART);
      }
    });

    mutation.removedNodes.forEach(node => {
      findAndRemovePatientChartIframes(node);
    });
  });
});

// Start observing the document
rootObserver.observe(document.body, { childList: true, subtree: true });

// Handle existing iframes
document.querySelectorAll("iframe").forEach(iframe => {
  if (iframe.src.includes(IFRAME_TYPES.PATIENT_CHART)) {
    addIframe(iframe, IFRAME_TYPES.PATIENT_CHART);
  }
});
