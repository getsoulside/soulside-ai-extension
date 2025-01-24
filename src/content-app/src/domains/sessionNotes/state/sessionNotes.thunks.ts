import { Session, SessionCategory } from "@/domains/session/models";
import { AppThunk } from "@/store";
import {
  getProviderSessions,
  getProviderSessionTranscript,
  getSessionDetailsById,
} from "../services";
import {
  toggleSessionLoading,
  addSessionData,
  toggleTranscriptLoader,
  addTranscriptData,
  toggleSoapNotesLoader,
  addSoapNotesDefaultData,
  addSoapNotesJsonData,
} from "./sessionNotes.slice";
import { SoulsideMeetingSession } from "@/domains/meeting";

export const loadSessionDetails =
  (sessionId: string, sessionCategory: SessionCategory): AppThunk =>
  async dispatch => {
    dispatch(toggleSessionLoading({ sessionId, show: true }));
    try {
      const data: Session = await getSessionDetailsById(sessionId, sessionCategory);
      dispatch(addSessionData({ sessionId, data }));
    } catch (error: any) {
      console.error(error);
    }
    dispatch(toggleSessionLoading({ sessionId, show: false }));
  };

export const loadSessionTranscript =
  (sessionId: string, sessionCategory: SessionCategory, triggerTime: Date): AppThunk =>
  async dispatch => {
    let transcriptData: any = [];
    dispatch(toggleTranscriptLoader({ sessionId, show: true }));
    try {
      const providerSessionsList: SoulsideMeetingSession[] = await getProviderSessions(
        sessionId,
        sessionCategory
      );
      let providerSessionTranscriptPromiseList: any = [];
      providerSessionsList.forEach(providerSession => {
        if (!providerSession?.startedAt) return;
        const startedAt = new Date(providerSession?.startedAt);
        const currentTime = new Date();
        const startTimePlus60 = new Date(
          startedAt.getTime() +
            (sessionCategory === SessionCategory.INDIVIDUAL ? 2 : 4) * 60 * 60 * 1000
        ); //retry active till 2 hrs after starting the individual session & 4 hrs after starting the group session
        const retryTranscript = currentTime < startTimePlus60;
        let providerSessionTimer = null;
        let providerSessionTranscriptPromise = getProviderSessionTranscript({
          retryTranscript,
          session: providerSession,
          sessionCategory,
          triggerTime,
          providerSessionTimer,
        });
        providerSessionTranscriptPromiseList.push(providerSessionTranscriptPromise);
      });
      try {
        let providerSessionTranscriptPromiseResponses: any = await Promise.allSettled(
          providerSessionTranscriptPromiseList
        );
        if (providerSessionTranscriptPromiseResponses?.length > 0) {
          providerSessionTranscriptPromiseResponses.forEach(
            (providerSessionTranscriptResponse: any) => {
              if (providerSessionTranscriptResponse?.value?.transcriptData?.length > 0) {
                let providerTranscriptData =
                  providerSessionTranscriptResponse.value.transcriptData || [];
                let providerSessionId = providerSessionTranscriptResponse.value.providerSessionId;
                let providerSession = providerSessionTranscriptResponse.value.providerSession;
                transcriptData.push({
                  providerSessionId,
                  providerSession,
                  transcriptData: providerTranscriptData,
                });
              }
            }
          );
        }
      } catch (error: any) {
        console.error(error);
      }
    } catch (error: any) {
      console.error(error);
    }
    // dispatch(addTranscriptData({ sessionId, data: transcriptData }));
    dispatch(toggleTranscriptLoader({ sessionId, show: false }));
  };
