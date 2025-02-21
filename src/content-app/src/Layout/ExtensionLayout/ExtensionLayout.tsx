import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import DrawerToolbar from "../DrawerToolbar/DrawerToolbar";
import SoulsideLogo from "@/assets/soulside-logo.svg?raw";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ExtensionDrawerPosition } from "@/domains/userProfile/models/userProfile.types";

const ExtensionLayout: React.FC = (): React.ReactNode => {
  const extensionDrawerPosition = useSelector(
    (state: RootState) => state.userProfile.extensionDrawerPosition
  );
  const isExtensionDrawerPositionBottom =
    extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_LEFT ||
    extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_RIGHT;
  return (
    <Box
      sx={theme => ({
        flex: 1,
        display: "flex",
        flexDirection: isExtensionDrawerPositionBottom ? "column-reverse" : "column",
        gap: 2,
        maxHeight: "100%",
        overflow: "auto",
        fontFamily: theme.typography.fontFamily,
        p: 1,
      })}
    >
      <DrawerToolbar />
      <Paper
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: isExtensionDrawerPositionBottom ? "column-reverse" : "column",
          backgroundColor: "white",
          justifyContent: "space-between",
          maxHeight: "100%",
          overflow: "auto",
        }}
        elevation={1}
      >
        <Outlet />
        <Box
          sx={theme => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing(2),
            backgroundImage: `radial-gradient(circle farthest-corner at 50% 50%,${theme.palette.primary.light},${theme.palette.primary.main})`,
            [isExtensionDrawerPositionBottom ? "borderTopLeftRadius" : "borderBottomLeftRadius"]:
              "inherit",
            [isExtensionDrawerPositionBottom ? "borderTopRightRadius" : "borderBottomRightRadius"]:
              "inherit",
          })}
        >
          <span dangerouslySetInnerHTML={{ __html: SoulsideLogo }}></span>
        </Box>
      </Paper>
    </Box>
  );
};

export default ExtensionLayout;
