import { AppThunk } from "@/store";
import {
  addProviderSessionsData,
  addSessionDetailsData,
  addSpeakerAudiosData,
  addTranscriptData,
  toggleProviderSessionsLoading,
  toggleSessionDetailsLoading,
  toggleSpeakerAudiosLoading,
  toggleTranscriptLoading,
} from "./meeting.slice";
import { checkTodaySession, Session, SessionCategory } from "@/domains/session";
import {
  getReconciledIndividualProviderSessions,
  getReconciledGroupProviderSessions,
  getProviderSessionTranscriptData,
  getProviderSessionSpeakerAudioUrl,
  updateProviderSessionTranscript,
  reEnrollSpeakerAudio,
} from "../services";
import {
  SoulsideMeetingSession,
  SoulsideMeetingSessionSpeakerAudio,
  SoulsideMeetingSessionTranscript,
} from "../models";
import {
  getIndividualSessionBySessionId,
  getGroupSessionBySessionId,
} from "@/domains/session/services/sessionApi";

export const loadSessionDetails =
  (sessionId: string, sessionCategory: SessionCategory): AppThunk =>
  async dispatch => {
    dispatch(toggleSessionDetailsLoading({ sessionId, loading: true }));
    try {
      const sessionDetails =
        sessionCategory === SessionCategory.INDIVIDUAL
          ? await getIndividualSessionBySessionId(sessionId)
          : await getGroupSessionBySessionId(sessionId);
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
  (providerSession: SoulsideMeetingSession, sessionDetails: Session | null): AppThunk =>
  async dispatch => {
    const sessionCategory = providerSession.sessionCategory;
    const sessionId =
      sessionCategory === SessionCategory.INDIVIDUAL
        ? providerSession.individualSessionId
        : providerSession.sessionId;
    if (!sessionId || !providerSession.providerSessionId || !sessionCategory) {
      return;
    }
    dispatch(
      toggleTranscriptLoading({
        sessionId,
        providerSessionId: providerSession.providerSessionId,
        loading: true,
      })
    );
    try {
      let transcriptData: SoulsideMeetingSessionTranscript[] = [];
      const isTodaySession = checkTodaySession(providerSession);

      if (isTodaySession) {
        const startTime = Date.now();
        const timeout = 10 * 60 * 1000; // 10 minutes in milliseconds
        const interval = 10 * 1000; // 10 seconds in milliseconds

        while (Date.now() - startTime < timeout) {
          try {
            transcriptData = await getProviderSessionTranscriptData(
              providerSession,
              sessionDetails
            );
            break; // Exit loop if successful
          } catch (error) {
            if (Date.now() - startTime + interval >= timeout) {
              throw error; // Re-throw if this would be the last attempt
            }
            await new Promise(resolve => setTimeout(resolve, interval));
          }
        }
      } else {
        try {
          transcriptData = await getProviderSessionTranscriptData(providerSession, sessionDetails);
        } catch (error) {
          console.error(error);
        }
      }
      dispatch(
        addTranscriptData({
          sessionId,
          providerSessionId: providerSession.providerSessionId,
          transcriptData: transcriptData || [],
        })
      );
      dispatch(
        loadProviderSessionSpeakerAudios(
          sessionId,
          providerSession.providerSessionId,
          transcriptData || []
        )
      );
    } catch (error) {
      console.error(error);
    }
    dispatch(
      toggleTranscriptLoading({
        sessionId,
        providerSessionId: providerSession.providerSessionId,
        loading: false,
      })
    );
  };

export const saveProviderSessionTranscript =
  (
    session: Session | null,
    providerSession: SoulsideMeetingSession,
    providerSessionTranscriptData: SoulsideMeetingSessionTranscript[]
  ): AppThunk =>
  async dispatch => {
    const sessionCategory = providerSession.sessionCategory;
    const sessionId =
      sessionCategory === SessionCategory.INDIVIDUAL
        ? providerSession.individualSessionId
        : providerSession.sessionId;
    if (!sessionId || !providerSession.providerSessionId || !sessionCategory) {
      return;
    }
    dispatch(
      toggleTranscriptLoading({
        sessionId,
        providerSessionId: providerSession.providerSessionId,
        loading: true,
      })
    );
    try {
      await updateProviderSessionTranscript(providerSession, providerSessionTranscriptData);
      if (sessionCategory === SessionCategory.INDIVIDUAL) {
        let patientVoiceReEnrolled = false;
        let providerVoiceReEnrolled = false;
        for (const transcript of providerSessionTranscriptData) {
          if (transcript.participantName.toLowerCase() === "patient" && !patientVoiceReEnrolled) {
            patientVoiceReEnrolled = true;
            try {
              await reEnrollSpeakerAudio(
                session,
                providerSession,
                transcript.providerParticipantId.replace("Speaker ", ""),
                false
              );
            } catch (error) {
              console.error(error);
            }
          }
          if (transcript.participantName.toLowerCase() === "provider" && !providerVoiceReEnrolled) {
            providerVoiceReEnrolled = true;
            try {
              await reEnrollSpeakerAudio(
                session,
                providerSession,
                transcript.providerParticipantId.replace("Speaker ", ""),
                true
              );
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
      dispatch(
        addTranscriptData({
          sessionId,
          providerSessionId: providerSession.providerSessionId,
          transcriptData: providerSessionTranscriptData || [],
        })
      );
    } catch (error) {
      console.error(error);
    }
    dispatch(
      toggleTranscriptLoading({
        sessionId,
        providerSessionId: providerSession.providerSessionId,
        loading: false,
      })
    );
  };

export const loadProviderSessionSpeakerAudios =
  (
    sessionId: UUIDString,
    providerSessionId: UUIDString,
    transcriptData: SoulsideMeetingSessionTranscript[]
  ): AppThunk =>
  async dispatch => {
    dispatch(toggleSpeakerAudiosLoading({ sessionId, providerSessionId, loading: true }));
    const uniqueSpeakers: { [key: string]: SoulsideMeetingSessionTranscript } =
      transcriptData.reduce(
        (acc, transcript) => ({
          ...acc,
          [transcript.providerParticipantId]: {
            providerParticipantId: transcript.providerParticipantId,
            providerPeerId: transcript.providerPeerId,
            participantId: transcript.participantId,
            participantName: transcript.participantName,
          },
        }),
        {}
      );
    const speakerIds = Object.keys(uniqueSpeakers);
    const speakerAudios: SoulsideMeetingSessionSpeakerAudio[] = [];
    for (let i = 0; i < speakerIds.length; i++) {
      const speakerId = speakerIds[i];
      try {
        const speakerAudioUrl = await getProviderSessionSpeakerAudioUrl(
          providerSessionId,
          speakerId.replace("Speaker ", "")
        );
        speakerAudios.push({
          ...uniqueSpeakers[speakerId],
          speakerId,
          audioFileUrl: speakerAudioUrl,
        });
      } catch (error) {
        console.error(error);
      }
    }
    dispatch(addSpeakerAudiosData({ sessionId, providerSessionId, speakerAudios }));
    dispatch(toggleSpeakerAudiosLoading({ sessionId, providerSessionId, loading: false }));
  };
