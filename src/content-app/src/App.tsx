import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AppLayout, ErrorLayout, AuthLayout } from "./Layout";
import { Appointments, Login, Profile, ResetPassword, Signup } from "./Routes";
import ShadowRoot from "./ShadowRoot";
import { Drawer, IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import SoulsideLogo from "@/assets/soulside-logo-small.svg";

function App() {
  const [open, setOpen] = useState(false);
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorLayout />,
      children: [
        {
          element: <AppLayout />,
          children: [
            {
              index: true,
              element: (
                <Navigate
                  to="/appointments"
                  replace
                />
              ),
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
  const drawerWidth = 240;
  console.log("open", open);

  return (
    <ShadowRoot>
      <div
        className="soulside-extension-app"
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          width: "100%",
          // height: "100%",
          display: "flex",
          WebkitBoxPack: "end",
          justifyContent: "end",
          WebkitBoxAlign: "center",
          alignItems: "center",
          pointerEvents: "auto",
        }}
      >
        <Paper elevation={3}>
          <IconButton
            onClick={() => setOpen(true)}
            sx={theme => ({
              position: "absolute",
              right: "0px",
              top: "50vh",
              zIndex: 2000000,
              padding: "15px",
              paddingRight: "15px",
              backgroundColor: theme.palette.primary.main,
              borderRadius: "12px",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",
              ["&:hover"]: {
                backgroundColor: theme.palette.primary.dark,
              },
            })}
          >
            <img
              src={SoulsideLogo}
              alt="Soulside"
              style={{ width: "15px" }}
            />
          </IconButton>
        </Paper>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              height: "80vh",
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          <RouterProvider router={router} />
        </Drawer>
      </div>
    </ShadowRoot>
  );
}

export default App;
