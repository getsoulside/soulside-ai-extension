import { getCookie, getCookieName, getStorageValue, changeStorageValue } from "./services/utils.js";
import { get } from "./services/api.js";

const manifest = chrome.runtime.getManifest();
const PLATFORM_URL = manifest.environment.PLATFORM_URL;

export const getUserInfo = async () => {
  await changeStorageValue("userInfoLoading", true);
  let authCookies = await getAuthCookies();
  let userInfo = (await getStorageValue("userInfo")) || null;
  if (userInfo) {
    return userInfo;
  }
  if (!authCookies?.authToken || !authCookies?.selectedPractitionerRoleId) {
    try {
      authCookies = await loginRedirect(authCookies);
    } catch (error) {
      console.log("Login Redirect Error:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      userInfo = await fetchUserInfo();
    } catch (error) {
      console.log("Get user info error:", error);
      return Promise.reject(error);
    }
  }
  await changeStorageValue("userInfo", userInfo);
  await changeStorageValue("userInfoLoading", false);
  return userInfo;
};

const fetchUserInfo = async (retryCount = 0) => {
  let userInfo = null;
  let url = "practitioner-role/profile/info";
  try {
    let response = await get(url);
    if (response?.data) {
      userInfo = response.data;
    }
  } catch (error) {
    console.log("Fetch user info error:", error);
    if (retryCount === 0) {
      try {
        await loginRedirect();
      } catch (error) {
        console.log("Login Redirect Error on fetch userinfo retry:", error);
        return Promise.reject(error);
      }
      return await fetchUserInfo(retryCount + 1);
    } else {
      return Promise.reject(error);
    }
  }
  return userInfo;
};

export const getAuthCookies = async () => {
  let authToken = (await getCookie("authtoken")) || "";
  let selectedPractitionerRoleId = (await getCookie("selected-practitioner-role")) || "";
  let authCookies = {
    authToken,
    selectedPractitionerRoleId,
  };
  if (authToken && selectedPractitionerRoleId) {
    return authCookies;
  }
  return authCookies;
};

export const loginRedirect = async options => {
  let authCookies = {
    authToken: options?.authToken || "",
    selectedPractitionerRoleId: options?.selectedPractitionerRoleId || "",
  };
  await changeStorageValue("userInfo", null);
  if (!authCookies.selectedPractitionerRoleId) {
    authCookies.selectedPractitionerRoleId = (await getCookie("selected-practitioner-role")) || "";
  }
  if (options?.practitionerRoleMismatch) {
    authCookies.selectedPractitionerRoleId = "";
  }
  if (options?.invalidAuthToken) {
    authCookies.authToken = "";
  }
  let loginRedirectPromise = new Promise((resolve, reject) => {
    chrome.tabs.create({ url: PLATFORM_URL }, tab => {
      const tabId = tab.id;
      let timeout = null;
      function cookieChangeListener(changes) {
        if (changes?.cookie?.name === getCookieName("authtoken")) {
          authCookies.authToken = changes.cookie.value || "";
          if (changes.removed) {
            authCookies.authToken = "";
          }
        }
        if (changes?.cookie?.name === getCookieName("selected-practitioner-role")) {
          authCookies.selectedPractitionerRoleId = changes.cookie.value || "";
          if (changes.removed) {
            authCookies.selectedPractitionerRoleId = "";
          }
        }
        if (authCookies.authToken && authCookies.selectedPractitionerRoleId) {
          if (timeout) {
            clearTimeout(timeout);
          }
          chrome.cookies.onChanged.removeListener(cookieChangeListener);
          chrome.tabs.onRemoved.removeListener(tabCloseListener);
          chrome.tabs.remove(tabId);
          resolve({
            authToken: authCookies.authToken,
            selectedPractitionerRoleId: authCookies.selectedPractitionerRoleId,
          });
        }
      }
      function tabCloseListener(closedTabId) {
        if (closedTabId === tabId) {
          // Cleanup and reject the promise
          if (timeout) {
            clearTimeout(timeout);
          }
          chrome.cookies.onChanged.removeListener(cookieChangeListener);
          chrome.tabs.onRemoved.removeListener(tabCloseListener);
          reject(new Error("User closed the authentication tab"));
        }
      }
      chrome.cookies.onChanged.addListener(cookieChangeListener);
      chrome.tabs.onRemoved.addListener(tabCloseListener);
      // Optional timeout to handle cases where the user doesn't act
      timeout = setTimeout(() => {
        chrome.cookies.onChanged.removeListener(cookieChangeListener);
        chrome.tabs.onRemoved.removeListener(tabCloseListener);
        reject(new Error("Authentication timeout"));
      }, 300000); // 5-minute timeout
    });
  });
  try {
    authCookies = await loginRedirectPromise;
    return authCookies;
  } catch (error) {
    console.log("error", error);
    return Promise.reject(error);
  }
};
