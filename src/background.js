import { getUserInfo, loginRedirect } from "./auth.js";
import { fetchNotesFromSoulside } from "./modules/fetchSoulsideNotes.js";
import { getCookieName, changeStorageValue } from "./services/utils.js";
import {
  BrowserClient,
  defaultStackParser,
  getDefaultIntegrations,
  makeFetchTransport,
  Scope,
} from "@sentry/browser";

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

let advancedMdTabs = [];

function registerListeners() {
  console.log("Registering listeners...");

  chrome.tabs.onUpdated.removeListener(tabUpdateListener);
  chrome.tabs.onRemoved.removeListener(removeTabListener);
  chrome.cookies.onChanged.removeListener(cookieChangeListener);

  chrome.tabs.onUpdated.addListener(tabUpdateListener);
  chrome.tabs.onRemoved.addListener(removeTabListener);
  chrome.cookies.onChanged.addListener(cookieChangeListener);
}

registerListeners();

function cookieChangeListener(changes) {
  if (changes?.cookie?.name === getCookieName("authtoken")) {
    changeStorageValue("userInfo", null);
  }
}

function tabUpdateListener(tabId, changeInfo, tab) {
  const advancedmdRegex = /^wc-wfe-\d+\.advancedmd\.com$/;
  if (changeInfo.status === "complete" && advancedmdRegex.test(new URL(tab.url).hostname)) {
    console.log("Injecting Script", tabId);
    advancedMdTabs.push(tabId);
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["scripts/advancedmdContent.bundle.js"],
    });
  }
}

function removeTabListener(tabId, removeInfo) {
  if (advancedMdTabs.includes(tabId)) {
    advancedMdTabs = advancedMdTabs.filter(i => i !== tabId);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getSoulsideChiefComplaint") {
    fetchNotesFromSoulside(message.visitId)
      .then(soulsideChiefComplaint => {
        sendResponse({ success: true, value: soulsideChiefComplaint });
      })
      .catch(error => {
        console.error("CC Fetch error", error);
        sendResponse({ success: false, error });
      });

    return true; // Keep the message channel open for async response
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "soulsideLoginExpired") {
    loginRedirect()
      .then(() => {
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error("error", error);
        sendResponse({ success: false, error });
      });

    return true; // Keep the message channel open for async response
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
  registerListeners();
  getUserInfo()
    .then(userInfo => {
      console.log("userInfo", userInfo);
    })
    .catch(error => {
      console.error("Extension Install Fetch Userinfo error:", error);
    });
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension Restarted");
  registerListeners();
  getUserInfo()
    .then(userInfo => {
      console.log("userInfo", userInfo);
    })
    .catch(error => {
      console.error("Extension Restart Fetch Userinfo error:", error);
    });
});

chrome.runtime.onSuspend.addListener(() => {
  console.log("Extension is being unloaded. Cleaning up listeners.");
  chrome.tabs.onUpdated.removeListener(tabUpdateListener);
  chrome.tabs.onRemoved.removeListener(removeTabListener);
  chrome.cookies.onChanged.removeListener(cookieChangeListener);
});
