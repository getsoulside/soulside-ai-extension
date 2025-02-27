console.log("content script loaded");

const injectWebAccessibleScript = () => {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("scripts/webAccessibleScript.bundle.js");
  document.head.appendChild(script);
};

injectWebAccessibleScript();

const injectTrackingScript = () => {
  const trackingScript = document.createElement("script");
  trackingScript.src = chrome.runtime.getURL("scripts/trackingScript.bundle.js");
  document.head.appendChild(trackingScript);
  trackingScript.onload = () => {
    window.postMessage({ type: "LOG_ROCKET_INIT" }, "*");
  };
};

if (process.env.NODE_ENV === "development") {
  const injectReactApp = () => {
    const script = document.createElement("script");
    script.src = "http://localhost:5174/@vite/client"; // Loads Vite HMR
    script.type = "module";
    document.head.appendChild(script);
    const appScript = document.createElement("script");
    appScript.src = "http://localhost:5174/src/main.tsx"; // Adjust based on entry file
    appScript.type = "module";
    document.head.appendChild(appScript);
  };
  injectReactApp();
  // Listen for messages from the remote script
  window.addEventListener("message", async event => {
    if (event.source !== window) return; // Only accept messages from the same window

    if (event.data.type === "GET_SOULSIDE_COOKIE") {
      const { key, requestId } = event.data;
      chrome.runtime.sendMessage({ action: "getCookie", key }, response => {
        window.postMessage(
          { type: "GET_SOULSIDE_COOKIE_RESULT", requestId, key, value: response.value },
          "*"
        );
      });
    }

    if (event.data.type === "SET_SOULSIDE_COOKIE") {
      const { key, value, requestId } = event.data;
      chrome.runtime.sendMessage({ action: "setCookie", key, value }, response => {
        window.postMessage(
          { type: "SET_SOULSIDE_COOKIE_RESULT", requestId, key, value: response.value },
          "*"
        );
      });
    }

    if (event.data.type === "GET_SOULSIDE_STORAGE") {
      const { key, requestId } = event.data;
      chrome.runtime.sendMessage({ action: "getStorage", key }, response => {
        window.postMessage(
          { type: "GET_SOULSIDE_STORAGE_RESULT", requestId, key, value: response.value },
          "*"
        );
      });
    }

    if (event.data.type === "SET_SOULSIDE_STORAGE") {
      const { key, value, requestId } = event.data;
      chrome.runtime.sendMessage({ action: "setStorage", key, value }, response => {
        window.postMessage(
          { type: "SET_SOULSIDE_STORAGE_RESULT", requestId, key, value: response.value },
          "*"
        );
      });
    }

    if (event.data.type === "MAKE_SOULSIDE_API_CALL") {
      const { requestId, apiMethod, apiOptions, isRawApiCall } = event.data;
      chrome.runtime.sendMessage(
        { action: "makeApiCall", apiMethod, apiOptions, isRawApiCall },
        response => {
          window.postMessage(
            {
              type: "MAKE_SOULSIDE_API_CALL_RESULT",
              requestId,
              value: response.value,
              success: response.success,
            },
            "*"
          );
        }
      );
    }

    if (event.data.type === "SOULSIDE_PARSE_PDF") {
      const { pdfUrl, requestId } = event.data;
      chrome.runtime.sendMessage({ action: "parseCsv", pdfUrl }, response => {
        window.postMessage(
          {
            type: "SOULSIDE_PARSE_PDF_RESULT",
            requestId,
            value: response.value,
            success: response.success,
          },
          "*"
        );
      });
    }

    if (event.data.type === "SOULSIDE_UNPARSE_CSV") {
      const { csvData, requestId } = event.data;
      chrome.runtime.sendMessage({ action: "unParseCsv", csvData }, response => {
        window.postMessage(
          {
            type: "SOULSIDE_UNPARSE_CSV_RESULT",
            requestId,
            value: response.value,
            success: response.success,
          },
          "*"
        );
      });
    }

    if (event.data.type === "SOULSIDE_LOGGED_IN") {
      chrome.runtime.sendMessage({ action: "loggedIn" });
    }

    if (event.data.type === "SOULSIDE_LOGGED_OUT") {
      chrome.runtime.sendMessage({ action: "loggedOut" });
    }

    if (event.data.type === "SOULSIDE_START_SESSION") {
      const { startSessionOptions, requestId } = event.data;
      chrome.runtime.sendMessage(
        {
          action: "startSoulsideSession",
          startSessionOptions: startSessionOptions,
        },
        response => {
          window.postMessage(
            {
              type: "SOULSIDE_START_SESSION_RESULT",
              requestId,
              value: response.value,
              success: response.success,
            },
            "*"
          );
        }
      );
    }

    if (event.data.type === "SOULSIDE_CLOSE_SESSION") {
      chrome.runtime.sendMessage({ action: "closeSoulsideSession" });
    }

    if (event.data.type === "SOULSIDE_GO_BACK_TO_EHR") {
      chrome.runtime.sendMessage({ action: "goBackToEHR" });
    }

    if (event.data.type === "SOULSIDE_GET_SESSION_TAB_ID") {
      const { requestId } = event.data;
      chrome.runtime.sendMessage({ action: "getSessionTabId" }, response => {
        window.postMessage(
          { type: "SOULSIDE_GET_SESSION_TAB_ID_RESULT", requestId, value: response.value },
          "*"
        );
      });
    }
  });
} else {
  if (!window?.location?.hostname?.includes("advancedmd.com")) {
    injectTrackingScript();
  }
}
