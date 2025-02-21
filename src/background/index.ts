import { changeStorageValue, getCookie, getStorageValue, setCookie } from "./utils/storage";
import httpClient, { rawHttpClient } from "./utils/httpClient";
import parseCsv, { unParseCsv } from "./utils/parseCsv";

interface Message {
  action: string;
  key: string;
  value: string | any;
  apiMethod: "get" | "post" | "put" | "delete";
  apiOptions: any;
  isRawApiCall: boolean;
  pdfUrl: string;
  csvData: any;
}

chrome.runtime.onMessage.addListener(
  (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    // Verify message is from our extension by checking sender.id
    if (sender.id !== chrome.runtime.id) {
      return;
    }

    if (message.action === "getCookie") {
      getCookie(message.key).then(cookie => {
        sendResponse({ success: true, value: cookie });
      });
      return true;
    }
    if (message.action === "setCookie") {
      setCookie(message.key, message.value).then(cookie => {
        sendResponse({ success: true, value: cookie });
      });
      return true;
    }
    if (message.action === "getStorage") {
      getStorageValue(message.key).then(value => {
        sendResponse({ success: true, value });
      });
      return true;
    }
    if (message.action === "setStorage") {
      changeStorageValue(message.key, message.value).then(value => {
        sendResponse({ success: true, value });
      });
      return true;
    }
    if (message.action === "makeApiCall") {
      let apiMethod = message.apiMethod;
      let apiOptions = message.apiOptions;
      let isRawApiCall = message.isRawApiCall;
      let client = isRawApiCall ? rawHttpClient : httpClient;
      client[apiMethod](apiOptions)
        .then(response => {
          sendResponse({ success: true, value: response });
        })
        .catch(error => {
          sendResponse({ success: false, value: error });
        });
      return true;
    }
    if (message.action === "parseCsv") {
      parseCsv(message.pdfUrl)
        .then(response => {
          sendResponse({ success: true, value: response });
        })
        .catch(error => {
          sendResponse({ success: false, value: error });
        });
      return true;
    }
    if (message.action === "unParseCsv") {
      unParseCsv(message.csvData)
        .then(response => {
          sendResponse({ success: true, value: response });
        })
        .catch(error => {
          sendResponse({ success: false, value: error });
        });
      return true;
    }
    if (message.action === "loggedOut" || message.action === "loggedIn") {
      httpClient.reinitialize();
    }
  }
);

const ALLOWED_URL_PATTERNS = [
  "https://*.advancedmd.com/*",
  "https://*.allevasoft.com/*",
  "https://*.allevasoft.io/*",
  "https://*.alleva.io/*",
  "https://www.soulside.ai/*",
];

// Function to check if the URL matches allowed patterns
const isAllowedUrl = (url: string): boolean => {
  // Extract domain from URL
  const urlObj = new URL(url);
  const domain = urlObj.hostname;

  return ALLOWED_URL_PATTERNS.some(pattern => {
    // Convert wildcard pattern to regex pattern
    const patternDomain = new URL(pattern.replace("*.", "")).hostname.replace("*.", "");
    return domain.endsWith(patternDomain);
  });
};

const contentScripts = ["scripts/content.bundle.js"];

if (process.env.NODE_ENV !== "development") {
  contentScripts.push("scripts/contentApp.bundle.js");
}

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && isAllowedUrl(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: contentScripts,
    });
  }
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("soulsidehealth.com")) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const extensionInstalledDiv = document.createElement("input");
        extensionInstalledDiv.type = "hidden";
        extensionInstalledDiv.id = "soulside-ai-extension-installed";
        extensionInstalledDiv.value = "true";
        document.body.appendChild(extensionInstalledDiv);
      },
    });
  }
});
