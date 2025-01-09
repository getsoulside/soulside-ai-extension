import { useRouteError } from "react-router-dom";

const useErrorLayout = () => {
  const error = useRouteError();
  return { error };
};

export default useErrorLayout;
