import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Patient } from "../models";

export interface PatientState {
  patientsList: {
    data: Patient[] | [];
    loading: boolean;
  };
}

const initialState: PatientState = {
  patientsList: {
    data: [],
    loading: false,
  },
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    toggleOrgPatientsLoading(state, action: PayloadAction<boolean>) {
      state.patientsList.loading = action.payload;
    },
    addOrgPatientsData(state, action: PayloadAction<Patient[]>) {
      state.patientsList.data = action.payload;
    },
  },
});

export const { toggleOrgPatientsLoading, addOrgPatientsData } = patientSlice.actions;

export default patientSlice.reducer;
