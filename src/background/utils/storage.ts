import { APP_IDENTIFIER, APP_ENV, PLATFORM_URL, APP_DOMAIN } from "../constants";

export const getCookieName = (key: string) => {
  let name = key + `-${APP_IDENTIFIER}`;
  if (APP_ENV === "DEV") {
    name = name + "-dev";
  }
  return name;
};

export async function getCookie(key: string): Promise<string> {
  let name = getCookieName(key);

  let url = PLATFORM_URL || "https://ehr.soulsidehealth.com";

  const cookiePromise: Promise<string> = new Promise((resolve, reject) => {
    try {
      chrome.cookies.get({ url, name }, cookie => {
        resolve(cookie?.value || "");
      });
    } catch (error) {
      resolve("");
    }
  });
  const cookieValue = await cookiePromise;
  return cookieValue;
}

export async function setCookie(key: string, value: string): Promise<string> {
  let name = getCookieName(key);
  let url = PLATFORM_URL || "https://ehr.soulsidehealth.com";
  const now = new Date();
  now.setDate(now.getDate() + 30);
  const expirationDate = now.getTime() / 1000;
  const cookiePromise: Promise<string> = new Promise((resolve, reject) => {
    try {
      if (value) {
        chrome.cookies.set(
          {
            url,
            name,
            value,
            expirationDate,
            path: "/",
            secure: true,
            sameSite: "no_restriction",
          },
          cookie => {
            if (chrome.runtime.lastError) {
              console.error("Failed to set cookie:", chrome.runtime.lastError);
              resolve("");
              return;
            }
            resolve(cookie?.value || "");
          }
        );
      } else {
        chrome.cookies.remove({ url, name }, () => {
          resolve("");
        });
      }
    } catch (error) {
      resolve("");
    }
  });
  const cookieValue = await cookiePromise;
  return cookieValue;
}

export const getStorageValue = async (key: string) => {
  const storagePromise: Promise<Record<string, any> | null> = new Promise(resolve => {
    try {
      chrome.storage.local.get(key, function (data) {
        if (data?.[key]) {
          resolve(data[key]);
        }
        resolve(null);
      });
    } catch (error) {
      resolve(null);
    }
  });
  const storageValue = await storagePromise;
  return storageValue;
};

export const changeStorageValue = async (key: string, value: Record<string, any> | null) => {
  const storagePromise: Promise<Record<string, any> | null> = new Promise(resolve => {
    try {
      if (value === null) {
        chrome.storage.local.remove(key, () => {
          resolve(null);
        });
      } else {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve(value);
        });
      }
    } catch (error) {
      resolve(null);
    }
  });
  const storageValue = await storagePromise;
  return storageValue;
};

export const getSoulsideSessionTabs = async () => {
  const tabsOptions: chrome.tabs.QueryInfo = {
    url: `${PLATFORM_URL}/session/*`,
  };
  const tabsPromise: Promise<chrome.tabs.Tab[]> = new Promise(resolve => {
    chrome.tabs.query(tabsOptions, function (tabs) {
      resolve(tabs);
    });
  });
  const tabs = await tabsPromise;
  return tabs;
};
