import { RootState } from "@/store";
import { useSelector } from "react-redux";

const useProfile = () => {
  const userProfile = useSelector((state: RootState) => state.userProfile);
  const userProfileInfo = userProfile.info;
  const assignedRoles = userProfile.assignedRoles;
  const selectedRole = userProfile.selectedRole;
  return { userProfileInfo, assignedRoles, selectedRole };
};

export default useProfile;
