import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Menu,
  Avatar,
  Divider,
  listItemIconClasses,
  ListItemText,
  ListItemIcon,
  listClasses,
  paperClasses,
  dividerClasses,
  Tooltip,
  Select,
  Stack,
  Chip,
  Box,
  Typography,
  menuClasses,
} from "@mui/material";
import { LogoutRounded, NotificationsRounded, AccessTimeRounded } from "@mui/icons-material";
import { Link as NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { timezones } from "@/utils/storage";
import { formatTimeOffset } from "@/utils/date";
import { logout } from "@/services/auth";
import { selectTimezone } from "@/domains/userProfile";

import "./TopNav.scss";

const TopNav: React.FC = (): React.ReactNode => {
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setProfileAnchorEl(null);
  };

  const userProfile = useSelector((state: RootState) => state.userProfile);
  const userName = `${userProfile?.info?.data?.firstName || ""}${
    userProfile?.info?.data?.lastName ? " " : ""
  }${userProfile?.info?.data?.lastName || ""}`;
  const selectedTimezone = userProfile.selectedTimezone;

  return (
    <AppBar
      position="static"
      variant="elevation"
      color="transparent"
    >
      <Toolbar sx={{ justifyContent: "flex-end", gap: 1 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          {userProfile.currentPageTitle || ""}
        </Typography>
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
        <Tooltip title="Notifications">
          <IconButton
            size="large"
            aria-label="notifications"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
          >
            <NotificationsRounded
              sx={theme => ({
                color: theme.palette.grey[500],
              })}
            />
          </IconButton>
        </Tooltip>
        <IconButton
          size="large"
          aria-label={userName}
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <Avatar
            sizes="small"
            alt={userName}
            src={userName}
            sx={{ width: 36, height: 36 }}
          />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={profileAnchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(profileAnchorEl)}
          onClose={handleClose}
          sx={{
            mt: 4,
            [`& .${listClasses.root}`]: {
              padding: "4px",
              minWidth: 160,
            },
            [`& .${paperClasses.root}`]: {
              padding: 0,
            },
            [`& .${dividerClasses.root}`]: {
              margin: "4px -4px",
            },
          }}
        >
          <MenuItem
            component={NavLink}
            to="/profile"
            onClick={handleClose}
          >
            Profile
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={logout}
            sx={{
              [`& .${listItemIconClasses.root}`]: {
                ml: "auto",
                minWidth: 0,
              },
            }}
          >
            <ListItemText>Logout</ListItemText>
            <ListItemIcon>
              <LogoutRounded fontSize="small" />
            </ListItemIcon>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
