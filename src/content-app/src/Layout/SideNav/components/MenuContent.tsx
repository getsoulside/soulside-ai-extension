import React from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import {
  CalendarMonthRounded,
  PeopleRounded,
  GroupsRounded,
  // AssignmentRounded,
  SupervisorAccountRounded,
  // SettingsRounded,
  // InfoRounded,
  // HelpRounded,
} from "@mui/icons-material";
import { Link as NavLink, useLocation } from "react-router-dom";

const mainListItems = [
  { text: "Appointments", icon: <CalendarMonthRounded />, link: "/appointments" },
  { text: "Patients", icon: <PeopleRounded />, link: "/patients" },
  { text: "Groups", icon: <GroupsRounded />, link: "/groups" },
  // { text: "Tasks", icon: <AssignmentRounded />, link: '/tasks' },
  { text: "Users", icon: <SupervisorAccountRounded />, link: "/users" },
];

// const secondaryListItems = [
//   // { text: "Settings", icon: <SettingsRounded />, link: "/settings" },
//   // { text: "About", icon: <InfoRounded />, link: '/about' },
//   // { text: "Feedback", icon: <HelpRounded />, link: '/feedback' },
// ];

const MenuContent: React.FC = (): React.ReactNode => {
  const location = useLocation();
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {mainListItems.map((item, index) => (
          <ListItem
            key={index}
            component={NavLink}
            to={item.link}
            disablePadding
            sx={{ display: "block" }}
            className="side-menu-item"
          >
            <ListItemButton selected={location.pathname.includes(item.link)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {secondaryListItems.map((item, index) => (
          <ListItem
            key={index}
            component={NavLink}
            to={item.link}
            disablePadding
            sx={{ display: "block" }}
            className="side-menu-item"
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
};

export default MenuContent;
