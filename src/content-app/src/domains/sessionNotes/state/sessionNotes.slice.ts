import { Session } from "@/domains/session/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NoteTemplatesLibrary, SessionNotes } from "../models";
import { defaultNoteTemplateLibrary } from "../models/sessionNotes.model";

interface SessionNotesState {
  notes: Record<
    NonNullable<Session["id"]>,
    { data: SessionNotes | null; loading: boolean; generateNotesLoading: boolean }
  >;
  noteTemplatesLibrary: NoteTemplatesLibrary;
  ehrSessionNotesLoading: boolean;
}

const initialState: SessionNotesState = {
  notes: {},
  noteTemplatesLibrary: defaultNoteTemplateLibrary,
  ehrSessionNotesLoading: false,
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
          generateNotesLoading: false,
        };
      }
      state.notes[sessionId].loading = loading;
    },
    addSessionNotes(
      state,
      action: PayloadAction<{ sessionId: string; notes: SessionNotes | null }>
    ) {
      const { sessionId, notes } = action.payload;
      if (!state.notes[sessionId]) {
        state.notes[sessionId] = {
          data: null,
          loading: false,
          generateNotesLoading: false,
        };
      }
      state.notes[sessionId].data = notes;
    },
    toggleGenerateSessionNotesLoading(
      state,
      action: PayloadAction<{ sessionId: string; loading: boolean }>
    ) {
      const { sessionId, loading } = action.payload;
      if (!state.notes[sessionId]) {
        state.notes[sessionId] = {
          data: null,
          loading: false,
          generateNotesLoading: false,
        };
      }
      state.notes[sessionId].generateNotesLoading = loading;
    },
    updateNoteTemplateLibrary(state, action: PayloadAction<NoteTemplatesLibrary>) {
      state.noteTemplatesLibrary = action.payload;
    },
    toggleEhrSessionNotesLoadingAction(state, action: PayloadAction<boolean>) {
      state.ehrSessionNotesLoading = action.payload;
    },
  },
});

export const {
  toggleSessionNotesLoading,
  addSessionNotes,
  updateNoteTemplateLibrary,
  toggleEhrSessionNotesLoadingAction,
  toggleGenerateSessionNotesLoading,
} = sessionNotesSlice.actions;

export default sessionNotesSlice.reducer;
