import { AppThunk } from "@/store";
import {
  addProviderSessionsData,
  addSessionDetailsData,
  addTranscriptData,
  toggleProviderSessionsLoading,
  toggleSessionDetailsLoading,
  toggleTranscriptLoading,
} from "./meeting.slice";
import { checkTodaySession, SessionCategory } from "@/domains/session";
import {
  getReconciledIndividualProviderSessions,
  getReconciledGroupProviderSessions,
  getProviderSessionTranscriptData,
  getIndividualSessionDetails,
  getGroupSessionDetails,
} from "../services";
import { SoulsideMeetingSession, SoulsideMeetingSessionTranscript } from "../models";

export const loadSessionDetails =
  (sessionId: string, sessionCategory: SessionCategory): AppThunk =>
  async dispatch => {
    dispatch(toggleSessionDetailsLoading({ sessionId, loading: true }));
    try {
      const sessionDetails =
        sessionCategory === SessionCategory.INDIVIDUAL
          ? await getIndividualSessionDetails(sessionId)
          : await getGroupSessionDetails(sessionId);
      dispatch(addSessionDetailsData({ sessionId, sessionDetails }));
    } catch (error) {
      console.error(error);
    }
    dispatch(toggleSessionDetailsLoading({ sessionId, loading: false }));
  };

export const loadProviderSessions =
  (sessionId: string, sessionCategory: SessionCategory): AppThunk =>
  async dispatch => {
    dispatch(toggleProviderSessionsLoading({ sessionId, loading: true }));
    try {
      let providerSessions =
        sessionCategory === SessionCategory.INDIVIDUAL
          ? await getReconciledIndividualProviderSessions(sessionId)
          : await getReconciledGroupProviderSessions(sessionId);
      providerSessions = providerSessions.sort(
        (a: SoulsideMeetingSession, b: SoulsideMeetingSession) =>
          a.startedAt && b.startedAt
            ? new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
            : 0
      );
      dispatch(addProviderSessionsData({ sessionId, providerSessions }));
    } catch (error) {
      console.error(error);
    }
    dispatch(toggleProviderSessionsLoading({ sessionId, loading: false }));
  };

export const loadTranscript =
  (providerSession: SoulsideMeetingSession): AppThunk =>
  async dispatch => {
    const sessionCategory = providerSession.sessionCategory;
    const sessionId =
      sessionCategory === SessionCategory.INDIVIDUAL
        ? providerSession.individualSessionId
        : providerSession.sessionId;
    if (!sessionId || !providerSession.id || !sessionCategory) {
      return;
    }
    dispatch(
      toggleTranscriptLoading({
        sessionId,
        providerSessionId: providerSession.id,
        loading: true,
      })
    );
    try {
      let transcriptData;
      const isTodaySession = checkTodaySession(providerSession);

      if (isTodaySession) {
        const startTime = Date.now();
        const timeout = 10 * 60 * 1000; // 10 minutes in milliseconds
        const interval = 10 * 1000; // 10 seconds in milliseconds

        while (Date.now() - startTime < timeout) {
          try {
            transcriptData = await getProviderSessionTranscriptData(providerSession);
            break; // Exit loop if successful
          } catch (error) {
            if (Date.now() - startTime + interval >= timeout) {
              throw error; // Re-throw if this would be the last attempt
            }
            await new Promise(resolve => setTimeout(resolve, interval));
          }
        }
      } else {
        transcriptData = await getProviderSessionTranscriptData(providerSession);
      }
      transcriptData =
        transcriptData?.map(
          (transcript: any): SoulsideMeetingSessionTranscript => ({
            timestamp: Number(transcript[0]),
            providerParticipantId: transcript[1],
            providerPeerId: transcript[2],
            participantId: transcript[3],
            participantName: transcript[4],
            transcriptText: transcript[5],
            mappedParticipantId: transcript[6],
            mappedParticipantName: transcript[7],
          })
        ) || [];
      dispatch(
        addTranscriptData({
          sessionId,
          providerSessionId: providerSession.id,
          transcriptData: transcriptData || [],
        })
      );
    } catch (error) {
      console.error(error);
    }
    dispatch(
      toggleTranscriptLoading({
        sessionId,
        providerSessionId: providerSession.id,
        loading: false,
      })
    );
  };
