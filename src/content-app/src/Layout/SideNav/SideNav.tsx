import React from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
  Drawer,
  drawerClasses,
  Divider,
  Stack,
  Typography,
  Box,
  useTheme,
} from "@mui/material";

import { RootState } from "@/store";
import { MenuContent, RoleSelect, SideNavOptionsMenu } from "./components";

import SoulsideLogo from "@/assets/soulside-logo.svg";

import "./SideNav.scss";

const drawerWidth = 240;

const SideNav: React.FC = (): React.ReactNode => {
  const theme = useTheme();
  const userProfile = useSelector((state: RootState) => state.userProfile);
  const assignedRoles = userProfile?.assignedRoles?.data || [];
  const selectedRole = userProfile?.selectedRole;
  const userName = `${userProfile?.info?.data?.firstName || ""}${
    userProfile?.info?.data?.lastName ? " " : ""
  }${userProfile?.info?.data?.lastName || ""}`;
  const userEmail = userProfile?.info?.data?.email || "";
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        width: drawerWidth,
        flexShrink: 0,
        [`& .${drawerClasses.paper}`]: {
          width: drawerWidth,
          backgroundImage: `radial-gradient(
            circle farthest-corner at 50% 50%,
            ${theme.palette.primary.light},
            ${theme.palette.primary.main}
          )`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "5px",
          p: 1.5,
        }}
      >
        <img
          src={SoulsideLogo}
          alt="Soulside"
          className="side-nav-logo"
          style={{ maxWidth: 130 }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          p: 1.5,
        }}
      >
        <RoleSelect
          assignedRoles={assignedRoles}
          selectedRole={selectedRole.data}
        />
      </Box>
      <Divider />
      <MenuContent />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt={userName}
          src={userName}
          sx={{ width: 36, height: 36 }}
        />
        <Box
          sx={{
            mr: "auto",
            overflow: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            color="white"
          >
            {userName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#fff", opacity: 0.7, textOverflow: "ellipsis", overflow: "hidden" }}
          >
            {userEmail}
          </Typography>
        </Box>
        <SideNavOptionsMenu />
      </Stack>
    </Drawer>
  );
};

export default SideNav;
