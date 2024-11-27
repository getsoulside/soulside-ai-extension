import { getUserInfo } from "./auth.js";
import { fetchNotesFromSoulside } from "./modules/fetchSoulsideNotes.js";
import { getCookieName, getStorageValue, changeStorageValue } from "./services/utils.js";

function cookieChangeListener(changes) {
  if (changes?.cookie?.name === getCookieName("authtoken")) {
    changeStorageValue("userInfo", null);
  }
}

function tabUpdateListener(tabId, changeInfo, tab) {
  const advancedmdRegex = /^wc-wfe-\d+\.advancedmd\.com$/;
  if (changeInfo.status === "complete" && advancedmdRegex.test(new URL(tab.url).hostname)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["scripts/advancedmdContent.bundle.js"],
    });
  }
}

function storageChangeListener(changes, areaName) {
  if (changes.userInfo) {
    let newValue = changes.userInfo.newValue;
    if (newValue) {
      chrome.tabs.onUpdated.addListener(tabUpdateListener);
    } else {
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getSoulsideChiefComplaint") {
    fetchNotesFromSoulside(message.visitId)
      .then(soulsideChiefComplaint => {
        sendResponse({ success: true, value: soulsideChiefComplaint });
      })
      .catch(error => {
        console.log("error", error);
        sendResponse({ success: true, value: "" });
      });

    return true; // Keep the message channel open for async response
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  chrome.cookies.onChanged.addListener(cookieChangeListener);
  chrome.storage.onChanged.addListener(storageChangeListener);
  let userInfo = await getUserInfo();
  if (userInfo) {
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
  } else {
    chrome.tabs.onUpdated.removeListener(tabUpdateListener);
  }
  console.log("userInfo", userInfo);
});

chrome.runtime.onSuspend.addListener(() => {
  console.log("Extension is being unloaded. Cleaning up listeners.");
  chrome.cookies.onChanged.removeListener(cookieChangeListener);
  chrome.storage.onChanged.removeListener(storageChangeListener);
});
