import { AppThunk } from "@/store";
import {
  getIndividualSessionsByOrgId,
  getGroupSessionsByOrgId,
  getIndividualSessionsByPractitionerRoleId,
  getGroupSessionsByPractitionerRoleId,
  joinSessionPatientRooms,
  joinSessionGroupRooms,
  checkTodaySession,
  scheduleSession,
  editSession,
} from "../services";
import {
  toggleSessionsLoading,
  addSessionsData,
  addScheduleSessionData,
  editSessionData,
  toggleSessionNotesStatusData,
  addSessionNotesStatusData,
} from "./session.slice";
import {
  Session,
  SessionCategory,
  IndividualSession,
  ScheduleSessionPayload,
  SessionNotesStatus,
  AppointmentType,
  SoulsideSession,
} from "../models";
import { BusinessFunction } from "@/domains/practitionerRole";
import { getSessionNotesBySessionId } from "@/domains/sessionNotes";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";

export const loadSessions =
  (startDateTime: ISO8601String, endDateTime: ISO8601String): AppThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const organizationId = state.userProfile.selectedRole.data?.organizationId;
    const practitionerRoleId = state.userProfile.selectedRole.data?.id;
    const businessFunction = state.userProfile.selectedRole.data?.businessFunction;
    let sessionsList: Session[] = [];
    dispatch(toggleSessionsLoading(true));
    if (businessFunction && businessFunction === BusinessFunction.CLINICAL_CARE) {
      try {
        if (!practitionerRoleId) {
          return Promise.reject("Practitioner Role ID is required");
        }
        try {
          const individualSessions = await getIndividualSessionsByPractitionerRoleId(
            practitionerRoleId,
            startDateTime,
            endDateTime
          );
          sessionsList.push(...individualSessions);
        } catch (error: any) {
          console.error(error);
        }
        try {
          let groupSessions = await getGroupSessionsByPractitionerRoleId(
            practitionerRoleId,
            startDateTime,
            endDateTime
          );
          groupSessions = groupSessions.map(i => {
            return { ...i, sessionCategory: SessionCategory.GROUP };
          });
          sessionsList.push(...groupSessions);
        } catch (error: any) {
          console.error(error);
        }
      } catch (error: any) {
        console.error(error);
      }
    } else {
      try {
        if (!organizationId) {
          return Promise.reject("Organization ID is required");
        }
        try {
          const individualSessions = await getIndividualSessionsByOrgId(
            organizationId,
            startDateTime,
            endDateTime
          );
          sessionsList.push(...individualSessions);
        } catch (error: any) {
          console.error(error);
        }
        try {
          const groupSessions = await getGroupSessionsByOrgId(
            organizationId,
            startDateTime,
            endDateTime
          );
          sessionsList.push(...groupSessions);
        } catch (error: any) {
          console.error(error);
        }
      } catch (error: any) {
        console.error(error);
      }
    }

    const patientIds = sessionsList
      .filter(
        (i): i is IndividualSession =>
          checkTodaySession(i) && i.sessionCategory === SessionCategory.INDIVIDUAL
      )
      .map(i => i.patientId);
    const groupIds = sessionsList
      .filter(
        (i): i is SoulsideSession =>
          checkTodaySession(i) && i.sessionCategory === SessionCategory.GROUP
      )
      .map(i => i.groupId);
    joinSessionPatientRooms(patientIds);
    joinSessionGroupRooms(groupIds);

    dispatch(addSessionsData(sessionsList));
    dispatch(toggleSessionsLoading(false));
  };

export const loadScheduleSession =
  (scheduleSessionPayload: ScheduleSessionPayload): AppThunk =>
  async dispatch => {
    try {
      let newSession = await scheduleSession(scheduleSessionPayload);
      if (newSession?.id) {
        dispatch(addScheduleSessionData(newSession));
        if (checkTodaySession(newSession)) {
          if (newSession.sessionCategory === SessionCategory.INDIVIDUAL) {
            joinSessionPatientRooms([(newSession as IndividualSession).patientId]);
          } else {
            joinSessionGroupRooms([(newSession as SoulsideSession).groupId]);
          }
        }
        return newSession;
      } else {
        return Promise.reject("Failed to schedule appointment");
      }
    } catch (error: any) {
      console.error(error);
      return Promise.reject("Failed to schedule appointment");
    }
  };

export const loadEditSession =
  (editSessionPayload: Session): AppThunk =>
  async dispatch => {
    try {
      let session = await editSession(editSessionPayload);
      if (session?.id) {
        dispatch(editSessionData(session));
        if (checkTodaySession(session)) {
          if (session.sessionCategory === SessionCategory.INDIVIDUAL) {
            joinSessionPatientRooms([(session as IndividualSession).patientId]);
          } else {
            joinSessionGroupRooms([(session as SoulsideSession).groupId]);
          }
        }
        return session;
      } else {
        return Promise.reject("Failed to edit appointment");
      }
    } catch (error: any) {
      console.error(error);
      return Promise.reject("Failed to edit appointment");
    }
  };

export const loadSessionNotesStatus =
  (session: Session): AppThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const noteTemplatesLibrary = state.sessionNotes.noteTemplatesLibrary;
    try {
      if (!session.id) {
        return Promise.reject("Session ID is required");
      }
      dispatch(toggleSessionNotesStatusData({ sessionId: session.id, show: true }));
      try {
        const sessionNotes = await getSessionNotesBySessionId(session.id);
        const jsonSoapNote = sessionNotes?.jsonSoapNote;
        const notesStatus = {
          [SessionNotesTemplates.INTAKE]:
            !!jsonSoapNote?.[SessionNotesTemplates.INTAKE]?.intakeHPINote,
          [SessionNotesTemplates.SOAP_PSYCHIATRY]:
            !!jsonSoapNote?.[SessionNotesTemplates.SOAP_PSYCHIATRY],
          [SessionNotesTemplates.FOLLOW_UP_ASSESSMENT]:
            !!jsonSoapNote?.chiefCompliantEnhanced ||
            !!jsonSoapNote?.subjective?.chief_complaint?.result ||
            !!jsonSoapNote?.Subjective?.chief_complaint?.result,
          [SessionNotesTemplates.GROUP]: !!jsonSoapNote?.[SessionNotesTemplates.GROUP],
          [SessionNotesTemplates.GROUP_EXTENDED_NOTES]:
            !!jsonSoapNote?.[SessionNotesTemplates.GROUP_EXTENDED_NOTES],
          [SessionNotesTemplates.BPS]: !!jsonSoapNote?.[SessionNotesTemplates.BPS],
        };
        const appointmentType =
          (session as IndividualSession).appointmentType || AppointmentType.FOLLOW_UP;
        const sessionCategory = session.sessionCategory as SessionCategory;
        let noteTemplate = noteTemplatesLibrary?.[sessionCategory]?.[appointmentType]?.find(
          i => i.isDefault
        );
        const notesExists = noteTemplate?.key ? notesStatus?.[noteTemplate.key] : false;
        const sessionNotesStatus: SessionNotesStatus = {
          sessionId: session.id,
          sessionCategory,
          appointmentType,
          notesStatus,
          notesExists,
        };
        dispatch(
          addSessionNotesStatusData({ sessionId: session.id, notesStatus: sessionNotesStatus })
        );
        dispatch(toggleSessionNotesStatusData({ sessionId: session.id, show: false }));
        return notesStatus;
      } catch (error: any) {
        console.error(error);
        dispatch(toggleSessionNotesStatusData({ sessionId: session.id, show: false }));
        return Promise.reject("Failed to load session notes status");
      }
    } catch (error: any) {
      console.error(error);
      return Promise.reject("Failed to load session notes status");
    }
  };
