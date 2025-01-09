import { AppThunk } from "@/store";
import { getGroupsByOrgId, getGroupsByPractitionerRoleId } from "../services";
import { toggleGroupsLoading, addGroupsData } from "./group.slice";
import { BusinessFunction } from "@/domains/practitionerRole";

export const loadGroups = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const organizationId = state.userProfile.selectedRole.data?.organizationId;
  const practitionerRoleId = state.userProfile.selectedRole.data?.id;
  const businessFunction = state.userProfile.selectedRole.data?.businessFunction;
  dispatch(toggleGroupsLoading(true));
  if (businessFunction && businessFunction === BusinessFunction.CLINICAL_CARE) {
    try {
      if (!practitionerRoleId) {
        return Promise.reject("Practitioner Role ID is required");
      }
      const groups = await getGroupsByPractitionerRoleId(practitionerRoleId);
      dispatch(addGroupsData(groups));
    } catch (error: any) {
      console.error(error);
    }
  } else {
    try {
      if (!organizationId) {
        return Promise.reject("Organization ID is required");
      }
      const groups = await getGroupsByOrgId(organizationId);
      dispatch(addGroupsData(groups));
    } catch (error: any) {
      console.error(error);
    }
  }
  dispatch(toggleGroupsLoading(false));
};
