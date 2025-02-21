import { AppThunk } from "@/store";
import { getSessionNotesBySessionId } from "../services/sessionNotesApi";
import { addSessionNotes, toggleSessionNotesLoading } from "./sessionNotes.slice";

export const loadSessionNotes =
  (sessionId: string): AppThunk =>
  async dispatch => {
    dispatch(toggleSessionNotesLoading({ sessionId, loading: true }));
    try {
      const notes = await getSessionNotesBySessionId(sessionId);
      const sessionNotes = notes?.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      dispatch(addSessionNotes({ sessionId, notes: sessionNotes }));
    } catch (error) {
      console.error(error);
    }
    dispatch(toggleSessionNotesLoading({ sessionId, loading: false }));
  };
