import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Session,
  SessionGroupWaitingStatus,
  SessionNotesStatus,
  SessionPatientWaitingStatus,
} from "../models";
import { addLocalStorage, getSessionNotesStatusFromLocal } from "@/utils/storage";
import { Patient } from "@/domains/patient";
import { SoulsideGroup } from "@/domains/group";
import LOCAL_STORAGE_KEYS from "@/constants/localStorageKeys";

export interface SessionState {
  sessionsList: {
    data: Session[];
    loading: boolean;
  };
  sessionPatientWaitingStatus: {
    data: Record<NonNullable<Patient["id"]>, SessionPatientWaitingStatus>;
    loading: boolean;
  };
  sessionGroupWaitingStatus: {
    data: Record<NonNullable<SoulsideGroup["id"]>, SessionGroupWaitingStatus>;
    loading: boolean;
  };
  sessionNotesStatus: {
    data: Record<NonNullable<Session["id"]>, SessionNotesStatus>;
    loading: Record<NonNullable<Session["id"]>, boolean>;
  };
}

const initialState: SessionState = {
  sessionsList: {
    data: [],
    loading: false,
  },
  sessionPatientWaitingStatus: {
    data: {},
    loading: false,
  },
  sessionGroupWaitingStatus: {
    data: {},
    loading: false,
  },
  sessionNotesStatus: {
    data: getSessionNotesStatusFromLocal(),
    loading: {},
  },
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    toggleSessionsLoading(state, action: PayloadAction<boolean>) {
      state.sessionsList.loading = action.payload;
    },
    addSessionsData(state, action: PayloadAction<Session[]>) {
      state.sessionsList.data = action.payload;
    },
    addScheduleSessionData(state, action: PayloadAction<Session>) {
      state.sessionsList.data.push(action.payload);
    },
    editSessionData(state, action: PayloadAction<Session>) {
      const index = state.sessionsList.data.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.sessionsList.data[index] = action.payload;
      }
    },
    toggleSessionNotesStatusData(
      state,
      action: PayloadAction<{ sessionId: UUIDString; show: boolean }>
    ) {
      state.sessionNotesStatus.loading[action.payload.sessionId] = action.payload.show;
    },
    addSessionNotesStatusData(
      state,
      action: PayloadAction<{ sessionId: UUIDString; notesStatus: SessionNotesStatus }>
    ) {
      state.sessionNotesStatus.data[action.payload.sessionId] = action.payload.notesStatus;
      addLocalStorage(LOCAL_STORAGE_KEYS.SESSION_NOTES_STATUS, state.sessionNotesStatus.data);
    },
  },
});

export const {
  toggleSessionsLoading,
  addSessionsData,
  addScheduleSessionData,
  editSessionData,
  toggleSessionNotesStatusData,
  addSessionNotesStatusData,
} = sessionSlice.actions;

export default sessionSlice.reducer;
