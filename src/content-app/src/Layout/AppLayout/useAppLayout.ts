import { useEffect } from "react";
import NoSleep from "nosleep.js";
import { useDispatch, useSelector } from "react-redux";

import { getCookie } from "@/utils/storage";
import { useNavigateFunction } from "@/hooks/useNavigate";
import { AppDispatch, RootState } from "@/store";
import { loadUserAssignedRoles, loadUserInfo } from "@/domains/userProfile";

const noSleep = new NoSleep();

const useAppLayout = () => {
  const navigate = useNavigateFunction();
  const dispatch = useDispatch<AppDispatch>();
  const userProfile = useSelector((state: RootState) => state.userProfile);
  const assignedRolesLoading = userProfile?.assignedRoles?.loading;
  const userProfileLoading = userProfile?.info?.loading;
  const selectedRole = userProfile?.selectedRole;
  useEffect(() => {
    let authToken = getCookie("authtoken");
    if (!authToken) {
      navigate("/login", { replace: true });
    } else {
      dispatch(loadUserInfo());
      dispatch(loadUserAssignedRoles());
    }
  }, [dispatch]);
  useEffect(() => {
    noSleep.enable();
    return () => {
      noSleep.disable();
    };
  }, []);
  return { selectedRole, userProfileLoading, assignedRolesLoading };
};

export default useAppLayout;
