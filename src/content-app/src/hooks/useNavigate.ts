import { useNavigate, NavigateFunction } from "react-router-dom";

let navigateFunction: NavigateFunction;

export const useNavigateFunction = (): NavigateFunction => {
  navigateFunction = useNavigate();
  return navigateFunction;
};

export const getNavigateFunction = (): NavigateFunction => navigateFunction;
