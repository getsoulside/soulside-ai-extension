import { setCurrentPageTitle } from "@/domains/userProfile";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const useProfile = () => {
  useEffect(() => {
    setCurrentPageTitle("Profile");
  }, []);
  const userProfile = useSelector((state: RootState) => state.userProfile);
  const userProfileInfo = userProfile.info;
  const userAssignedRoles = userProfile.assignedRoles;
  const selectedRole = userProfile.selectedRole;
  return { userProfileInfo, userAssignedRoles, selectedRole };
};

export default useProfile;
