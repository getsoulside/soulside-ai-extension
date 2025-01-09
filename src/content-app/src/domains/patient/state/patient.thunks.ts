import { AppThunk } from "@/store";
import { getPatientsByOrgId } from "../services";
import { toggleOrgPatientsLoading, addOrgPatientsData } from "./patient.slice";

export const loadOrgPatients = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const organizationId = state.userProfile.selectedRole.data?.organizationId;
  dispatch(toggleOrgPatientsLoading(true));
  try {
    if (!organizationId) {
      return Promise.reject("Organization ID is required");
    }
    const orgPatients = await getPatientsByOrgId(organizationId);
    dispatch(addOrgPatientsData(orgPatients));
  } catch (error: any) {
    console.error(error);
  }
  dispatch(toggleOrgPatientsLoading(false));
};
