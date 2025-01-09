import { useEffect } from "react";
import { useNavigateFunction } from "@/hooks/useNavigate";
import { getCookie } from "@/utils/storage";

const useAuthLayout = () => {
  const navigate = useNavigateFunction();
  useEffect(() => {
    let authtoken = getCookie("authtoken");
    if (authtoken) {
      navigate("/", { replace: true });
    }
  }, []);
  return {};
};

export default useAuthLayout;
