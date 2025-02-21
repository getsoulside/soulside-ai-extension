import { Box, Button, Stack, Typography } from "@mui/material";
import TimezoneSelect from "./components/TimezoneSelect";
import ExtensionPosition from "./components/ExtensionPosition";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/storage";
import { LogoutRounded } from "@mui/icons-material";
import { logout } from "@/services/auth";

const Settings = () => {
  const [showLogout, setShowLogout] = useState(false);
  useEffect(() => {
    const checkAuthToken = async () => {
      const authToken = await getCookie("authtoken");
      setShowLogout(!!authToken);
    };
    checkAuthToken();
  }, []);
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        overflow: "auto",
      }}
    >
      <Stack
        direction={"column"}
        gap={2}
      >
        <Typography variant="h6">Settings</Typography>
        <TimezoneSelect />
        <ExtensionPosition />
        {showLogout && (
          <Button
            variant="contained"
            size="medium"
            endIcon={<LogoutRounded />}
            onClick={logout}
          >
            Logout
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Settings;
