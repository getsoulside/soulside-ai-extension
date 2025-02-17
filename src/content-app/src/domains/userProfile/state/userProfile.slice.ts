import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimeZone, User, UserAssignedRole } from "../models/userProfile.model";
import { PractitionerRole } from "@/domains/practitionerRole/models";
import {
  getSelectedPractitionerRoleFromLocal,
  getDefaultValueForTimezone,
  getSelectedTimezoneFromLocal,
  getExtensionDrawerPositionFromLocal,
} from "@/utils/storage";
import moment from "moment-timezone";
import { ExtensionDrawerPosition } from "../models/userProfile.types";
import { AppointmentType } from "@/domains/session/models";
import { defaultNoteTemplateLibrary } from "@/domains/sessionNotes/models/sessionNotes.model";
import { SessionCategory } from "@/domains/session/models";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";
import { updateNoteTemplateLibrary } from "@/domains/sessionNotes/state/sessionNotes.slice";
export interface UserProfileState {
  info: {
    data: User | null;
    loading: boolean;
  };
  assignedRoles: { data: UserAssignedRole[] | null; loading: boolean };
  selectedRole: { data: PractitionerRole | null; loading: boolean };
  selectedTimezone: TimeZone;
  sessionListSelectedDate: ISO8601String | null;
  extensionDrawerOpen: boolean;
  extensionDrawerPosition: ExtensionDrawerPosition | null;
}

const initialState: UserProfileState = {
  info: {
    data: null,
    loading: true,
  },
  assignedRoles: { data: null, loading: true },
  selectedRole: { data: null, loading: false },
  selectedTimezone: getDefaultValueForTimezone(),
  extensionDrawerOpen: false,
  sessionListSelectedDate: null,
  extensionDrawerPosition: ExtensionDrawerPosition.TOP_RIGHT,
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
    setSessionListSelectedDate(state, action: PayloadAction<ISO8601String | null>) {
      state.sessionListSelectedDate = action.payload;
    },
    toggleExtensionDrawer(state, action: PayloadAction<boolean>) {
      state.extensionDrawerOpen = action.payload;
    },
    setExtensionDrawerPosition(state, action: PayloadAction<ExtensionDrawerPosition>) {
      state.extensionDrawerPosition = action.payload;
    },
  },
});

export const initializeUserProfile = () => {
  return async (dispatch: any): Promise<void> => {
    dispatch(toggleSelectedUserRoleLoading(true));
    const selectedRole = await getSelectedPractitionerRoleFromLocal();
    const selectedTimezone = await getSelectedTimezoneFromLocal();
    const sessionListSelectedDate = moment().toISOString();
    const extensionDrawerPosition = await getExtensionDrawerPositionFromLocal();
    dispatch(addSelectedUserRole(selectedRole));
    dispatch(
      updateNoteTemplateLibraryByOrganizationId(
        selectedRole?.organizationId || "",
        selectedRole?.organizationName || ""
      )
    );
    dispatch(addSelectedTimezone(selectedTimezone));
    dispatch(setSessionListSelectedDate(sessionListSelectedDate));
    dispatch(setExtensionDrawerPosition(extensionDrawerPosition));
    dispatch(toggleSelectedUserRoleLoading(false));
  };
};

export const updateNoteTemplateLibraryByOrganizationId = (
  organizationId: string,
  organizationName: string
) => {
  return async (dispatch: any): Promise<void> => {
    let noteTemplateLibrary = defaultNoteTemplateLibrary;
    if (organizationId) {
      const isSerenity = organizationId === "ca119abc-9900-46b6-92f9-62ed4d6f84e9";
      const isSagepoint = organizationName?.toLowerCase().includes("sagepoint");
      if (isSerenity) {
        noteTemplateLibrary = {
          ...noteTemplateLibrary,
          [SessionCategory.INDIVIDUAL]: {
            ...noteTemplateLibrary?.[SessionCategory.INDIVIDUAL],
            [AppointmentType.INTAKE]: noteTemplateLibrary?.[SessionCategory.INDIVIDUAL]?.[
              AppointmentType.INTAKE
            ]
              ?.filter(template => template.key === SessionNotesTemplates.INTAKE)
              .map(template => ({
                ...template,
                isDefault: template.key === SessionNotesTemplates.INTAKE,
              })),
            [AppointmentType.FOLLOW_UP]: noteTemplateLibrary?.[SessionCategory.INDIVIDUAL]?.[
              AppointmentType.FOLLOW_UP
            ]
              ?.filter(
                template =>
                  template.key === SessionNotesTemplates.FOLLOW_UP_ASSESSMENT ||
                  template.key === SessionNotesTemplates.DEFAULT_SOAP
              )
              .map(template => ({
                ...template,
                isDefault: template.key === SessionNotesTemplates.FOLLOW_UP_ASSESSMENT,
              })),
          },
        };
      }
      if (isSagepoint) {
        noteTemplateLibrary = {
          ...noteTemplateLibrary,
          [SessionCategory.INDIVIDUAL]: {
            ...noteTemplateLibrary?.[SessionCategory.INDIVIDUAL],
            [AppointmentType.INTAKE]: noteTemplateLibrary?.[SessionCategory.INDIVIDUAL]?.[
              AppointmentType.INTAKE
            ]
              ?.filter(
                template =>
                  template.key === SessionNotesTemplates.BPS ||
                  template.key === SessionNotesTemplates.DEFAULT_SOAP
              )
              .map(template => ({
                ...template,
                isDefault: template.key === SessionNotesTemplates.BPS,
              })),
            [AppointmentType.FOLLOW_UP]: noteTemplateLibrary?.[SessionCategory.INDIVIDUAL]?.[
              AppointmentType.FOLLOW_UP
            ]
              ?.filter(template => template.key === SessionNotesTemplates.DEFAULT_SOAP)
              .map(template => ({
                ...template,
                isDefault: template.key === SessionNotesTemplates.DEFAULT_SOAP,
              })),
          },
        };
      }
    }
    dispatch(updateNoteTemplateLibrary(noteTemplateLibrary));
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
  setSessionListSelectedDate,
  toggleExtensionDrawer,
  setExtensionDrawerPosition,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
