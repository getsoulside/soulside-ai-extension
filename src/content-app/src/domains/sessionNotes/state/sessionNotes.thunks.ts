import { AppThunk } from "@/store";
import {
  generateSessionNotes,
  getSessionNotesBySessionId,
  saveSessionNotes,
} from "../services/sessionNotesApi";
import {
  addSessionNotes,
  toggleGenerateSessionNotesLoading,
  toggleSessionNotesLoading,
} from "./sessionNotes.slice";
import { SessionNotes } from "../models";
import { SessionNotesTemplates } from "../models/sessionNotes.types";
import FollowUpAssessmentNotes from "../models/sessionNotes.follow_up_assessment.types";
import { toast } from "react-toastify";

export const loadSessionNotes =
  (sessionId: string): AppThunk =>
  async dispatch => {
    dispatch(toggleSessionNotesLoading({ sessionId, loading: true }));
    try {
      const sessionNotes = await getSessionNotesBySessionId(sessionId);
      dispatch(addSessionNotes({ sessionId, notes: sessionNotes }));
    } catch (error) {
      console.error(error);
    }
    dispatch(toggleSessionNotesLoading({ sessionId, loading: false }));
  };

export const loadGenerateSessionNotes =
  (sessionId: string, noteTemplate: SessionNotesTemplates, payload: any): AppThunk =>
  async dispatch => {
    dispatch(toggleGenerateSessionNotesLoading({ sessionId, loading: true }));
    try {
      const generatedNotes = await generateSessionNotes(noteTemplate, payload);
      toast.success("Notes generated successfully");
      let sessionNotes: Partial<SessionNotes> = {};
      try {
        sessionNotes = (await getSessionNotesBySessionId(sessionId)) || {};
      } catch (error) {
        console.error(error);
      }
      if (noteTemplate === SessionNotesTemplates.FOLLOW_UP_ASSESSMENT) {
        const followUpAssessmentNotes: FollowUpAssessmentNotes = {};

        if (generatedNotes?.Subjective || generatedNotes?.subjective) {
          followUpAssessmentNotes.subjective =
            generatedNotes.Subjective || generatedNotes.subjective;
        }
        if (generatedNotes?.Objective || generatedNotes?.objective) {
          followUpAssessmentNotes.objective = generatedNotes.Objective || generatedNotes.objective;
        }
        if (generatedNotes?.Assessment || generatedNotes?.assessment) {
          followUpAssessmentNotes.assessment =
            generatedNotes.Assessment || generatedNotes.assessment;
        }
        if (generatedNotes?.Plan || generatedNotes?.plan) {
          followUpAssessmentNotes.plan = generatedNotes.Plan || generatedNotes.plan;
        }
        sessionNotes = {
          ...sessionNotes,
          jsonSoapNote: {
            ...(sessionNotes?.jsonSoapNote || {}),
            ...followUpAssessmentNotes,
          },
        };
      } else {
        sessionNotes = {
          ...sessionNotes,
          jsonSoapNote: {
            ...(sessionNotes?.jsonSoapNote || {}),
            [noteTemplate]: generatedNotes,
          },
        };
      }
      try {
        const savedSessionNotes = await saveSessionNotes(sessionNotes as SessionNotes);
        toast.success("Notes saved successfully");
        dispatch(addSessionNotes({ sessionId, notes: savedSessionNotes }));
      } catch (error) {
        dispatch(addSessionNotes({ sessionId, notes: sessionNotes as SessionNotes }));
        toast.error("Failed to save notes");
        console.error(error);
      }
    } catch (error) {
      toast.error("Failed to generate notes, please try again");
      console.error(error);
    }
    dispatch(toggleGenerateSessionNotesLoading({ sessionId, loading: false }));
  };

export const loadSaveSessionNotes =
  (
    sessionId: string,
    noteTemplate: SessionNotesTemplates,
    notes: SessionNotes,
    silentAction: boolean = false
  ): AppThunk =>
  async dispatch => {
    if (!silentAction) {
      dispatch(toggleSessionNotesLoading({ sessionId, loading: true }));
    }
    try {
      let sessionNotes: Partial<SessionNotes> | null = await getSessionNotesBySessionId(sessionId);
      if (noteTemplate === SessionNotesTemplates.FOLLOW_UP_ASSESSMENT) {
        const jsonSoapNote = sessionNotes?.jsonSoapNote || {};
        if (notes.jsonSoapNote?.subjective) {
          jsonSoapNote.subjective = notes.jsonSoapNote.subjective;
        }
        if (notes.jsonSoapNote?.objective) {
          jsonSoapNote.objective = notes.jsonSoapNote.objective;
        }
        if (notes.jsonSoapNote?.assessment) {
          jsonSoapNote.assessment = notes.jsonSoapNote.assessment;
        }
        if (notes.jsonSoapNote?.plan) {
          jsonSoapNote.plan = notes.jsonSoapNote.plan;
        }
        if (notes.jsonSoapNote?.chiefCompliantEnhanced) {
          jsonSoapNote.chiefCompliantEnhanced = notes.jsonSoapNote.chiefCompliantEnhanced;
        }
        sessionNotes = {
          ...(sessionNotes || {}),
          jsonSoapNote,
        };
      } else {
        sessionNotes = {
          ...(sessionNotes || {}),
          jsonSoapNote: {
            ...(sessionNotes?.jsonSoapNote || {}),
            [noteTemplate]: notes.jsonSoapNote?.[noteTemplate] || null,
          },
        };
      }
      if (notes?.jsonSoapNote?.notesAddedToEhr) {
        sessionNotes = {
          ...(sessionNotes || {}),
          jsonSoapNote: {
            ...(sessionNotes?.jsonSoapNote || {}),
            notesAddedToEhr: notes.jsonSoapNote.notesAddedToEhr || [],
          },
        };
      }
      const savedSessionNotes = await saveSessionNotes(sessionNotes as SessionNotes);
      if (!silentAction) {
        toast.success("Notes saved successfully");
      }
      dispatch(addSessionNotes({ sessionId, notes: savedSessionNotes }));
    } catch (error) {
      if (!silentAction) {
        toast.error("Failed to save notes");
      }
      console.error(error);
    }
    if (!silentAction) {
      dispatch(toggleSessionNotesLoading({ sessionId, loading: false }));
    }
  };
