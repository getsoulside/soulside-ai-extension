import { AppThunk } from "@/store";
import { getPractitionerRolesByOrgId } from "../services";
import {
  toggleOrgPractitionersRolesLoading,
  addOrgPractitionersRolesData,
} from "./practitionerRole.slice";

export const loadOrgPractitionerRoles = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const organizationId = state.userProfile.selectedRole.data?.organizationId;
  dispatch(toggleOrgPractitionersRolesLoading(true));
  try {
    if (!organizationId) {
      return Promise.reject("Organization ID is required");
    }
    const orgPractitionerRoles = await getPractitionerRolesByOrgId(organizationId);
    dispatch(addOrgPractitionersRolesData(orgPractitionerRoles));
  } catch (error: any) {
    console.error(error);
  }
  dispatch(toggleOrgPractitionersRolesLoading(false));
};
