import { getCookie } from "../background/utils/storage";

const injectReactApp = () => {
  const rootDivId = "soulside-extension-root";

  // Create a root div if it doesn't exist
  let rootDiv = document.getElementById(rootDivId);
  if (!rootDiv) {
    rootDiv = document.createElement("div");
    rootDiv.id = rootDivId;
    document.body.appendChild(rootDiv);
  }

  // Load React's main script
  const script = document.createElement("script");
  script.src = "http://localhost:5174/src/main.tsx";
  script.type = "module";
  script.async = true;
  document.body.appendChild(script);
};

chrome.runtime.sendMessage({ action: "getCookie", key: "authtoken" }, response => {
  console.log("response", response);
});

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
});

// Inject the React app
injectReactApp();
