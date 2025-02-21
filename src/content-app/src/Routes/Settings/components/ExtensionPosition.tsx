import {
  NorthEastRounded,
  NorthWestRounded,
  SouthEastRounded,
  SouthWestRounded,
} from "@mui/icons-material";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  IconButton,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";
import { selectExtensionDrawerPosition, ExtensionDrawerPosition } from "@/domains/userProfile";

const ExtensionPosition = () => {
  const changeExtensionPosition = (position: ExtensionDrawerPosition) => {
    selectExtensionDrawerPosition(position);
  };
  return (
    <FormControl>
      <FormLabel
        id="extension-position-label"
        sx={{ mb: 2 }}
      >
        Adjust Extension Position:
      </FormLabel>

      <Paper
        elevation={1}
        sx={{ p: 2 }}
      >
        <Stack
          direction={"column"}
          alignItems={"center"}
          gap={4}
        >
          <Stack
            direction={"row"}
            gap={4}
          >
            <Tooltip title="Top Left">
              <IconButton onClick={() => changeExtensionPosition(ExtensionDrawerPosition.TOP_LEFT)}>
                <NorthWestRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Top Right">
              <IconButton
                onClick={() => changeExtensionPosition(ExtensionDrawerPosition.TOP_RIGHT)}
              >
                <NorthEastRounded />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack
            direction={"row"}
            gap={4}
          >
            <Tooltip title="Bottom Left">
              <IconButton
                onClick={() => changeExtensionPosition(ExtensionDrawerPosition.BOTTOM_LEFT)}
              >
                <SouthWestRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bottom Right">
              <IconButton
                onClick={() => changeExtensionPosition(ExtensionDrawerPosition.BOTTOM_RIGHT)}
              >
                <SouthEastRounded />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        <FormHelperText sx={{ mt: 2, textAlign: "center" }}>
          Adjust the position of the extension by clicking on the buttons above.
        </FormHelperText>
      </Paper>
    </FormControl>
  );
};

export default ExtensionPosition;
