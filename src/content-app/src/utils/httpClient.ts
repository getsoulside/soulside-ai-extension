import axios, { InternalAxiosRequestConfig, CancelTokenSource } from "axios";
import { getCookie } from "./storage";
import { API_BASE_URL } from "@/constants";
import { logout } from "@/services/auth";

const authToken = getCookie("authtoken");

console.log("API_BASE_URL", import.meta.env.API_BASE_URL);

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: authToken ? "Bearer " + authToken : "",
  },
});

const pendingRequests = new Map<string, CancelTokenSource>();

function loginRedirect(): void {
  if (!window.location.href.includes("/login") && !window.location.href.includes("/signup")) {
    httpClient.defaults.headers.Authorization = "";
    logout();
  }
}

function isAuthTokenPresent(): boolean {
  const cookie = getCookie("authtoken");
  if (!cookie) {
    loginRedirect();
    return false;
  } else if (!httpClient.defaults.headers.Authorization) {
    httpClient.defaults.headers.Authorization = "Bearer " + cookie;
  }
  return true;
}

function getRequestKey(config: InternalAxiosRequestConfig): string {
  return config.headers.apiId || "";
}

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authTokenPresent = isAuthTokenPresent();
  if (!authTokenPresent) {
    return Promise.reject("No auth token");
  }
  if (!config.headers.Authorization) {
    const cookie = getCookie("authtoken");
    config.headers.Authorization = "Bearer " + cookie;
  }

  const requestKey = getRequestKey(config);

  if (requestKey) {
    if (pendingRequests.has(requestKey)) {
      const cancelTokenSource = pendingRequests.get(requestKey);
      cancelTokenSource?.cancel("Duplicate request canceled");
    }

    const cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;
    pendingRequests.set(requestKey, cancelTokenSource);
  }

  return config;
});

httpClient.interceptors.response.use(
  response => {
    const requestKey = getRequestKey(response.config);
    if (requestKey) {
      pendingRequests.delete(requestKey);
    }
    return response;
  },
  error => {
    if (axios.isCancel(error)) {
      console.error("Request canceled:", error.message);
    } else {
      if (error && error.response && error.response.status) {
        const requestKey = getRequestKey(error.config);
        if (requestKey) {
          pendingRequests.delete(requestKey);
        }
      }
    }
    if (error && error.response && error.response.status) {
      if (
        error.response.status === 403 ||
        (error.response.status === 500 &&
          (!!error.response.data?.message?.includes("JWT expired") ||
            !!error.response.data?.message?.includes("JWT validity") ||
            !!error.response.data?.message?.includes("JWT ")))
      ) {
        loginRedirect();
      }
    }
    return Promise.reject(error);
  }
);

export const rawHttpClient = axios.create({
  baseURL: API_BASE_URL,
});

export default httpClient;
