const injectReactApp = () => {
  const rootDivId = "soulside-extension-root";

  // Create a root div if it doesn't exist
  let rootDiv = document.getElementById(rootDivId);
  if (!rootDiv) {
    rootDiv = document.createElement("div");
    rootDiv.id = rootDivId;
    document.body.appendChild(rootDiv);
  }

  //get chrome tab id
  // chrome.runtime.sendMessage({ action: "getCurrentTab" }, tab => {
  //   chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     files: ["../../extension-build/scripts/content-app/index.bundle.js"],
  //   });
  // });

  //execute the content-app script from '../../extension-build/scripts/content-app/index.bundle.js'
  // const contentAppScript = document.createElement("script");
  // contentAppScript.src = "../../extension-build/scripts/content-app/index.bundle.js";
  // contentAppScript.type = "module";
  // contentAppScript.async = true;
  // contentAppScript.crossOrigin = "anonymous";
  // document.body.appendChild(contentAppScript);

  const scriptUrl = "http://localhost:5174";

  //add a iframe to the tab for the scriptUrl
  // const iframe = document.createElement("iframe");
  // iframe.src = scriptUrl;
  // iframe.style.width = "100%";
  // iframe.style.height = "100%";
  // iframe.style.border = "none";
  // document.body.appendChild(iframe);

  // Load React's main script from development server with CORS headers
  const script = document.createElement("script");
  script.src = "http://localhost:5174/src/main.tsx";
  // script.src = "https://test-2.tiiny.site/assets/index-BazmBGmp.js";
  script.type = "module";
  script.async = true;
  script.crossOrigin = "anonymous"; // Add CORS support
  document.body.appendChild(script);

  // fetch("http://localhost:5174/src/main.tsx")
  //   .then(response => response.text())
  //   .then(scriptText => {
  //     const scriptElement = document.createElement("script");
  //     scriptElement.textContent = scriptText;
  //     scriptElement.nonce = "randomNonce123";
  //     document.body.appendChild(scriptElement);
  //   })
  //   .catch(err => console.error("Script loading failed:", err));
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
});

// Inject the React app
injectReactApp();
