import WebsocketClient from "@/utils/websocketClient";
import { store } from "@/store";
import { Session } from "../models";
import { getDateTime } from "@/utils/date";
import { SoulsideMeetingSession } from "@/domains/meeting";

export const getSessionPatientSocket = (): WebsocketClient => {
  const selectedRole = store.getState().userProfile.selectedRole.data;
  let organizationId = selectedRole?.organizationId || "";
  let practitionerRoleId = selectedRole?.id || "";
  const url = "patient";
  const query = {
    organizationId,
    practitionerRoleId,
    practitionerRoleClient: true,
  };
  const patientSocket = WebsocketClient.getInstance({ url, query });
  return patientSocket;
};

export const getSessionGroupSocket = (): WebsocketClient => {
  const selectedRole = store.getState().userProfile.selectedRole.data;
  let organizationId = selectedRole?.organizationId || "";
  let practitionerRoleId = selectedRole?.id || "";
  const url = "group";
  const query = {
    organizationId,
    practitionerRoleId,
    practitionerRoleClient: true,
  };
  const groupSocket = WebsocketClient.getInstance({ url, query });
  return groupSocket;
};

export const joinSessionPatientRooms = (patientIds: (UUIDString | null)[]): void => {
  const patientSocket = getSessionPatientSocket();
  patientSocket.emit("practitioner-role-join-patient-rooms", patientIds);
  patientSocket.on("patient-status-update", data => {
    store.dispatch({ type: "ADD_PATIENT_STATUS_DATA", data });
  });
  patientSocket.on("send-mental-wellness-data", data => {
    store.dispatch({ type: "ADD_PATIENT_MENTAL_WELLNESS_DATA", data });
  });
  patientSocket.on("session-notes-status-update", data => {
    let sessionId = data?.individualSessionId;
    if (sessionId && data?.status === "created") {
      store.dispatch({
        type: "ADD_SESSION_NOTES_GENERATED",
        sessionId,
      });
      // if (!sessionNotesGeneratedLocalData.includes(sessionId)) {
      //   sessionNotesGeneratedLocalData.push(sessionId);
      //   addLocalStorage("session-notes-generated", sessionNotesGeneratedLocalData);
      // }
    }
  });
};

export const joinSessionGroupRooms = (groupIds: (UUIDString | null)[]): void => {
  const groupSocket = getSessionGroupSocket();
  groupSocket.emit("practitioner-role-join-group-rooms", groupIds);
  groupSocket.on("group-status-update", data => {
    store.dispatch({ type: "ADD_GROUP_STATUS_DATA", data });
  });
  groupSocket.on("send-mental-wellness-data", data => {
    store.dispatch({ type: "ADD_GROUP_MENTAL_WELLNESS_DATA", data });
  });
};

export const checkTodaySession = (session: Session | SoulsideMeetingSession) => {
  if (
    !session ||
    !((session as Session).startTime || (session as SoulsideMeetingSession).startedAt)
  ) {
    return false;
  }
  const sessionDate = getDateTime(
    (session as Session).startTime || (session as SoulsideMeetingSession).startedAt
  );
  const today = getDateTime().startOf("day");
  const isTodaysSession = sessionDate.isSame(today, "day");
  return isTodaysSession;
};
