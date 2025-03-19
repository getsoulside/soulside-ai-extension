import { saveCookie, deleteCookie } from "@/utils/storage";
import { rawHttpClient } from "@/utils/httpClient";
import { store } from "@/store";
import { getNavigateFunction } from "@/hooks/useNavigate";
import { selectPractitionerRole } from "@/domains/userProfile";
import { IN_SESSION_SOCKET_URL, API_BASE_URL } from "@/constants";

export async function login(email: string, password: string): Promise<void> {
  if (!email || !password) {
    return Promise.reject({ message: "Invalid Credentials" });
  }
  const navigate = getNavigateFunction();
  try {
    const proxyUrl = `${IN_SESSION_SOCKET_URL}/proxy-api`;
    const url = `${API_BASE_URL}/auth/practitioner/authenticate`;
    const proxyPayload = {
      url,
      method: "POST",
      apiOptions: {
        data: {
          email: email.toLowerCase(),
          password,
        },
      },
    };
    const response = await rawHttpClient.post(proxyUrl, proxyPayload);
    if (response?.data?.jwt) {
      await saveCookie("authtoken", response.data.jwt);
      saveCookie("soulside-email", email);
      if (chrome?.runtime?.id) {
        chrome.runtime.sendMessage({ action: "loggedIn" });
      } else {
        window.postMessage({ type: "SOULSIDE_LOGGED_IN" }, "*");
      }
      navigate("/", { replace: true });
      return response.data.jwt;
    } else {
      return Promise.reject({ message: "Invalid Credentials" });
    }
  } catch (error: any) {
    console.error(error);
    return Promise.reject({ message: "Invalid Credentials" });
  }
}

export function logout(): void {
  const navigate = getNavigateFunction();
  deleteCookie("authtoken");
  deleteCookie("soulside-email");
  selectPractitionerRole(null);
  store.dispatch({ type: "LOGOUT" });
  if (chrome?.runtime?.id) {
    chrome.runtime.sendMessage({ action: "loggedOut" });
  } else {
    window.postMessage({ type: "SOULSIDE_LOGGED_OUT" }, "*");
  }
  if (navigate) {
    navigate("/login");
  }
}

export async function sendResetPasswordEmail(email: string): Promise<void> {
  if (!email) {
    return Promise.reject({ message: "Please enter your email" });
  }
  const url = `registration/practitioner/forget-password`;
  const payload = {
    email,
  };
  try {
    const response = await rawHttpClient.post(url, payload);
    return response.data;
  } catch (error) {
    console.error(error);
    return Promise.reject({ message: "User not found" });
  }
}

export async function resetPassword(email: string, password: string, token: string): Promise<void> {
  if (!email || !password || !token) {
    return Promise.reject({
      message: "Invalid URL, please check the reset password link from the email",
    });
  }
  const url = `registration/practitioner/reset-password`;
  const payload = {
    email,
    password,
    confirmationToken: token,
  };
  try {
    await rawHttpClient.post(url, payload);
    const authToken = await login(email, password);
    return authToken;
  } catch (error) {
    console.error(error);
    return Promise.reject({
      message: "Invalid URL, please check the reset password link from the email",
    });
  }
}

export async function signup(email: string, password: string, token: string): Promise<void> {
  if (!email || !password || !token) {
    return Promise.reject({
      message: "Invalid URL, please check the signup link from the email",
    });
  }
  const url = `registration/practitioner/accept-invite-and-signup`;
  const payload = {
    email,
    password,
    confirmationToken: token,
  };
  try {
    await rawHttpClient.post(url, payload);
    const authToken = await login(email, password);
    return authToken;
  } catch (error) {
    console.error(error);
    return Promise.reject({
      message: "Invalid URL, please check the signup link from the email",
    });
  }
}
