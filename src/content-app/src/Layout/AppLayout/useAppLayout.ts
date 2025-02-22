import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCookie } from "@/utils/storage";
import { useNavigateFunction } from "@/hooks/useNavigate";
import { AppDispatch, RootState } from "@/store";
import { initializeUserProfile, loadUserAssignedRoles, loadUserInfo } from "@/domains/userProfile";
import { initializeSession } from "@/domains/session";
import { openActiveSessionNotes } from "@/utils/helpers";

const useAppLayout = () => {
  const navigate = useNavigateFunction();
  const dispatch = useDispatch<AppDispatch>();
  const userProfile = useSelector((state: RootState) => state.userProfile);
  const assignedRolesLoading = userProfile?.assignedRoles?.loading;
  const userProfileLoading = userProfile?.info?.loading;
  const selectedRole = userProfile?.selectedRole;
  useEffect(() => {
    const loadApp = async () => {
      await dispatch(initializeUserProfile());
      await dispatch(initializeSession());
      const authToken = await getCookie("authtoken");
      if (!authToken) {
        navigate("/login", { replace: true });
      } else {
        dispatch(loadUserInfo());
        dispatch(loadUserAssignedRoles());
      }
    };
    loadApp();
  }, [dispatch]);
  useEffect(() => {
    if (userProfile.extensionDrawerOpen) {
      openActiveSessionNotes({ silentEvent: true });
    }
  }, [userProfile.extensionDrawerOpen]);
  return { selectedRole, userProfileLoading, assignedRolesLoading };
};

export default useAppLayout;
