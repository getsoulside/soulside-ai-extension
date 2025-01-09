import React from "react";
import { Outlet } from "react-router-dom";

import Loader from "@/components/Loader";

import SideNav from "../SideNav";
import TopNav from "../TopNav";
import OrgRoleLayout from "../OrgRoleLayout";

import useAppLayout from "./useAppLayout";

import "./AppLayout.scss";

const AppLayout: React.FC = (): React.ReactNode => {
  const { selectedRole, userProfileLoading, assignedRolesLoading } = useAppLayout();
  return (
    <Loader loading={userProfileLoading || assignedRolesLoading || selectedRole.loading}>
      {selectedRole.data ? (
        <div className="app-layout">
          <SideNav />
          <div className="app-content-container">
            <TopNav />
            <div className="app-outlet-container">
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <OrgRoleLayout />
      )}
    </Loader>
  );
};

export default AppLayout;
