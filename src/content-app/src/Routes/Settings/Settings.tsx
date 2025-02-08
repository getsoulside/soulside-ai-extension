import { Box, Stack, Typography } from "@mui/material";
import TimezoneSelect from "./components/TimezoneSelect";
import ExtensionPosition from "./components/ExtensionPosition";

const Settings = () => {
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
      </Stack>
    </Box>
  );
};

export default Settings;
