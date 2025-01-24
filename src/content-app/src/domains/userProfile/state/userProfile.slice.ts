import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimeZone, User, UserAssignedRole } from "../models/userProfile.model";
import { PractitionerRole } from "@/domains/practitionerRole/models";
import {
  getSelectedPractitionerRoleFromLocal,
  getDefaultValueForTimezone,
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
  extensionDrawerOpen: boolean;
}

const initialState: UserProfileState = {
  info: {
    data: null,
    loading: true,
  },
  assignedRoles: { data: null, loading: true },
  selectedRole: { data: null, loading: false },
  selectedTimezone: getDefaultValueForTimezone(),
  currentPageTitle: "",
  extensionDrawerOpen: false,
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
    toggleSelectedUserRoleLoading(state, action: PayloadAction<boolean>) {
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
    toggleExtensionDrawer(state, action: PayloadAction<boolean>) {
      state.extensionDrawerOpen = action.payload;
    },
  },
});

export const initializeUserProfile = () => {
  return async (dispatch: any): Promise<void> => {
    dispatch(toggleSelectedUserRoleLoading(true));
    const selectedRole = await getSelectedPractitionerRoleFromLocal();
    const selectedTimezone = await getSelectedTimezoneFromLocal();
    dispatch(addSelectedUserRole(selectedRole));
    dispatch(addSelectedTimezone(selectedTimezone));
    dispatch(toggleSelectedUserRoleLoading(false));
  };
};

export const {
  toggleUserProfileLoading,
  addUserProfileData,
  toggleSelectedUserRoleLoading,
  addSelectedUserRole,
  toggleUserAssignedRolesLoading,
  addUserAssignedRolesData,
  addSelectedTimezone,
  addCurrentPageTitle,
  toggleExtensionDrawer,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
