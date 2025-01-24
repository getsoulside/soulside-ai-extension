import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  accordionSummaryClasses,
  ListItemText,
  MenuItem,
  ListItemAvatar,
  Box,
} from "@mui/material";
import {
  ArrowForwardIosSharp,
  PersonOutlineOutlined,
  ApartmentOutlined,
} from "@mui/icons-material";

import useOrgRoleLayout from "./useOrgRoleLayout";

const OrgRoleLayout: React.FC = (): React.ReactNode => {
  const { userProfile, assignedRoles, expanded, handleChange, onSelectRole } = useOrgRoleLayout();
  return (
    <Box
      className="org-role-layout"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4rem",
        padding: "30px",
      }}
    >
      <Paper
        elevation={3}
        square={false}
        className="org-role-container"
        sx={{
          padding: 2,
          width: "clamp(300px, 100%, 800px)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Stack
          gap={1}
          direction={"column"}
          alignItems={"center"}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{ fontWeight: "500" }}
          >
            Hello {userProfile.info.data?.firstName}!
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ fontWeight: "500" }}
          >
            Select your organization
          </Typography>
        </Stack>
        <Stack
          direction={"column"}
          gap={2}
        >
          {assignedRoles?.map(role => {
            return (
              <Accordion
                key={role.organizationId}
                expanded={expanded === role.organizationId}
                onChange={() => handleChange(role.organizationId)}
                disableGutters
                elevation={0}
                square
                sx={theme => ({
                  border: `1px solid ${theme.palette.divider}`,
                  "&:not(:last-child)": {
                    borderBottom: 0,
                  },
                  "&::before": {
                    display: "none",
                  },
                })}
              >
                <AccordionSummary
                  expandIcon={<ArrowForwardIosSharp sx={{ fontSize: "0.9rem" }} />}
                  aria-controls={`org-${role.organizationId}-content`}
                  id={`org-${role.organizationId}-header`}
                  sx={theme => ({
                    backgroundColor: "rgba(0, 0, 0, .03)",
                    flexDirection: "row-reverse",
                    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
                      {
                        transform: "rotate(90deg)",
                      },
                    [`& .${accordionSummaryClasses.content}`]: {
                      marginLeft: theme.spacing(1),
                    },
                    ...theme.applyStyles("dark", {
                      backgroundColor: "rgba(255, 255, 255, .05)",
                    }),
                  })}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                  >
                    <ListItemAvatar
                      sx={{
                        minWidth: 0,
                        marginRight: "12px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ApartmentOutlined sx={{ fontSize: "1.3rem", opacity: 0.7 }} />
                    </ListItemAvatar>
                    <Typography
                      component="span"
                      variant="body1"
                    >
                      {role.organizationName}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails
                  sx={theme => ({
                    padding: theme.spacing(2),
                    borderTop: "1px solid rgba(0, 0, 0, .125)",
                  })}
                >
                  {role.roles.map(role => {
                    return (
                      <MenuItem
                        key={role.id}
                        value={role.id || ""}
                        onClick={() => onSelectRole(role)}
                      >
                        <ListItemAvatar sx={{ minWidth: 0, marginRight: "12px" }}>
                          <PersonOutlineOutlined sx={{ fontSize: "1.1rem" }} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={role.businessFunction}
                          secondary={role.behaviorHealthRole}
                        />
                      </MenuItem>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
};

export default OrgRoleLayout;
