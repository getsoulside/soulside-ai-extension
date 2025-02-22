import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookie, setCookie } from "./storage";
import { API_BASE_URL, IN_SESSION_SOCKET_URL } from "../constants";

interface APIOptions {
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
}

class HttpClient {
  private httpClient: AxiosInstance;
  private pendingRequests: Map<string, CancelTokenSource>;

  constructor() {
    this.httpClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: "",
      },
    });

    this.pendingRequests = new Map<string, CancelTokenSource>();

    this.httpClient.interceptors.request.use(this.handleRequest.bind(this));
    this.httpClient.interceptors.response.use(
      response => this.handleResponse(response),
      error => this.handleError(error)
    );

    this.initialize();
  }

  private async initialize() {
    const authToken = await getCookie("authtoken");
    this.httpClient.defaults.headers.Authorization = authToken ? "Bearer " + authToken : "";
  }

  public async reinitialize() {
    await this.initialize();
  }

  private async getAuthToken(): Promise<string> {
    const cookie = await getCookie("authtoken");
    if (!cookie) {
      this.httpClient.defaults.headers.Authorization = "";
    } else if (
      this.httpClient.defaults.headers.Authorization &&
      this.httpClient.defaults.headers.Authorization !== `Bearer ${cookie}`
    ) {
      return "";
    }
    return cookie || "";
  }

  private async handleRequest(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    const authToken = await this.getAuthToken();
    if (!authToken) {
      this.loginRedirect();
      return Promise.reject("No auth token");
    }

    if (!config.headers.Authorization) {
      config.headers.Authorization = "Bearer " + authToken;
    }

    const requestKey = this.getRequestKey(config);
    if (requestKey) {
      if (this.pendingRequests.has(requestKey)) {
        const cancelTokenSource = this.pendingRequests.get(requestKey);
        cancelTokenSource?.cancel("Duplicate request canceled");
      }

      const cancelTokenSource = axios.CancelToken.source();
      config.cancelToken = cancelTokenSource.token;
      this.pendingRequests.set(requestKey, cancelTokenSource);
    }
    // config.headers["Background-Script"] = "true";

    return config;
  }

  private handleResponse(response: any): any {
    const requestKey = this.getRequestKey(response.config);
    if (requestKey) {
      this.pendingRequests.delete(requestKey);
    }
    return response;
  }

  private async handleError(error: any): Promise<any> {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      if (error && error.response && error.response.status) {
        const requestKey = this.getRequestKey(error.config);
        if (requestKey) {
          this.pendingRequests.delete(requestKey);
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
        await setCookie("authtoken", "");
        await this.loginRedirect();
        return Promise.reject({ error: "AUTH_TOKEN_ERROR", message: "Auth token expired" });
      }
    }
    return Promise.reject(error);
  }

  private async loginRedirect(): Promise<void> {
    // if (!window.location.href.includes("/login") && !window.location.href.includes("/signup")) {
    this.httpClient.defaults.headers.Authorization = "";
    await this.reinitialize();
    // logout();
    // }
  }

  private getRequestKey(config: AxiosRequestConfig): string {
    return config.headers?.apiId || "";
  }

  public async get<T>(options: APIOptions): Promise<AxiosResponse<T>> {
    const { url, config } = options;
    const response = await this.httpClient.get<T>(url, config);
    return response;
  }

  public async post<T>(options: APIOptions): Promise<AxiosResponse<T>> {
    const { url, data, config } = options;
    if (config?.headers?.proxy) {
      const authToken = await this.getAuthToken();
      const response = await rawHttpClient.post({
        url: `${IN_SESSION_SOCKET_URL}/proxy-api`,
        data: {
          url,
          method: "POST",
          apiOptions: {
            data,
            headers: {
              ...(config?.headers || {}),
              Authorization: `Bearer ${authToken}`,
            },
          },
        },
      });
      return response as AxiosResponse<T>;
    }
    const response = await this.httpClient.post<T>(url, data, config);
    return response;
  }

  public async put<T>(options: APIOptions): Promise<AxiosResponse<T>> {
    const { url, data, config } = options;
    const response = await this.httpClient.put<T>(url, data, config);
    return response;
  }

  public async delete<T>(options: APIOptions): Promise<AxiosResponse<T>> {
    const { url, config } = options;
    const response = await this.httpClient.delete<T>(url, config);
    return response;
  }
}

class RawHttpClient {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: API_BASE_URL,
    });
    this.httpClient.interceptors.request.use(this.handleRequest.bind(this));
  }

  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    // config.headers["Background-Script"] = "true";
    return config;
  }

  public async get<T>(options: APIOptions): Promise<AxiosResponse<T>> {
    const { url, config } = options;
    const response = await this.httpClient.get<T>(url, config);
    return response;
  }

  public async post<T>(options: APIOptions): Promise<AxiosResponse<T>> {
    const { url, data, config } = options;
    const response = await this.httpClient.post<T>(url, data, config);
    return response;
  }

  public async put<T>(options: APIOptions): Promise<AxiosResponse<T>> {
    const { url, data, config } = options;
    const response = await this.httpClient.put<T>(url, data, config);
    return response;
  }

  public async delete<T>(options: APIOptions): Promise<AxiosResponse<T>> {
    const { url, config } = options;
    const response = await this.httpClient.delete<T>(url, config);
    return response;
  }
}

export const rawHttpClient = new RawHttpClient();

export default new HttpClient();
