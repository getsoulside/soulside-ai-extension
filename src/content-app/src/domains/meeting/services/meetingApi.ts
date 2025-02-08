import { SessionCategory } from "@/domains/session";
import httpClient from "@/utils/httpClient";
import { SoulsideMeetingSession, SoulsideMeetingSessionTranscript } from "../models";
import { parseCsv } from "@/utils/parseCsv";

export const getReconciledIndividualProviderSessions = async (
  sessionId: string
): Promise<SoulsideMeetingSession[]> => {
  const url = `practitioner-role/meeting-session/individual-session/${sessionId}/list/reconciled-provider-sessions`;
  const response = await httpClient.get(url);
  return response.data;
};

export const getReconciledGroupProviderSessions = async (
  sessionId: string
): Promise<SoulsideMeetingSession[]> => {
  const url = `practitioner-role/meeting-session/group/${sessionId}/list/reconciled-provider-sessions`;
  const response = await httpClient.get(url);
  return response.data;
};

export const getProviderSessionTranscriptData = async (
  providerSession: SoulsideMeetingSession
): Promise<SoulsideMeetingSessionTranscript[]> => {
  const url =
    providerSession.sessionCategory === SessionCategory.INDIVIDUAL
      ? `practitioner-role/meeting-session/individual-session/${providerSession.individualSessionId}/provider-session-id/${providerSession.providerSessionId}/transcript-from-audio`
      : `practitioner-role/meeting-session/group/${providerSession.sessionId}/provider-session-id/${providerSession.providerSessionId}/transcript-from-audio`;
  const response = await httpClient.get(url);
  const transcriptUrl = response.data.trim();
  const csvData = await parseCsv(transcriptUrl);
  return csvData.data;
};
