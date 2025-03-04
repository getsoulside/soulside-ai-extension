import { getSoulsideSessionTabs } from "./storage";

let sessionTabId: number | null = null;
let sourceTabId: number | null = null;

const startSoulsideSession = async ({
  sessionUrl,
  forceStart = false,
}: {
  sessionUrl: string;
  forceStart?: boolean;
}): Promise<any> => {
  const soulsideSessionTabs = await getSoulsideSessionTabs();
  const soulsideActiveSession = soulsideSessionTabs.find(tab =>
    tab.url?.includes("session-status=joined")
  );
  if (soulsideActiveSession && soulsideActiveSession.id) {
    if (!forceStart) {
      return Promise.reject({
        errorCode: "SESSION_ALREADY_ACTIVE",
        message: "Session already active",
      });
    } else {
      goToActiveSession();
    }
  } else {
    if (soulsideSessionTabs.length > 0) {
      soulsideSessionTabs.forEach(tab => {
        if (tab.id) {
          closeTab(tab.id);
        }
      });
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      sourceTabId = tabs[0].id ?? null;

      // Open session in new tab
      chrome.tabs.create({ url: sessionUrl }, tab => {
        sessionTabId = tab.id ?? null;
        chrome.tabs.onUpdated.addListener(checkSessionStatus);
      });
    });
  }
  return Promise.resolve({ success: true, sessionTabId });
};

const checkSessionStatus = (tabId: number, changeInfo: any, tab: any) => {
  // If the URL is being updated
  if (changeInfo.url?.includes("source=soulside-ai-extension")) {
    // Check if the URL contains the session-ended parameter
    if (changeInfo.url.includes("session-status=ended")) {
      // Close the tab
      closeTab(tabId);
      goBackToEHR();
    }
  }
};

const closeTab = (tabId: number) => {
  try {
    chrome.tabs.remove(tabId);
  } catch (error) {
    console.error("Error removing tab", error);
  }
};

const goBackToEHR = () => {
  if (!sourceTabId) return;
  chrome.tabs.update(sourceTabId, { active: true });
};

const goToActiveSession = async () => {
  const soulsideSessionTabs = await getSoulsideSessionTabs();
  const soulsideActiveSession = soulsideSessionTabs.find(tab =>
    tab.url?.includes("session-status=joined")
  );
  if (soulsideActiveSession && soulsideActiveSession.id) {
    chrome.tabs.update(soulsideActiveSession.id, { active: true });
  }
};

export { startSoulsideSession, goBackToEHR, goToActiveSession };
