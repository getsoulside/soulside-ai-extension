import { changeStorageValue, getCookie, getStorageValue, setCookie } from "./utils/storage";
import httpClient, { rawHttpClient } from "./utils/httpClient";
import LOCAL_STORAGE_KEYS from "./constants/localStorageKeys";
import parseCsv from "./utils/parseCsv";

getStorageValue(LOCAL_STORAGE_KEYS.SESSION_NOTES_STATUS).then(value => {
  console.log("SESSION_NOTES_STATUS", value);
});

interface Message {
  action: string;
  key: string;
  value: string | any;
  apiMethod: "get" | "post" | "put" | "delete";
  apiOptions: any;
  isRawApiCall: boolean;
  pdfUrl: string;
}

chrome.runtime.onMessage.addListener(
  (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
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
  }
);

// chrome.action.onClicked.addListener(async tab => {
//   const scriptUrl = "https://test-2.tiiny.site";

//   //add a iframe to the tab for the scriptUrl
//   const iframe = document.createElement("iframe");
//   iframe.src = scriptUrl;
//   iframe.style.width = "100%";
//   iframe.style.height = "100%";
//   iframe.style.border = "none";
//   document.body.appendChild(iframe);
// });
