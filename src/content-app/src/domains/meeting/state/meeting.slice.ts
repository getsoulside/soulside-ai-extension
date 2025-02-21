import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "@/domains/session/models";
import {
  SoulsideMeetingSession,
  SoulsideMeetingSessionTranscript,
  SoulsideMeetingSessionSpeakerAudio,
} from "../models";

interface ProviderSessionTranscript {
  data: SoulsideMeetingSessionTranscript[];
  loading: boolean;
}

export type ProviderSessionTranscripts = Record<
  NonNullable<SoulsideMeetingSession["id"]>,
  ProviderSessionTranscript
>;

type SessionTranscript = Record<NonNullable<Session["id"]>, ProviderSessionTranscripts>;

type ProviderSessionSpeakerAudio = {
  data: SoulsideMeetingSessionSpeakerAudio[];
  loading: boolean;
};

type ProviderSessionSpeakerAudios = Record<
  NonNullable<SoulsideMeetingSession["id"]>,
  ProviderSessionSpeakerAudio
>;

type SessionSpeakerAudios = Record<NonNullable<Session["id"]>, ProviderSessionSpeakerAudios>;

type ProviderSession = Record<
  NonNullable<Session["id"]>,
  {
    data: SoulsideMeetingSession[];
    loading: boolean;
  }
>;

type SessionDetails = Record<
  NonNullable<Session["id"]>,
  {
    data: Session | null;
    loading: boolean;
  }
>;

interface MeetingState {
  sessionDetails: SessionDetails;
  providerSessions: ProviderSession;
  transcript: SessionTranscript;
  speakerAudios: SessionSpeakerAudios;
}

const initialState: MeetingState = {
  sessionDetails: {},
  providerSessions: {},
  transcript: {},
  speakerAudios: {},
};

const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    toggleSessionDetailsLoading(
      state,
      action: PayloadAction<{ sessionId: string; loading: boolean }>
    ) {
      const { sessionId, loading } = action.payload;
      if (!state.sessionDetails[sessionId]) {
        state.sessionDetails[sessionId] = {
          data: null,
          loading: false,
        };
      }
      state.sessionDetails[sessionId].loading = loading;
    },
    addSessionDetailsData(
      state,
      action: PayloadAction<{ sessionId: string; sessionDetails: Session }>
    ) {
      const { sessionId, sessionDetails } = action.payload;
      if (!state.sessionDetails[sessionId]) {
        state.sessionDetails[sessionId] = {
          data: null,
          loading: false,
        };
      }
      state.sessionDetails[sessionId].data = sessionDetails;
    },
    toggleProviderSessionsLoading(
      state,
      action: PayloadAction<{ sessionId: string; loading: boolean }>
    ) {
      const { sessionId, loading } = action.payload;
      if (!state.providerSessions[sessionId]) {
        state.providerSessions[sessionId] = {
          data: [],
          loading: false,
        };
      }
      state.providerSessions[sessionId].loading = loading;
    },
    addProviderSessionsData(
      state,
      action: PayloadAction<{ sessionId: string; providerSessions: SoulsideMeetingSession[] }>
    ) {
      const { sessionId, providerSessions } = action.payload;
      if (!state.providerSessions[sessionId]) {
        state.providerSessions[sessionId] = {
          data: [],
          loading: false,
        };
      }
      state.providerSessions[sessionId].data = providerSessions;
    },
    toggleTranscriptLoading(
      state,
      action: PayloadAction<{ sessionId: string; providerSessionId: string; loading: boolean }>
    ) {
      const { sessionId, providerSessionId, loading } = action.payload;
      if (!state.transcript[sessionId]) {
        state.transcript[sessionId] = {
          [providerSessionId]: {
            data: [],
            loading: false,
          },
        };
      } else if (!state.transcript[sessionId][providerSessionId]) {
        state.transcript[sessionId][providerSessionId] = {
          data: [],
          loading: false,
        };
      }
      state.transcript[sessionId][providerSessionId].loading = loading;
    },
    addTranscriptData(
      state,
      action: PayloadAction<{
        sessionId: string;
        providerSessionId: string;
        transcriptData: SoulsideMeetingSessionTranscript[];
      }>
    ) {
      const { sessionId, providerSessionId, transcriptData } = action.payload;
      if (!state.transcript[sessionId]) {
        state.transcript[sessionId] = {
          [providerSessionId]: {
            data: [],
            loading: false,
          },
        };
      } else if (!state.transcript[sessionId][providerSessionId]) {
        state.transcript[sessionId][providerSessionId] = {
          data: [],
          loading: false,
        };
      }
      state.transcript[sessionId][providerSessionId].data = transcriptData;
    },
    toggleSpeakerAudiosLoading(
      state,
      action: PayloadAction<{ sessionId: string; providerSessionId: string; loading: boolean }>
    ) {
      const { sessionId, providerSessionId, loading } = action.payload;
      if (!state.speakerAudios[sessionId]) {
        state.speakerAudios[sessionId] = {
          [providerSessionId]: {
            data: [],
            loading: false,
          },
        };
      } else if (!state.speakerAudios[sessionId][providerSessionId]) {
        state.speakerAudios[sessionId][providerSessionId] = {
          data: [],
          loading: false,
        };
      }
      state.speakerAudios[sessionId][providerSessionId].loading = loading;
    },
    addSpeakerAudiosData(
      state,
      action: PayloadAction<{
        sessionId: string;
        providerSessionId: string;
        speakerAudios: SoulsideMeetingSessionSpeakerAudio[];
      }>
    ) {
      const { sessionId, providerSessionId, speakerAudios } = action.payload;
      if (!state.speakerAudios[sessionId]) {
        state.speakerAudios[sessionId] = {
          [providerSessionId]: {
            data: [],
            loading: false,
          },
        };
      } else if (!state.speakerAudios[sessionId][providerSessionId]) {
        state.speakerAudios[sessionId][providerSessionId] = {
          data: [],
          loading: false,
        };
      }
      state.speakerAudios[sessionId][providerSessionId].data = speakerAudios;
    },
  },
});

export const {
  toggleSessionDetailsLoading,
  addSessionDetailsData,
  toggleProviderSessionsLoading,
  addProviderSessionsData,
  toggleTranscriptLoading,
  addTranscriptData,
  toggleSpeakerAudiosLoading,
  addSpeakerAudiosData,
} = meetingSlice.actions;

export default meetingSlice.reducer;
