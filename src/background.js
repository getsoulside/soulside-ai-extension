import { getUserInfo, loginRedirect } from "./auth.js";
import { fetchNotesFromSoulside } from "./modules/fetchSoulsideNotes.js";
import { getCookieName, changeStorageValue } from "./services/utils.js";

let advancedMdTabs = [];

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
        console.log("error", error);
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
        console.log("error", error);
        sendResponse({ success: false, error });
      });

    return true; // Keep the message channel open for async response
  }
});

chrome.runtime.onInstalled.addListener(() => {
  onExtensionInstall();
});

const onExtensionInstall = async () => {
  chrome.tabs.onUpdated.addListener(tabUpdateListener);
  chrome.tabs.onRemoved.addListener(removeTabListener);
  chrome.cookies.onChanged.addListener(cookieChangeListener);
  try {
    let userInfo = await getUserInfo();
    console.log("userInfo", userInfo);
  } catch (error) {
    console.log("Extension Install Fetch Userinfo error:", error);
  }
};

chrome.runtime.onSuspend.addListener(() => {
  console.log("Extension is being unloaded. Cleaning up listeners.");
  chrome.tabs.onUpdated.removeListener(tabUpdateListener);
  chrome.tabs.onRemoved.removeListener(removeTabListener);
  chrome.cookies.onChanged.removeListener(cookieChangeListener);
});
