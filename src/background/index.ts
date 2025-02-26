import { changeStorageValue, getCookie, getStorageValue, setCookie } from "./utils/storage";
import httpClient, { rawHttpClient } from "./utils/httpClient";
import parseCsv, { unParseCsv } from "./utils/parseCsv";
import WebsocketClient from "./utils/websocketClient";

interface Message {
  action: string;
  key: string;
  value: string | any;
  apiMethod: "get" | "post" | "put" | "delete";
  apiOptions: any;
  isRawApiCall: boolean;
  pdfUrl: string;
  csvData: any;
  remoteFileUrl: string;
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
    if (message.action === "websocket") {
      const { socketAction, namespace, query, event, data } = message.value;

      if (socketAction === "connect") {
        const client = WebsocketClient.getInstance({ url: namespace, query });
        sendResponse({ success: true, value: "connected" });
      } else if (socketAction === "disconnect") {
        const client = WebsocketClient.getInstance({ url: namespace, query });
        client.disconnect();
        sendResponse({ success: true, value: "disconnected" });
      } else if (socketAction === "emit") {
        const client = WebsocketClient.getInstance({ url: namespace, query });
        client.getSocket().emit(event, data);
        sendResponse({ success: true });
      } else if (socketAction === "on") {
        const client = WebsocketClient.getInstance({ url: namespace, query });
        client.getSocket().on(event, (responseData: any) => {
          // Send message to content script
          if (sender.tab?.id) {
            // If the request came from a tab (content script), send directly to that tab
            chrome.tabs.sendMessage(sender.tab.id, {
              type: "SOULSIDE_WEBSOCKET_EVENT",
              namespace,
              event,
              data: responseData,
            });
          } else {
            // If the request didn't come from a tab (e.g., web accessible resources),
            // broadcast to all tabs matching our allowed URLs
            chrome.tabs.query({ url: ALLOWED_URL_PATTERNS }, tabs => {
              tabs.forEach(tab => {
                if (tab.id) {
                  chrome.tabs.sendMessage(tab.id, {
                    type: "SOULSIDE_WEBSOCKET_EVENT",
                    namespace,
                    event,
                    data: responseData,
                  });

                  // Also inject a script to broadcast via window.postMessage
                  chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: eventData => {
                      window.postMessage(eventData, "*");
                    },
                    args: [
                      {
                        type: "SOULSIDE_WEBSOCKET_EVENT",
                        namespace,
                        event,
                        data: responseData,
                      },
                    ],
                  });
                }
              });
            });
          }
        });
        sendResponse({ success: true });
      }
      return true;
    }
    if (message.action === "fetchRemoteFileDataUrl") {
      rawHttpClient
        .get({ url: message.remoteFileUrl, config: { responseType: "blob" } })
        .then((response: any) => {
          // Convert blob to base64
          console.log("response", response);
          const reader = new FileReader();
          reader.onloadend = () => {
            sendResponse({
              success: true,
              value: {
                audioData: reader.result,
                type: response.data.type,
              },
            });
          };
          reader.readAsArrayBuffer(response.data);
          return true;
        })
        .catch(error => {
          console.error("Error fetching remote file data:", error);
          sendResponse({ success: false, value: error.message });
        });
      return true; // Will respond asynchronously
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
    // Only execute scripts if they haven't been injected yet
    chrome.scripting
      .executeScript({
        target: { tabId },
        func: () => {
          const scriptTag = document.querySelector('script[data-soulside-scripts="injected"]');
          if (!scriptTag) {
            const marker = document.createElement("script");
            marker.setAttribute("data-soulside-scripts", "injected");
            document.head.appendChild(marker);
            return true;
          }
          return false;
        },
      })
      .then(results => {
        // Only inject if the marker wasn't found
        if (results[0].result) {
          chrome.scripting.executeScript({
            target: { tabId },
            files: contentScripts,
          });
        }
      });
  }
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    (tab.url.includes("soulsidehealth.com") || tab.url.includes("localhost"))
  ) {
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
