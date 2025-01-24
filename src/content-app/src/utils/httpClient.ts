import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookie } from "./storage";
import { API_BASE_URL } from "@/constants";
import { logout } from "@/services/auth";

class HttpClient {
  private isRawApiCall: boolean;

  constructor(isRawApiCall: boolean) {
    this.isRawApiCall = isRawApiCall;
  }
  private async makeApiRequest(
    apiMethod: "get" | "post" | "put" | "delete",
    apiOptions: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = Date.now() + Math.random(); // Generate a unique requestId

      // Create a message listener
      interface MessageEventData {
        type: string;
        requestId: number;
        value?: any;
        success: boolean;
      }

      function handleMessage(event: MessageEvent): void {
        const data: MessageEventData = event.data;

        // Ensure the message contains the requestId
        if (data.type === "MAKE_SOULSIDE_API_CALL_RESULT" && data.requestId === requestId) {
          window.removeEventListener("message", handleMessage); // Clean up the listener
          if (data.success) {
            resolve(data.value); // Resolve with the cookie value
          } else {
            reject(data.value);
          }
        }
      }

      // Listen for the response
      window.addEventListener("message", handleMessage);

      // Post the request to the window
      window.postMessage(
        {
          type: "MAKE_SOULSIDE_API_CALL",
          requestId,
          apiMethod,
          apiOptions,
          isRawApiCall: this.isRawApiCall,
        },
        "*"
      );

      // Optional: Add a timeout to reject the promise if no response is received
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject("No response"); // Resolve with null if the request times out
      }, 5000); // Adjust timeout duration as needed
    });
  }

  public async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const response = await this.makeApiRequest("get", { url, config });
    return response;
  }

  public async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const response = await this.makeApiRequest("post", { url, data, config });
    return response;
  }

  public async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const response = await this.makeApiRequest("put", { url, data, config });
    return response;
  }

  public async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const response = await this.makeApiRequest("delete", { url, config });
    return response;
  }
}

export default new HttpClient(false);

export const rawHttpClient = new HttpClient(true);

export const rawHttpClientOld = axios.create({
  baseURL: API_BASE_URL,
});
