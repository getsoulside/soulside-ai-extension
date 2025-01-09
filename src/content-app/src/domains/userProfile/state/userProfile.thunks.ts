import { AppThunk } from "@/store";
import { getUserInfo, getUserAssignedRoles } from "../services/userProfileApi";
import {
  toggleUserProfileLoading,
  addUserProfileData,
  toggleUserAssignedRolesLoading,
  addUserAssignedRolesData,
} from "./userProfile.slice";
import { selectPractitionerRole } from "../services";

export const loadUserInfo = (): AppThunk => async dispatch => {
  dispatch(toggleUserProfileLoading(true));
  try {
    const userInfoData = await getUserInfo();
    dispatch(addUserProfileData(userInfoData));
  } catch (error: any) {
    console.error(error);
  }
  dispatch(toggleUserProfileLoading(false));
};

export const loadUserAssignedRoles = (): AppThunk => async (dispatch, getState) => {
  dispatch(toggleUserAssignedRolesLoading(true));
  try {
    const state = getState();
    const selectedRole = state.userProfile.selectedRole;
    const userAssignedRoles = await getUserAssignedRoles();
    dispatch(addUserAssignedRolesData(userAssignedRoles));

    // Select the first role if there is only one role
    if (userAssignedRoles.length === 1 && userAssignedRoles[0].roles.length === 1) {
      selectPractitionerRole(userAssignedRoles[0].roles[0]);
    } else if (selectedRole) {
      // If the selected role is not in the user assigned roles, remove the selected role
      const selectedRoleInUserAssignedRoles = userAssignedRoles.some(userAssignedRole =>
        userAssignedRole.roles.some(role => role.id === selectedRole.data?.id)
      );
      if (!selectedRoleInUserAssignedRoles) {
        selectPractitionerRole(null);
      }
    }
  } catch (error: any) {
    console.error(error);
  }
  dispatch(toggleUserAssignedRolesLoading(false));
};
