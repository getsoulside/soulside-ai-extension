import httpClient from "@/utils/httpClient";
import { Session, SessionCategory } from "@/domains/session/models";
import { SessionNotes } from "../models";
import { SoulsideMeetingSession } from "@/domains/meeting";
import Papa from "papaparse";

export const getSessionNotes = async (session: Session): Promise<SessionNotes[]> => {
  if (!session.id) {
    return [];
  }
  const url = `practitioner-role/session-member-notes/session/${session.id}/find`;
  const response = await httpClient.get(url, {
    headers: { apiId: `getSessionNotes-${session.id}` },
  });
  return response.data;
};

export const getSessionDetailsById = async (
  sessionId: string,
  sessionCategory: SessionCategory
) => {
  let url = `practitioner-role/sessions/find-by-id/${sessionId}`;
  if (sessionCategory === SessionCategory.INDIVIDUAL) {
    url = `practitioner-role/individual-session/find-by-id/${sessionId}`;
  }
  let sessionDetails = null;
  let response = await httpClient.get(url, {
    headers: { apiId: `getSessionDetailsById-${sessionId}` },
  });
  if (response?.data) {
    let data = response.data || null;
    sessionDetails = data;
  }
  return sessionDetails;
};

export const getProviderSessions = async (sessionId: string, sessionCategory: SessionCategory) => {
  let url =
    sessionCategory === SessionCategory.INDIVIDUAL
      ? `practitioner-role/meeting-session/individual-session/${sessionId}/list/reconciled-provider-sessions`
      : `practitioner-role/meeting-session/group/${sessionId}/list/reconciled-provider-sessions`;
  let response = await httpClient.get(url, {
    headers: { apiId: `getProviderSessions-${sessionId}` },
  });
  let providerSessionsList: SoulsideMeetingSession[] = response?.data || [];
  providerSessionsList = providerSessionsList.sort((a, b) => {
    if (!a.startedAt || !b.startedAt) return 0;
    return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
  });
  return providerSessionsList;
};

export const getProviderSessionTranscript = async (options: any) => {
  let { session, sessionCategory, triggerTime, providerSessionTimer, retryTranscript } = options;
  let secondsPassed = (new Date().getTime() - triggerTime.getTime()) / 1000;
  const timeoutTime = 600; // retry for 10 minutes on PROD and 2 minuted on DEV
  if (secondsPassed >= timeoutTime) {
    retryTranscript = false;
  }
  if (providerSessionTimer) {
    clearTimeout(providerSessionTimer);
  }
  let providerSessionTranscriptData = null;
  let sessionId =
    sessionCategory === SessionCategory.INDIVIDUAL
      ? session?.individualSessionId
      : session?.sessionId;
  let providerSessionId = session?.providerSessionId;
  let url =
    sessionCategory === SessionCategory.INDIVIDUAL
      ? `practitioner-role/meeting-session/individual-session/${sessionId}/provider-session-id/${providerSessionId}/transcript-from-audio`
      : `practitioner-role/meeting-session/group/${sessionId}/provider-session-id/${providerSessionId}/transcript-from-audio`;
  try {
    let response = await httpClient.get(url, {
      headers: { apiId: `getProviderSessionTranscript-${providerSessionId}` },
    });
    if (response?.data) {
      let transcriptUrl = response.data.trim();
      let pdfPromise = new Promise((resolve, reject) => {
        let resultData: any = null;
        Papa.parse(transcriptUrl, {
          download: true,
          complete: function (results) {
            let data = results?.data || [];
            let transcriptData = data
              .map((i: any) => {
                return {
                  timestamp: Number(i[0]),
                  providerParticipantId: i[1],
                  providerPeerId: i[2],
                  memberId: i[3],
                  memberName: i[4],
                  transcriptText: i[5],
                };
              })
              .sort((a, b) => a.timestamp - b.timestamp);
            resultData = {
              transcriptData,
              csvData: data,
              providerSessionId,
              providerSession: session,
              sessionId,
            };
            if (transcriptData?.length > 0) {
              resolve(resultData);
            } else {
              if (!!retryTranscript) {
                providerSessionTimer = setTimeout(async () => {
                  let resultRecurData = await getProviderSessionTranscript(options);
                  resolve(resultRecurData);
                }, 10000);
              } else {
                reject(resultData);
              }
            }
          },
          error: function (error) {
            console.log(error, providerSessionId);
            if (!!retryTranscript) {
              providerSessionTimer = setTimeout(async () => {
                let resultRecurData = await getProviderSessionTranscript(options);
                resolve(resultRecurData);
              }, 10000);
            } else {
              reject(resultData);
            }
          },
        });
      });
      try {
        providerSessionTranscriptData = await pdfPromise;
      } catch (error) {
        console.log(error, providerSessionId);
      }
    } else {
      if (!!retryTranscript) {
        providerSessionTimer = setTimeout(async () => {
          let resultRecurData = await getProviderSessionTranscript(options);
          providerSessionTranscriptData = resultRecurData;
        }, 10000);
      } else {
        providerSessionTranscriptData = null;
      }
    }
  } catch (error) {
    console.log("error", error, providerSessionId);
    if (!!retryTranscript) {
      providerSessionTimer = setTimeout(async () => {
        let resultRecurData = await getProviderSessionTranscript(options);
        providerSessionTranscriptData = resultRecurData;
      }, 10000);
    } else {
      providerSessionTranscriptData = null;
    }
  }
  return providerSessionTranscriptData;
};
