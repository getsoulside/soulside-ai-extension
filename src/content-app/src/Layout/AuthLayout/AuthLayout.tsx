import React from "react";
import { Outlet } from "react-router-dom";

import useAuthLayout from "./useAuthLayout";

import SoulsideLogo from "@/assets/soulside-logo-white.svg";

import AuthLayoutStyles from "./AuthLayoutStyles";

const AuthLayout = (): React.ReactElement => {
  // Run the hook for any required side-effects
  useAuthLayout();
  return (
    <div
      className="auth-layout"
      style={AuthLayoutStyles.authLayout}
    >
      <div
        className="auth-nav-bar"
        style={AuthLayoutStyles.authNavBar}
      >
        <img
          src={SoulsideLogo}
          alt="Soulside Logo"
          className="soulside-logo"
          style={AuthLayoutStyles.soulsideLogo}
        />
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
