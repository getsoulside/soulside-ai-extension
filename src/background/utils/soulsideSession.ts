let sessionTabId: number | null = null;
let sourceTabId: number | null = null;

const startSoulsideSession = async ({
  sessionUrl,
  forceStart = false,
}: {
  sessionUrl: string;
  forceStart?: boolean;
}): Promise<any> => {
  if (sessionTabId) {
    if (!forceStart) {
      return Promise.reject({
        errorCode: "SESSION_ALREADY_ACTIVE",
        message: "Session already active",
      });
    } else {
      closeSoulsideSession();
    }
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    sourceTabId = tabs[0].id ?? null;

    // Open session in new tab
    chrome.tabs.create({ url: sessionUrl }, tab => {
      sessionTabId = tab.id ?? null;
      chrome.tabs.onUpdated.addListener(checkSessionStatus);
      chrome.tabs.onRemoved.addListener(checkSessionStatusOnRemoved);
    });
  });
  return Promise.resolve({ success: true, sessionTabId });
};

const checkSessionStatus = (tabId: number, changeInfo: any, tab: any) => {
  // Only check the session tab
  if (tabId !== sessionTabId) return;

  // If the URL is being updated
  if (changeInfo.url) {
    // Check if the URL contains the session-ended parameter
    if (changeInfo.url.includes("session-status=ended")) {
      // Close the tab
      closeSoulsideSession();
    }
    if (!changeInfo.url.includes("source=soulside-ai-extension")) {
      resetSoulsideSession();
    }
  }
  // If the tab is being removed
  if (changeInfo.status === "complete" && !tab.url) {
    // Tab was closed
    closeSoulsideSession();
  }
};

const checkSessionStatusOnRemoved = (tabId: number, removeInfo: any) => {
  console.log("checkSessionStatusOnRemoved", tabId, removeInfo);
  if (tabId !== sessionTabId) return;
  closeSoulsideSession();
};

const closeSoulsideSession = () => {
  if (!sessionTabId) return;
  try {
    chrome.tabs.remove(sessionTabId);
  } catch (error) {
    console.error("Error removing tab", error);
  }
  resetSoulsideSession();
  goBackToEHR();
};

const resetSoulsideSession = () => {
  chrome.tabs.onUpdated.removeListener(checkSessionStatus);
  chrome.tabs.onRemoved.removeListener(checkSessionStatusOnRemoved);
  sessionTabId = null;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    sourceTabId = tabs[0].id ?? null;
  });
};

const goBackToEHR = () => {
  if (!sourceTabId) return;
  chrome.tabs.update(sourceTabId, { active: true });
};

const goToActiveSession = () => {
  if (!sessionTabId) return;
  chrome.tabs.update(sessionTabId, { active: true });
};

const getSessionTabId = () => {
  return sessionTabId;
};

export {
  startSoulsideSession,
  closeSoulsideSession,
  resetSoulsideSession,
  goBackToEHR,
  goToActiveSession,
  getSessionTabId,
};
