import axios from "axios";
import { loginRedirect } from "../auth.js";
import { getCookie, getCookieName } from "./utils.js";

const manifest = chrome.runtime.getManifest();
const API_ENDPOINT = manifest.environment.API_ENDPOINT;

let instance = axios.create({
  baseURL: API_ENDPOINT,
});

let rawInstance = axios.create({
  baseURL: API_ENDPOINT,
});

let authCheckPromise = null;

const ensureAuthToken = async () => {
  if (authCheckPromise) return authCheckPromise;
  authCheckPromise = isAuthTokenPresent();
  try {
    const result = await authCheckPromise;
    authCheckPromise = null;
    return result;
  } catch (error) {
    authCheckPromise = null;
    return null;
  }
};

const isAuthTokenPresent = async () => {
  let cookie = await getCookie("authtoken");
  if (!cookie) {
    ({ authToken: cookie = null } = await loginRedirect());
    if (!cookie) {
      return false;
    }
  }
  if (!instance.defaults.headers.Authorization && cookie) {
    instance.defaults.headers.Authorization = "Bearer " + cookie;
  }
  return true;
};

instance.interceptors.request.use(async config => {
  if (!config.headers.Authorization) {
    let cookie = await getCookie("authtoken");
    if (cookie) {
      config.headers.Authorization = "Bearer " + cookie;
    }
  }
  return config;
});

instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    console.log(error);
    const originalRequest = error.config;
    if (
      error?.response?.status === 403 ||
      (error?.response?.status === 500 &&
        (!!error.response.data?.message?.includes("JWT expired") ||
          !!error.response.data?.message?.includes("JWT validity")))
    ) {
      try {
        // Attempt re-authentication
        await loginRedirect({ invalidAuthToken: true });
        // Retry the original request
        const newAuthToken = await getCookie("authtoken");
        if (newAuthToken) {
          originalRequest.headers.Authorization = "Bearer " + newAuthToken;
          return instance(originalRequest);
        }
      } catch (authError) {
        console.error("Reauthentication failed:", authError);
        return Promise.reject(authError);
      }
    }
    return Promise.reject(error);
  }
);

const apiRequest = async (method, url, data = null, extraHeaders = {}) => {
  const authTokenPresent = await ensureAuthToken();
  if (!authTokenPresent) throw new Error("User not logged in");

  const config = { method, url, headers: extraHeaders };
  if (method === "get") config.params = data;
  else config.data = data;

  return instance(config);
};

export const get = (url, data, extraHeaders) => apiRequest("get", url, data, extraHeaders);
export const post = (url, data, extraHeaders) => apiRequest("post", url, data, extraHeaders);
export const put = (url, data, extraHeaders) => apiRequest("put", url, data, extraHeaders);
export const patch = (url, data, extraHeaders) => apiRequest("patch", url, data, extraHeaders);
export const deleteApi = (url, data, extraHeaders) => apiRequest("delete", url, data, extraHeaders);

export const rawGet = (url, data) => rawInstance.get(url, { params: data });
export const rawPost = (url, data, extraHeaders = {}) => {
  return rawInstance.post(url, data, { headers: extraHeaders });
};
