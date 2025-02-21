import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import useAuthLayout from "./useAuthLayout";

const AuthLayout = (): React.ReactElement => {
  useAuthLayout();
  return (
    <Box
      className="auth-layout"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "30px",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
