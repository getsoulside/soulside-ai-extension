import moment from "moment-timezone";
import { PractitionerRole } from "@/domains/practitionerRole";
import { ExtensionDrawerPosition, TimeZone } from "@/domains/userProfile";
import LOCAL_STORAGE_KEYS from "@/constants/localStorageKeys";
import { Session, SessionNotesStatus } from "@/domains/session";

interface StorageMessageEventData {
  type: string;
  requestId: number;
  value?: string;
}

export async function getCookie(name: string): Promise<string | null> {
  return new Promise(resolve => {
    if (chrome?.runtime?.id) {
      chrome.runtime.sendMessage({ action: "getCookie", key: name }, response => {
        resolve(response.value || null);
      });
    } else {
      const requestId = Date.now() + Math.random(); // Generate a unique requestId

      // Create a message listener
      function handleMessage(event: MessageEvent): void {
        const data: StorageMessageEventData = event.data;
        // Ensure the message contains the requestId
        if (data.type === "GET_SOULSIDE_COOKIE_RESULT" && data.requestId === requestId) {
          window.removeEventListener("message", handleMessage); // Clean up the listener
          resolve(data.value || null); // Resolve with the cookie value
        }
      }

      // Listen for the response
      window.addEventListener("message", handleMessage);

      // Post the request to the window
      window.postMessage({ type: "GET_SOULSIDE_COOKIE", key: name, requestId }, "*");

      // Optional: Add a timeout to reject the promise if no response is received
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        resolve(null); // Resolve with null if the request times out
      }, 5000); // Adjust timeout duration as needed
    }
  });
}

export async function saveCookie(name: string, value: string): Promise<void> {
  return new Promise(resolve => {
    if (chrome?.runtime?.id) {
      chrome.runtime.sendMessage({ action: "setCookie", key: name, value }, () => {
        resolve();
      });
    } else {
      const requestId = Date.now() + Math.random(); // Generate a unique requestId

      // Create a message listener
      function handleMessage(event: MessageEvent): void {
        const data: StorageMessageEventData = event.data;
        // Ensure the message contains the requestId
        if (data.type === "SET_SOULSIDE_COOKIE_RESULT" && data.requestId === requestId) {
          window.removeEventListener("message", handleMessage); // Clean up the listener
          resolve(); // Resolve with the cookie value
        }
      }

      // Listen for the response
      window.addEventListener("message", handleMessage);

      // Post the request to the window
      window.postMessage({ type: "SET_SOULSIDE_COOKIE", key: name, value, requestId }, "*");

      // Optional: Add a timeout to reject the promise if no response is received
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        resolve(); // Resolve with null if the request times out
      }, 5000); // Adjust timeout duration as needed
    }
  });
}

export async function deleteCookie(name: string): Promise<void> {
  return saveCookie(name, "");
}

export async function getLocalStorage(key: string): Promise<any | null> {
  return new Promise(resolve => {
    if (chrome?.runtime?.id) {
      chrome.runtime.sendMessage({ action: "getStorage", key }, response => {
        resolve(response.value || null);
      });
    } else {
      const requestId = Date.now() + Math.random(); // Generate a unique requestId

      // Create a message listener
      function handleMessage(event: MessageEvent): void {
        const data: StorageMessageEventData = event.data;
        // Ensure the message contains the requestId
        if (data.type === "GET_SOULSIDE_STORAGE_RESULT" && data.requestId === requestId) {
          window.removeEventListener("message", handleMessage); // Clean up the listener
          resolve(data.value || null); // Resolve with the cookie value
        }
      }

      // Listen for the response
      window.addEventListener("message", handleMessage);

      // Post the request to the window
      window.postMessage({ type: "GET_SOULSIDE_STORAGE", key, requestId }, "*");

      // Optional: Add a timeout to reject the promise if no response is received
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        resolve(null); // Resolve with null if the request times out
      }, 5000); // Adjust timeout duration as needed
    }
  });
}

export async function addLocalStorage(key: string, value: any | null): Promise<any | null> {
  return new Promise(resolve => {
    if (chrome?.runtime?.id) {
      chrome.runtime.sendMessage({ action: "setStorage", key, value }, response => {
        resolve(response.value || null);
      });
    } else {
      const requestId = Date.now() + Math.random(); // Generate a unique requestId

      // Create a message listener
      function handleMessage(event: MessageEvent): void {
        const data: StorageMessageEventData = event.data;
        // Ensure the message contains the requestId
        if (data.type === "SET_SOULSIDE_STORAGE_RESULT" && data.requestId === requestId) {
          window.removeEventListener("message", handleMessage); // Clean up the listener
          resolve(data.value || null); // Resolve with the cookie value
        }
      }

      // Listen for the response
      window.addEventListener("message", handleMessage);

      // Post the request to the window
      window.postMessage({ type: "SET_SOULSIDE_STORAGE", key, value, requestId }, "*");

      // Optional: Add a timeout to reject the promise if no response is received
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        resolve(null); // Resolve with null if the request times out
      }, 5000); // Adjust timeout duration as needed
    }
  });
}

export async function deleteLocalStorage(key: string): Promise<void> {
  return addLocalStorage(key, null);
}

export const getSelectedPractitionerRoleFromLocal = async () => {
  const selectedUserRole: PractitionerRole | null = await getLocalStorage(
    LOCAL_STORAGE_KEYS.SELECTED_PRACTITIONER_ROLE
  );
  return selectedUserRole || null;
};

const timeZoneAbbrMapping = {
  "America/Los_Angeles": "PT",
  "America/Phoenix": "MT",
  "America/Chicago": "CT",
  "America/New_York": "ET",
};

export const timezones: TimeZone[] = moment.tz
  .zonesForCountry("US", true)
  .filter(
    i =>
      i.name === "America/Los_Angeles" ||
      i.name === "America/Phoenix" ||
      i.name === "America/Chicago" ||
      i.name === "America/New_York"
  )
  .map(i => {
    return {
      ...i,
      offset: i.offset / 60,
      abbr: timeZoneAbbrMapping[i.name as keyof typeof timeZoneAbbrMapping] || "",
    };
  });

export const getDefaultValueForTimezone = (): TimeZone => {
  return timezones.find(i => i.name === "America/Chicago") || timezones[0];
};

export const getSelectedTimezoneFromLocal = async (): Promise<TimeZone> => {
  let selectedTimezone: TimeZone = await getLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_TIMEZONE);
  moment.tz.setDefault(selectedTimezone?.name || "America/Chicago");
  return selectedTimezone || timezones.find(i => i.name === "America/Chicago");
};

export const getSessionNotesStatusFromLocal = async (): Promise<
  Record<NonNullable<Session["id"]>, SessionNotesStatus>
> => {
  const sessionNotesStatus = await getLocalStorage(LOCAL_STORAGE_KEYS.SESSION_NOTES_STATUS);
  return sessionNotesStatus || {};
};

export const getExtensionDrawerPositionFromLocal = async (): Promise<ExtensionDrawerPosition> => {
  try {
    const extensionDrawerPosition = await getLocalStorage(
      LOCAL_STORAGE_KEYS.EXTENSION_DRAWER_POSITION
    );
    return extensionDrawerPosition || ExtensionDrawerPosition.TOP_RIGHT;
  } catch (error) {
    return ExtensionDrawerPosition.TOP_RIGHT;
  }
};
