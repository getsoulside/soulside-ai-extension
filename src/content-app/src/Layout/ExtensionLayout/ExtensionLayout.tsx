import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import DrawerToolbar from "../DrawerToolbar/DrawerToolbar";
import SoulsideLogo from "@/assets/soulside-logo.svg?raw";

const ExtensionLayout: React.FC = (): React.ReactNode => {
  return (
    <Box
      sx={theme => ({
        flex: 1,
        display: "flex",
        flexDirection: "column",
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
          flexDirection: "column",
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
            borderBottomLeftRadius: "inherit",
            borderBottomRightRadius: "inherit",
          })}
        >
          <span dangerouslySetInnerHTML={{ __html: SoulsideLogo }}></span>
        </Box>
      </Paper>
    </Box>
  );
};

export default ExtensionLayout;
