import { RootState } from "@/store";
import { Box, Chip, menuClasses, MenuItem, Select, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { selectTimezone } from "@/domains/userProfile";
import { timezones } from "@/utils/storage";
import { AccessTimeRounded } from "@mui/icons-material";
import { formatTimeOffset } from "@/utils/date";

const TimezoneSelect = () => {
  const userProfile = useSelector((state: RootState) => state.userProfile);
  const selectedTimezone = userProfile.selectedTimezone;
  return (
    <Select
      labelId="timezone-select"
      id="timezone-simple-select"
      displayEmpty
      inputProps={{ "aria-label": "Select timezone" }}
      value={selectedTimezone?.name || ""}
      onChange={event => {
        const timeZone = timezones.find(tz => tz.name === event.target.value);
        if (timeZone) {
          selectTimezone(timeZone);
        }
      }}
      renderValue={value => {
        const timeZone = timezones.find(tz => tz.name === value) || null;
        if (!timeZone) {
          return "Select Timezone";
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Stack
              direction="row"
              gap={1}
            >
              {timeZone.name}
              <Chip
                label={timeZone.abbr}
                sx={{ borderRadius: 0.5, fontWeight: 600 }}
              />
            </Stack>
          </Box>
        );
      }}
      autoWidth
      sx={{ mr: 1 }}
      MenuProps={{
        sx: {
          [`.${menuClasses.list}`]: {
            maxHeight: 300,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          },
        },
      }}
    >
      {timezones.map(timezone => {
        return (
          <MenuItem
            key={timezone.name}
            value={timezone.name}
          >
            <Stack
              direction="row"
              gap={1.5}
            >
              <Stack
                direction="row"
                gap={0.7}
              >
                <AccessTimeRounded
                  sx={theme => ({
                    fontSize: "1.3rem",
                    minWidth: "none",
                    color: theme.palette.grey[400],
                  })}
                />
                {timezone.name}
              </Stack>
              <Chip
                label={timezone.abbr}
                sx={{ borderRadius: 0.5, fontWeight: 600 }}
              />
              <Chip
                label={`UTC ${formatTimeOffset(timezone.offset)}`}
                sx={{ borderRadius: 0.5, fontWeight: 600 }}
              />
            </Stack>
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default TimezoneSelect;
