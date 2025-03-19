import httpClient from "@/utils/httpClient";
import {
  IndividualSession,
  ScheduleSessionPayload,
  Session,
  SessionCategory,
  SoulsideSession,
} from "../models";

export const getIndividualSessionsByOrgId = async (
  organizationId: string,
  startDateTime: ISO8601String,
  endDateTime: ISO8601String
): Promise<IndividualSession[]> => {
  if (!organizationId) {
    return Promise.reject("Organization ID is required");
  }
  if (!startDateTime || !endDateTime) {
    return Promise.reject("Date Range is required");
  }
  const url = `practitioner-role/individual-session/find-all-by-org-and-date-range/${organizationId}?startDateTime=${window.encodeURIComponent(
    startDateTime
  )}&endDateTime=${window.encodeURIComponent(endDateTime)}`;
  const response = await httpClient.get(url, {
    headers: { apiId: "getIndividualSessionsByOrgId" },
  });
  return response.data;
};

export const getIndividualSessionsByPractitionerRoleId = async (
  organizationId: string,
  startDateTime: ISO8601String,
  endDateTime: ISO8601String
): Promise<IndividualSession[]> => {
  if (!organizationId) {
    return Promise.reject("Organization ID is required");
  }
  if (!startDateTime || !endDateTime) {
    return Promise.reject("Date Range is required");
  }
  const url = `practitioner-role/individual-session/find-all-by-practitioner-role-and-date-range/${organizationId}?startDateTime=${window.encodeURIComponent(
    startDateTime
  )}&endDateTime=${window.encodeURIComponent(endDateTime)}`;
  const response = await httpClient.get(url, {
    headers: { apiId: "getIndividualSessionsByPractitionerRoleId" },
  });
  return response.data;
};

export const getGroupSessionsByOrgId = async (
  organizationId: string,
  startDateTime: ISO8601String,
  endDateTime: ISO8601String
): Promise<SoulsideSession[]> => {
  if (!organizationId) {
    return Promise.reject("Organization ID is required");
  }
  if (!startDateTime || !endDateTime) {
    return Promise.reject("Date Range is required");
  }
  const url = `practitioner-role/sessions/find-all-by-org-and-date-range/${organizationId}?startDateTime=${window.encodeURIComponent(
    startDateTime
  )}&endDateTime=${window.encodeURIComponent(endDateTime)}`;
  const response = await httpClient.get(url, { headers: { apiId: "getGroupSessionsByOrgId" } });
  return response.data;
};

export const getGroupSessionsByPractitionerRoleId = async (
  organizationId: string,
  startDateTime: ISO8601String,
  endDateTime: ISO8601String
): Promise<SoulsideSession[]> => {
  if (!organizationId) {
    return Promise.reject("Organization ID is required");
  }
  if (!startDateTime || !endDateTime) {
    return Promise.reject("Date Range is required");
  }
  const url = `practitioner-role/sessions/find-all-by-practitioner-role-and-date-range/${organizationId}?startDateTime=${window.encodeURIComponent(
    startDateTime
  )}&endDateTime=${window.encodeURIComponent(endDateTime)}`;
  const response = await httpClient.get(url, {
    headers: { apiId: "getGroupSessionsByPractitionerRoleId" },
  });
  return response.data;
};

export const getIndividualSessionBySessionId = async (
  sessionId: string
): Promise<IndividualSession> => {
  const url = `practitioner-role/individual-session/find-by-id/${sessionId}`;
  const response = await httpClient.get(url);
  return response.data;
};

export const getGroupSessionBySessionId = async (sessionId: string): Promise<SoulsideSession> => {
  const url = `practitioner-role/sessions/find-by-id/${sessionId}`;
  const response = await httpClient.get(url);
  return response.data;
};

export const getIntakeSessionsByPatientId = async (patientId: string): Promise<Session[]> => {
  const url = `practitioner-role/individual-session/intake/find-all-by-patient/${patientId}`;
  const response = await httpClient.get(url);
  return response.data;
};

export const scheduleSession = async (
  scheduleSessionPayload: ScheduleSessionPayload
): Promise<Session> => {
  const url =
    scheduleSessionPayload.sessionCategory === SessionCategory.INDIVIDUAL
      ? "practitioner-role/individual-session/create"
      : "practitioner-role/sessions/create-on-demand";
  const response = await httpClient.post(url, scheduleSessionPayload);
  return response.data;
};

export const editSession = async (editSessionPayload: Session): Promise<Session> => {
  const url =
    editSessionPayload.sessionCategory === SessionCategory.INDIVIDUAL
      ? "practitioner-role/individual-session/update"
      : "practitioner-role/sessions/update";
  const response = await httpClient.post(url, editSessionPayload, {
    headers: { apiId: `editSession-${editSessionPayload.id}` },
  });
  return response.data;
};
