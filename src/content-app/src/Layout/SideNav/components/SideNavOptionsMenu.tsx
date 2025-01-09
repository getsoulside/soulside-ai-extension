import React from "react";
import {
  Divider,
  dividerClasses,
  Menu,
  MenuItem,
  paperClasses,
  listClasses,
  ListItemText,
  ListItemIcon,
  listItemIconClasses,
  IconButton,
} from "@mui/material";
import { LogoutRounded, MoreVertRounded } from "@mui/icons-material";
import { Link as NavLink } from "react-router-dom";

import { logout } from "@/services/auth";

const SideNavOptionsMenu: React.FC = (): React.ReactNode => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent", color: "white", opacity: 0.7 }}
      >
        <MoreVertRounded />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
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
          onClick={handleClose}
          component={NavLink}
          to="/profile"
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
    </React.Fragment>
  );
};

export default SideNavOptionsMenu;
