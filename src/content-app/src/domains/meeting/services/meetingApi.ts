import { Session, SessionCategory, IndividualSession, ModeOfDelivery } from "@/domains/session";
import httpClient from "@/utils/httpClient";
import { SoulsideMeetingSession, SoulsideMeetingSessionTranscript } from "../models";
import { parseCsv, unParseCsv } from "@/utils/parseCsv";
import { API_BASE_URL } from "@/constants";

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
  providerSession: SoulsideMeetingSession,
  sessionDetails: Session | null
): Promise<SoulsideMeetingSessionTranscript[]> => {
  let url =
    providerSession.sessionCategory === SessionCategory.INDIVIDUAL
      ? `practitioner-role/meeting-session/individual-session/${providerSession.individualSessionId}/provider-session-id/${providerSession.providerSessionId}/transcript-from-audio`
      : `practitioner-role/meeting-session/group/${providerSession.sessionId}/provider-session-id/${providerSession.providerSessionId}/transcript-from-audio`;
  const organizationName = providerSession?.organizationName;
  const isSerenityOrg = organizationName?.toLowerCase()?.includes("serenity");
  if (!isSerenityOrg && providerSession?.modeOfDelivery === ModeOfDelivery.VIRTUAL) {
    url =
      providerSession.sessionCategory === SessionCategory.INDIVIDUAL
        ? `practitioner-role/meeting-session/individual-session/${providerSession.individualSessionId}/provider-session-id/${providerSession.providerSessionId}/transcript`
        : `practitioner-role/meeting-session/group/${providerSession.sessionId}/provider-session-id/${providerSession.providerSessionId}/transcript`;
  }
  const practitionerRoleId = sessionDetails?.practitionerRoleId;
  const response = await httpClient.get(url);
  const transcriptUrl = response.data.trim();
  const csvData = await parseCsv(transcriptUrl);
  const transcriptData: SoulsideMeetingSessionTranscript[] =
    csvData.data
      ?.filter((transcript: any) => !!transcript && !!transcript[0])
      ?.map((transcript: any): SoulsideMeetingSessionTranscript => {
        const timestamp = Number(transcript[0]);
        const providerParticipantId = transcript[1];
        const providerPeerId = transcript[2];
        const participantId = transcript[3];
        let participantName = transcript[4];
        if (practitionerRoleId && practitionerRoleId === participantId) {
          participantName = `Provider`;
        }
        const transcriptText = transcript[5];
        return {
          timestamp,
          providerParticipantId,
          providerPeerId,
          participantId,
          participantName,
          transcriptText,
        };
      }) || [];
  return transcriptData;
};

export const getProviderSessionSpeakerAudioUrl = async (
  providerSessionId: UUIDString,
  speakerId: string
): Promise<string> => {
  const url = `practitioner-role/meeting-session/provider-session-id/${providerSessionId}/speaker-audio-extraction-results-from-audio/speaker/${speakerId}`;
  const response = await httpClient.get(url);
  return response.data;
};

export const updateProviderSessionTranscript = async (
  providerSession: SoulsideMeetingSession,
  providerSessionTranscriptData: SoulsideMeetingSessionTranscript[]
): Promise<void> => {
  const providerSessionId = providerSession.providerSessionId;
  const individualSessionId = providerSession.individualSessionId;
  const sessionId = providerSession.sessionId;
  const sessionCategory = providerSession.sessionCategory;
  const url =
    sessionCategory === SessionCategory.INDIVIDUAL
      ? `practitioner-role/meeting-session/individual-session/transcript-from-audio/upload?providerSessionId=${providerSessionId}&individualSessionId=${individualSessionId}`
      : `practitioner-role/meeting-session/group/transcript-from-audio/upload?providerSessionId=${providerSessionId}&sessionId=${sessionId}`;
  const csvTranscriptData = providerSessionTranscriptData.map(t => [
    t.timestamp,
    t.providerParticipantId,
    t.providerPeerId,
    t.participantId,
    t.participantName,
    t.transcriptText,
  ]);

  const csv = await unParseCsv(csvTranscriptData);
  await httpClient.post(`${API_BASE_URL}/${url}`, csv, {
    headers: {
      "Content-Type": "multipart/form-data",
      blobType: "text/csv;charset=utf-8;",
      blobName: "session-transcripts-from-audio",
      fileKey: "file",
      proxy: true,
    },
  });
};

export const reEnrollSpeakerAudio = async (
  session: Session | null,
  providerSession: SoulsideMeetingSession,
  speakerIdInDiarizedTranscript: string,
  isProvider: boolean
) => {
  const url = `practitioner-role/meeting-session/speaker-audio-workflow/re-enroll-speaker-audio`;
  const payload = {
    providerSessionId: providerSession.providerSessionId,
    patientId: "",
    practitionerRoleId: "",
    speakerIdInDiarizedTranscript,
    speakerLabel: isProvider ? "provider" : "patient",
  };
  if (!isProvider) {
    payload.patientId = (session as IndividualSession).patientId || "";
  } else {
    payload.practitionerRoleId = (session as IndividualSession).practitionerRoleId || "";
  }
  await httpClient.post(url, payload, { headers: { proxy: true } });
};
