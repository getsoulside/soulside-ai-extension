import React from "react";
import {
  ListItemAvatar,
  MenuItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Select,
  Divider,
  MenuList,
  Box,
} from "@mui/material";
import { PersonOutlineOutlined, ApartmentOutlined } from "@mui/icons-material";

import { selectPractitionerRole, UserAssignedRole } from "@/domains/userProfile";
import { PractitionerRole } from "@/domains/practitionerRole";

interface RoleSelectProps {
  assignedRoles: UserAssignedRole[];
  selectedRole: PractitionerRole | null;
}

const RoleSelect: React.FC<RoleSelectProps> = ({
  assignedRoles,
  selectedRole,
}): React.ReactNode => {
  const onSelectRole = (role: PractitionerRole) => {
    selectPractitionerRole(role);
  };
  return (
    <Select
      labelId="practitioner-role-select"
      id="practitioner-role-simple-select"
      displayEmpty
      inputProps={{ "aria-label": "Select role" }}
      renderValue={() => {
        if (!selectedRole) {
          return "Select Org/Role";
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, marginRight: "8px" }}>
              <PersonOutlineOutlined sx={{ fontSize: "1rem" }} />
            </ListItemIcon>
            <ListItemText
              primary={selectedRole?.organizationName}
              secondary={selectedRole?.behaviorHealthRole}
            />
          </Box>
        );
      }}
      autoWidth
      sx={{
        maxHeight: 56,
        width: "100%",
      }}
    >
      <MenuList sx={{ outline: "none", width: "100%" }}>
        <MenuItem
          value=""
          disabled
        >
          Select Org/Role
        </MenuItem>
        {assignedRoles.map((assignedRole, index) => {
          return (
            <React.Fragment key={assignedRole.organizationId}>
              <ListSubheader
                sx={{ display: "flex", alignItems: "center", backgroundColor: "white" }}
              >
                <ListItemAvatar
                  sx={{ minWidth: 0, marginRight: "12px", display: "flex", alignItems: "center" }}
                >
                  <ApartmentOutlined sx={{ fontSize: "1.1rem", opacity: 0.7 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={assignedRole.organizationName}
                  disableTypography
                />
              </ListSubheader>
              {assignedRole.roles.map(role => {
                const roleSelected = selectedRole?.id === role.id;
                return (
                  <MenuItem
                    key={role.id}
                    value={role.id || ""}
                    onClick={() => (roleSelected ? {} : onSelectRole(role))}
                    selected={roleSelected}
                  >
                    <ListItemAvatar sx={{ minWidth: 0, marginRight: "12px" }}>
                      <PersonOutlineOutlined sx={{ fontSize: "1.1rem" }} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={role.behaviorHealthRole}
                      secondary={role.businessFunction}
                    />
                  </MenuItem>
                );
              })}
              {index !== assignedRoles.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </MenuList>
    </Select>
  );
};

export default RoleSelect;
