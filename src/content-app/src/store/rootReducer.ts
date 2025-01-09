import { combineReducers, Action } from "@reduxjs/toolkit";
import { UserProfileState } from "@/domains/userProfile/state/userProfile.slice";
import userProfileReducer from "@/domains/userProfile/state/userProfile.slice";
import patientReducer from "@/domains/patient/state/patient.slice";
import groupReducer from "@/domains/group/state/group.slice";
import practitionerRoleReducer from "@/domains/practitionerRole/state/practitionerRole.slice";
import sessionReducer from "@/domains/session/state/session.slice";

const appReducer = combineReducers({
  userProfile: userProfileReducer,
  patient: patientReducer,
  group: groupReducer,
  practitionerRole: practitionerRoleReducer,
  session: sessionReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: Action) => {
  if (action.type === "LOGOUT") {
    state = undefined;
  }
  if (action.type === "SELECT_PRACTITIONER_ROLE") {
    const { userProfile = {} as UserProfileState } = state || {}; // Preserve userProfile state
    state = {
      userProfile,
      patient: patientReducer(undefined, action),
      group: groupReducer(undefined, action),
      practitionerRole: practitionerRoleReducer(undefined, action),
      session: sessionReducer(undefined, action),
    }; // Reset other parts of the state
  }
  return appReducer(state, action);
};

export default rootReducer;
