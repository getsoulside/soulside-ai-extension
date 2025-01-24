import { createMemoryRouter, Navigate, RouterProvider } from "react-router-dom";
import { ExtensionLayout, AppLayout, ErrorLayout, AuthLayout } from "./Layout";
import { Appointments, Login, Profile, ResetPassword, SessionDetails, Signup } from "./Routes";
import ShadowRoot from "./ShadowRoot";
import { Drawer, IconButton, Paper } from "@mui/material";
import SoulsideLogoSmall from "@/assets/soulside-logo-small.svg?raw";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { toggleExtensionDrawer } from "./domains/userProfile";

function App() {
  return (
    <ShadowRoot>
      <div
        id="soulside-extension-app"
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          width: "100%",
          pointerEvents: "auto",
        }}
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
  if (extensionDrawerOpen) {
    return null;
  }
  return (
    <Paper elevation={3}>
      <IconButton
        onClick={openDrawer}
        sx={theme => ({
          position: "absolute",
          right: "0px",
          top: "10vh",
          zIndex: 2000000,
          padding: "15px",
          backgroundColor: theme.palette.primary.main,
          borderRadius: "12px",
          borderTopRightRadius: "0",
          borderBottomRightRadius: "0",
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
                  // to="/session-details/INDIVIDUAL/VIRTUAL/1742cffe-eb90-4f2b-8dfe-5894deba85a4/b7a44209-fef5-4a7a-becd-867b651f06a5"
                  replace
                />
              ),
            },
            {
              path: "/session-details/:sessionCategory/:modeOfDelivery/:sessionId/:patientId",
              element: <SessionDetails />,
            },
            {
              path: "/appointments",
              element: <Appointments />,
            },
            {
              path: "/profile",
              element: <Profile />,
            },
          ],
        },
        {
          element: <AuthLayout />,
          children: [
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
          ],
        },
      ],
    },
  ]);
  const drawerWidth = 450;
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          width: drawerWidth,
          maxHeight: "80vh",
          minHeight: "600px",
          height: "max-content",
          marginTop: "10vh",
          padding: 0.5,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        },
      }}
      variant="persistent"
      anchor="right"
      open={extensionDrawerOpen}
      PaperProps={{
        square: true,
      }}
    >
      <RouterProvider router={router} />
    </Drawer>
  );
};
