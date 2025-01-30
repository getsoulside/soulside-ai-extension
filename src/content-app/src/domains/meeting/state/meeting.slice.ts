import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "@/domains/session/models";
import { SoulsideMeetingSession, SoulsideMeetingSessionTranscript } from "../models";

interface ProviderSessionTranscript {
  data: SoulsideMeetingSessionTranscript[];
  loading: boolean;
}

export type ProviderSessionTranscripts = Record<
  NonNullable<SoulsideMeetingSession["id"]>,
  ProviderSessionTranscript
>;

type SessionTranscript = Record<NonNullable<Session["id"]>, ProviderSessionTranscripts>;

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
}

const initialState: MeetingState = {
  sessionDetails: {},
  providerSessions: {},
  transcript: {},
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
  },
});

export const {
  toggleSessionDetailsLoading,
  addSessionDetailsData,
  toggleProviderSessionsLoading,
  addProviderSessionsData,
  toggleTranscriptLoading,
  addTranscriptData,
} = meetingSlice.actions;

export default meetingSlice.reducer;
