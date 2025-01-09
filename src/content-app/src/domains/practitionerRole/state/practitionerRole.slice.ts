import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PractitionerRole } from "../models/practitionerRole.model";

export interface PractitionerRoleState {
  orgPractitionersRoles: {
    data: PractitionerRole[] | [];
    loading: boolean;
  };
}

const initialState: PractitionerRoleState = {
  orgPractitionersRoles: {
    data: [],
    loading: false,
  },
};

const practitionerRoleSlice = createSlice({
  name: "practitionerRole",
  initialState,
  reducers: {
    toggleOrgPractitionersRolesLoading(state, action: PayloadAction<boolean>) {
      state.orgPractitionersRoles.loading = action.payload;
    },
    addOrgPractitionersRolesData(state, action: PayloadAction<PractitionerRole[]>) {
      state.orgPractitionersRoles.data = action.payload;
    },
  },
});

export const { toggleOrgPractitionersRolesLoading, addOrgPractitionersRolesData } =
  practitionerRoleSlice.actions;

export default practitionerRoleSlice.reducer;
