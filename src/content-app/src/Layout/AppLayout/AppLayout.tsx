import React from "react";
import { Outlet } from "react-router-dom";

import Loader from "@/components/Loader";

import OrgRoleLayout from "../OrgRoleLayout";

import useAppLayout from "./useAppLayout";

import { Box } from "@mui/material";

const AppLayout: React.FC = (): React.ReactNode => {
  const { selectedRole, userProfileLoading, assignedRolesLoading } = useAppLayout();
  return (
    <Loader loading={userProfileLoading || assignedRolesLoading || selectedRole.loading}>
      {selectedRole.data ? (
        <Box
          className="app-layout"
          sx={{
            display: "flex",
            flex: 1,
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              maxHeight: "100%",
              overflow: "auto",
              padding: "15px",
              borderRadius: 1,
              backgroundColor: "#fff",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      ) : (
        <OrgRoleLayout />
      )}
    </Loader>
  );
};

export default AppLayout;
