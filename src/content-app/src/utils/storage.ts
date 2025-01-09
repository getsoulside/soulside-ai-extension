import moment from "moment-timezone";
import { APP_DOMAIN, SOULSIDE_DOMAIN, APP_ENV, APP_IDENTIFIER } from "@/constants";
import { PractitionerRole } from "@/domains/practitionerRole";
import { TimeZone } from "@/domains/userProfile";
import LOCAL_STORAGE_KEYS from "@/constants/localStorageKeys";
import { Session, SessionNotesStatus } from "@/domains/session";

export function getCookie(name: string, crossDomain: boolean = false): string | null {
  if (!crossDomain) {
    name += `-${APP_IDENTIFIER}`;
  }
  if (APP_ENV === "DEV") {
    name = name + `-dev`;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function saveCookie(name: string, value: string, crossDomain: boolean = false): void {
  if (!crossDomain) {
    name += `-${APP_IDENTIFIER}`;
  }
  if (APP_ENV === "DEV") {
    name = name + `-dev`;
  }
  const now = new Date();
  now.setDate(now.getDate() + 30);
  let domain = crossDomain ? SOULSIDE_DOMAIN : APP_DOMAIN;
  if (!domain) {
    domain = window.location.hostname;
  }
  document.cookie =
    name + "=" + value + ";expires=" + now.toUTCString() + ";domain=" + domain + ";path=/;secure";
}

export function deleteCookie(name: string, crossDomain: boolean = false): void {
  if (!crossDomain) {
    name += `-${APP_IDENTIFIER}`;
  }
  if (APP_ENV === "DEV") {
    name = name + `-dev`;
  }
  let domain = crossDomain ? SOULSIDE_DOMAIN : APP_DOMAIN;
  if (!domain) {
    domain = window.location.hostname;
  }
  document.cookie =
    name + `=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=${domain};secure;`;
  document.cookie = name + `=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;secure;`;
}

export function addLocalStorage(key: string, data: any | null): void {
  if (!data) {
    deleteLocalStorage(key);
    return;
  }
  localStorage.setItem(key, data ? JSON.stringify(data) : "");
}

export function getLocalStorage(key: string): any | null {
  const data = localStorage.getItem(key);
  if (data) {
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function deleteLocalStorage(key: string): void {
  localStorage.removeItem(key);
}

export const getSelectedPractitionerRoleFromLocal = () => {
  const selectedUserRole: PractitionerRole | null = getLocalStorage(
    LOCAL_STORAGE_KEYS.SELECTED_PRACTITIONER_ROLE
  );
  saveCookie(LOCAL_STORAGE_KEYS.SELECTED_PRACTITIONER_ROLE, selectedUserRole?.id || "");
  saveCookie("selected-organization", selectedUserRole?.organizationId || "");
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

export const getSelectedTimezoneFromLocal = (): TimeZone => {
  let selectedTimezone: TimeZone = getLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_TIMEZONE);
  saveCookie(LOCAL_STORAGE_KEYS.SELECTED_TIMEZONE, selectedTimezone?.name || "America/Chicago");
  moment.tz.setDefault(selectedTimezone?.name || "America/Chicago");
  return selectedTimezone || timezones.find(i => i.name === "America/Chicago");
};

export const getSessionNotesStatusFromLocal = (): Record<
  NonNullable<Session["id"]>,
  SessionNotesStatus
> => {
  const sessionNotesStatus = getLocalStorage(LOCAL_STORAGE_KEYS.SESSION_NOTES_STATUS);
  return sessionNotesStatus || {};
};
