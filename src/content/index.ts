const injectReactApp = () => {
  if (process.env.NODE_ENV === "development") {
    const script = document.createElement("script");
    script.src = "http://localhost:5174/@vite/client"; // Loads Vite HMR
    script.type = "module";
    document.head.appendChild(script);
    const appScript = document.createElement("script");
    appScript.src = "http://localhost:5174/src/main.tsx"; // Adjust based on entry file
    appScript.type = "module";
    document.head.appendChild(appScript);
  }
};

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

  if (event.data.type === "SOULSIDE_LOGGED_IN") {
    chrome.runtime.sendMessage({ action: "loggedIn" });
  }

  if (event.data.type === "SOULSIDE_LOGGED_OUT") {
    chrome.runtime.sendMessage({ action: "loggedOut" });
  }
});

// Inject the React app
injectReactApp();
