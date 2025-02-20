import { createMemoryRouter, Navigate, RouterProvider } from "react-router-dom";
import { ExtensionLayout, AppLayout, ErrorLayout, AuthLayout } from "./Layout";
import {
  Appointments,
  Login,
  Profile,
  ResetPassword,
  SessionDetails,
  Settings,
  Signup,
} from "./Routes";
import ShadowRoot from "./ShadowRoot";
import { Drawer, IconButton, Paper } from "@mui/material";
import SoulsideLogoSmall from "@/assets/soulside-logo-small.svg?raw";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { toggleExtensionDrawer } from "./domains/userProfile";
import { ExtensionDrawerPosition } from "./domains/userProfile/models/userProfile.types";

function App() {
  return (
    <ShadowRoot>
      <div
        id="soulside-extension-app"
        style={{ pointerEvents: "auto" }}
      >
        <SoulsideExtensionButton />
        <SoulsideExtensionDrawer />
      </div>
    </ShadowRoot>
  );
}

export default App;

const SoulsideExtensionButton = () => {
  const dispatch: AppDispatch = useDispatch();
  const openDrawer = () => {
    dispatch(toggleExtensionDrawer(true));
  };
  const extensionDrawerOpen = useSelector(
    (state: RootState) => state.userProfile.extensionDrawerOpen
  );
  const extensionDrawerPosition = useSelector(
    (state: RootState) => state.userProfile.extensionDrawerPosition
  );
  if (extensionDrawerOpen) {
    return null;
  }
  return (
    <Paper
      elevation={3}
      sx={{ pointerEvents: "auto" }}
    >
      <IconButton
        onClick={openDrawer}
        sx={theme => ({
          position: "absolute",
          [extensionDrawerPosition === ExtensionDrawerPosition.TOP_LEFT ||
          extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_LEFT
            ? "left"
            : "right"]: "0px",
          [extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_LEFT ||
          extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_RIGHT
            ? "bottom"
            : "top"]: "5vh",
          zIndex: 2000000,
          padding: "10px",
          backgroundColor: theme.palette.primary.main,
          borderRadius: "12px",
          [extensionDrawerPosition === ExtensionDrawerPosition.TOP_LEFT ||
          extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_LEFT
            ? "borderTopLeftRadius"
            : "borderTopRightRadius"]: "0",
          [extensionDrawerPosition === ExtensionDrawerPosition.TOP_LEFT ||
          extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_LEFT
            ? "borderBottomLeftRadius"
            : "borderBottomRightRadius"]: "0",
          ["&:hover"]: {
            backgroundColor: theme.palette.primary.dark,
          },
        })}
      >
        <span dangerouslySetInnerHTML={{ __html: SoulsideLogoSmall }}></span>
      </IconButton>
    </Paper>
  );
};

const SoulsideExtensionDrawer = () => {
  const extensionDrawerOpen = useSelector(
    (state: RootState) => state.userProfile.extensionDrawerOpen
  );
  const extensionDrawerPosition = useSelector(
    (state: RootState) => state.userProfile.extensionDrawerPosition
  );
  const router = createMemoryRouter([
    {
      path: "/",
      errorElement: <ErrorLayout />,
      element: <ExtensionLayout />,
      children: [
        {
          element: <AppLayout />,
          children: [
            {
              index: true,
              element: (
                <Navigate
                  to={"/appointments"}
                  // to={"/settings"}
                  // to="/session-details/GROUP/IN_PERSON/6614dcdf-92ed-4de3-b78b-6838781ded1e"
                  replace
                />
              ),
            },
            {
              path: "/appointments",
              element: <Appointments />,
            },
            {
              path: "/session-details/:sessionCategory/:modeOfDelivery/:sessionId",
              element: <SessionDetails />,
            },
            {
              path: "/profile",
              element: <Profile />,
            },
            {
              path: "/settings",
              element: <Settings />,
            },
          ],
        },
        {
          element: <AuthLayout />,
          children: [
            {
              index: true,
              element: (
                <Navigate
                  to={"/login"}
                  replace
                />
              ),
            },
            {
              path: "/login",
              element: <Login />,
            },
            {
              path: "/reset-password",
              element: <ResetPassword />,
            },
            {
              path: "/practitioner/accept-invite-and-signup",
              element: <Signup />,
            },
            {
              path: "/auth/settings",
              element: <Settings />,
            },
          ],
        },
      ],
    },
  ]);
  const drawerWidth = 450;
  return (
    <Drawer
      sx={theme => ({
        width: drawerWidth,
        flexShrink: 0,
        pointerEvents: "auto",
        "& .MuiDrawer-paper": {
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          width: drawerWidth,
          maxHeight: "90vh",
          minHeight: "600px",
          height: "max-content",
          padding: 0.5,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          [extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_LEFT ||
          extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_RIGHT
            ? "bottom"
            : "top"]: `calc(5vh - ${theme.spacing(1)})`,
          [extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_LEFT ||
          extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_RIGHT
            ? "top"
            : "bottom"]: "unset",
        },
      })}
      variant="persistent"
      anchor={
        extensionDrawerPosition === ExtensionDrawerPosition.TOP_LEFT ||
        extensionDrawerPosition === ExtensionDrawerPosition.BOTTOM_LEFT
          ? "left"
          : "right"
      }
      open={extensionDrawerOpen}
      PaperProps={{
        square: true,
      }}
    >
      <RouterProvider router={router} />
    </Drawer>
  );
};
