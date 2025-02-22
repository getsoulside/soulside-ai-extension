import httpClient from "@/utils/httpClient";
import { SessionNotes } from "../models";
import { SessionNotesTemplates } from "../models/sessionNotes.types";
import { API_BASE_URL, SESSION_TRANSCRIPT_LLM_API_URL } from "@/constants/envVariables";

export const getSessionNotesBySessionId = async (
  sessionId: string
): Promise<SessionNotes | null> => {
  if (!sessionId) {
    return null;
  }
  const url = `practitioner-role/session-member-notes/session/${sessionId}/find`;
  const response = await httpClient.get(url);
  const sessionNotes: SessionNotes =
    response.data?.length > 0
      ? response.data.sort(
          (a: SessionNotes, b: SessionNotes) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
      : null;
  if (sessionNotes?.jsonSoapNote) {
    if (sessionNotes.jsonSoapNote?.Subjective) {
      sessionNotes.jsonSoapNote.subjective = sessionNotes.jsonSoapNote.Subjective;
      delete sessionNotes.jsonSoapNote.Subjective;
    }
    if (sessionNotes.jsonSoapNote?.Objective) {
      sessionNotes.jsonSoapNote.objective = sessionNotes.jsonSoapNote.Objective;
      delete sessionNotes.jsonSoapNote.Objective;
    }
    if (sessionNotes.jsonSoapNote?.Assessment) {
      sessionNotes.jsonSoapNote.assessment = sessionNotes.jsonSoapNote.Assessment;
      delete sessionNotes.jsonSoapNote.Assessment;
    }
    if (sessionNotes.jsonSoapNote?.Plan) {
      sessionNotes.jsonSoapNote.plan = sessionNotes.jsonSoapNote.Plan;
      delete sessionNotes.jsonSoapNote.Plan;
    }
  }
  return sessionNotes;
};

export const generateSessionNotes = async (
  noteTemplate: SessionNotesTemplates,
  payload: any
): Promise<any> => {
  const generateSessionNotesUrls: Record<SessionNotesTemplates, string> = {
    [SessionNotesTemplates.DEFAULT_SOAP]: `${SESSION_TRANSCRIPT_LLM_API_URL}/transcript/generate-soap-note`,
    [SessionNotesTemplates.FOLLOW_UP_ASSESSMENT]: `${SESSION_TRANSCRIPT_LLM_API_URL}/transcript/generate-soap-note/custom/serenity`,
    [SessionNotesTemplates.INTAKE]: `${SESSION_TRANSCRIPT_LLM_API_URL}/transcript/generate-intake-note/custom/hpi-note/v2`,
    [SessionNotesTemplates.BPS]: `${SESSION_TRANSCRIPT_LLM_API_URL}/transcript/generate-intake-note/custom/sagepoint`,
    [SessionNotesTemplates.GROUP]: `${SESSION_TRANSCRIPT_LLM_API_URL}/transcript/generate-soap-note/group/v2/from-csv-rows`,
    [SessionNotesTemplates.GROUP_EXTENDED_NOTES]: `${SESSION_TRANSCRIPT_LLM_API_URL}/transcript/generate-soap-note/group/extended`,
  };
  const url = generateSessionNotesUrls[noteTemplate];
  const response = await httpClient.post(url, payload, { headers: { proxy: true } });
  return response.data;
};

export const saveSessionNotes = async (notes: SessionNotes): Promise<SessionNotes> => {
  const url = `${API_BASE_URL}/practitioner-role/session-member-notes/save-soap-notes`;
  const payload = notes || {};
  const response = await httpClient.post(url, payload, { headers: { proxy: true } });
  return response.data;
};
