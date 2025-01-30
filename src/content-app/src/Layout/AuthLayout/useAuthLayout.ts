import { useNavigateFunction } from "@/hooks/useNavigate";

const useAuthLayout = () => {
  const navigate = useNavigateFunction();
  return { navigate };
};

export default useAuthLayout;
