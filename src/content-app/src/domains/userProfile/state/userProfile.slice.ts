import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimeZone, User, UserAssignedRole } from "../models/userProfile.model";
import { PractitionerRole } from "@/domains/practitionerRole/models";
import {
  getSelectedPractitionerRoleFromLocal,
  getSelectedTimezoneFromLocal,
} from "@/utils/storage";

export interface UserProfileState {
  info: {
    data: User | null;
    loading: boolean;
  };
  assignedRoles: { data: UserAssignedRole[] | null; loading: boolean };
  selectedRole: { data: PractitionerRole | null; loading: boolean };
  selectedTimezone: TimeZone;
  currentPageTitle: string;
}

const initialState: UserProfileState = {
  info: {
    data: null,
    loading: true,
  },
  assignedRoles: { data: null, loading: true },
  selectedRole: { data: getSelectedPractitionerRoleFromLocal(), loading: false },
  selectedTimezone: getSelectedTimezoneFromLocal(),
  currentPageTitle: "",
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    toggleUserProfileLoading(state, action: PayloadAction<boolean>) {
      state.info.loading = action.payload;
    },
    addUserProfileData(state, action: PayloadAction<User | null>) {
      state.info.data = action.payload;
    },
    toggleSelectedUserRole(state, action: PayloadAction<boolean>) {
      state.selectedRole.loading = action.payload;
    },
    addSelectedUserRole(state, action: PayloadAction<PractitionerRole | null>) {
      state.selectedRole.data = action.payload;
    },
    toggleUserAssignedRolesLoading(state, action: PayloadAction<boolean>) {
      state.assignedRoles.loading = action.payload;
    },
    addUserAssignedRolesData(state, action: PayloadAction<UserAssignedRole[]>) {
      state.assignedRoles.data = action.payload;
    },
    addSelectedTimezone(state, action: PayloadAction<TimeZone>) {
      state.selectedTimezone = action.payload;
    },
    addCurrentPageTitle(state, action: PayloadAction<string>) {
      state.currentPageTitle = action.payload;
    },
  },
});

export const {
  toggleUserProfileLoading,
  addUserProfileData,
  addSelectedUserRole,
  toggleUserAssignedRolesLoading,
  addUserAssignedRolesData,
  addSelectedTimezone,
  addCurrentPageTitle,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
