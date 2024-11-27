const manifest = chrome.runtime.getManifest();
const APP_ENV = manifest.environment.APP_ENV;
const PLATFORM_URL = manifest.environment.PLATFORM_URL;

export const getCookieName = key => {
  let name = key + "-ehr-platform";
  if (APP_ENV === "dev") {
    name = name + "-dev";
  }
  return name;
};

export const getCookie = async key => {
  let url = PLATFORM_URL;
  let name = getCookieName(key);
  const cookiePromise = new Promise((resolve, reject) => {
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
};

export const getStorageValue = async key => {
  const storagePromise = new Promise(resolve => {
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

export const changeStorageValue = async (key, value) => {
  const storagePromise = new Promise(resolve => {
    try {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve(value);
      });
    } catch (error) {
      resolve(null);
    }
  });
  const storageValue = await storagePromise;
  return storageValue;
};
