import { Session } from "@/domains/session/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionNotes } from "../models";

interface SessionNotesState {
  notes: Record<NonNullable<Session["id"]>, { data: SessionNotes | null; loading: boolean }>;
}

const initialState: SessionNotesState = {
  notes: {},
};

const sessionNotesSlice = createSlice({
  name: "sessionDetails",
  initialState,
  reducers: {
    toggleSessionNotesLoading(
      state,
      action: PayloadAction<{ sessionId: string; loading: boolean }>
    ) {
      const { sessionId, loading } = action.payload;
      if (!state.notes[sessionId]) {
        state.notes[sessionId] = {
          data: null,
          loading: false,
        };
      }
      state.notes[sessionId].loading = loading;
    },
    addSessionNotes(state, action: PayloadAction<{ sessionId: string; notes: SessionNotes }>) {
      const { sessionId, notes } = action.payload;
      if (!state.notes[sessionId]) {
        state.notes[sessionId] = {
          data: null,
          loading: false,
        };
      }
      state.notes[sessionId].data = notes;
    },
  },
});

export const { toggleSessionNotesLoading, addSessionNotes } = sessionNotesSlice.actions;

export default sessionNotesSlice.reducer;
