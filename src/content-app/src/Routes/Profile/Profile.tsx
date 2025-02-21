import React from "react";
import useProfile from "./useProfile";

import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { LogoutRounded } from "@mui/icons-material";
import { logout } from "@/services/auth";
import RoleSelect from "./components/RoleSelect";

const Profile: React.FC = (): React.ReactNode => {
  const { userProfileInfo, assignedRoles, selectedRole } = useProfile();
  const userName = `${userProfileInfo?.data?.firstName || ""}${
    userProfileInfo?.data?.lastName ? " " : ""
  }${userProfileInfo?.data?.lastName || ""}`;
  const theme: Theme = useTheme();
  const styles = {
    card: {
      p: 2,
    },
    avatarText: {
      fontWeight: 500,
    },
    widgetTitle: {
      fontWeight: 500,
    },
    infoLabel: {
      color: theme.palette.text.secondary,
      fontWeight: 500,
    },
    infoValue: {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
  };
  return (
    <Box
      className="profile-page"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        overflow: "auto",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Stack
          gap={2}
          direction={"row"}
          alignItems={"center"}
        >
          <Avatar
            alt={userName}
            src={userName}
            sx={{ width: 50, height: 50 }}
          />
          <Stack
            gap={1}
            direction={"column"}
          >
            <Typography
              variant="h6"
              sx={styles.avatarText}
            >
              {userName}
            </Typography>
            <Stack
              gap={1}
              direction={"row"}
            >
              <Typography
                variant="body1"
                sx={styles.avatarText}
              >
                {selectedRole?.data?.behaviorHealthRole}
              </Typography>
              <Typography
                variant="body1"
                sx={styles.avatarText}
              >
                |
              </Typography>
              <Typography
                variant="body1"
                sx={styles.avatarText}
              >
                {selectedRole?.data?.organizationName}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          alignItems={"stretch"}
          gap={1}
        >
          <RoleSelect
            selectedRole={selectedRole.data}
            assignedRoles={assignedRoles.data || []}
          />
        </Stack>
        <Card sx={styles.card}>
          <Stack
            gap={1.5}
            direction={"column"}
          >
            <Typography
              variant="subtitle2"
              sx={styles.widgetTitle}
            >
              Personal Information
            </Typography>
            <Divider />
            <Stack
              direction={"row"}
              gap={10}
            >
              <Stack>
                <Typography
                  variant="subtitle2"
                  sx={styles.infoLabel}
                >
                  First Name
                </Typography>
                <Typography
                  variant="body1"
                  sx={styles.infoValue}
                >
                  {userProfileInfo?.data?.firstName}
                </Typography>
              </Stack>
              <Stack>
                <Typography
                  variant="subtitle2"
                  sx={styles.infoLabel}
                >
                  Last Name
                </Typography>
                <Typography
                  variant="body1"
                  sx={styles.infoValue}
                >
                  {userProfileInfo?.data?.lastName}
                </Typography>
              </Stack>
            </Stack>
            <Stack
              direction={"row"}
              gap={10}
            >
              <Stack>
                <Typography
                  variant="subtitle2"
                  sx={styles.infoLabel}
                >
                  Email
                </Typography>
                <Typography
                  variant="body1"
                  sx={styles.infoValue}
                >
                  {userProfileInfo?.data?.email || "-"}
                </Typography>
              </Stack>
              <Stack>
                <Typography
                  variant="subtitle2"
                  sx={styles.infoLabel}
                >
                  Phone
                </Typography>
                <Typography
                  variant="body1"
                  sx={styles.infoValue}
                >
                  {userProfileInfo?.data?.phoneNumber || "-"}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Card>
        <Card sx={styles.card}>
          <Stack
            gap={1.5}
            direction={"column"}
          >
            <Typography
              variant="subtitle2"
              sx={styles.widgetTitle}
            >
              Your Clinics
            </Typography>
            <Divider />
            {assignedRoles?.data?.map(role => {
              return (
                <Stack
                  direction={"row"}
                  gap={10}
                  key={role.organizationId}
                >
                  <Stack>
                    <Typography
                      variant="subtitle2"
                      sx={styles.infoLabel}
                    >
                      Clinic Name
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={styles.infoValue}
                    >
                      {role.organizationName}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography
                      variant="subtitle2"
                      sx={styles.infoLabel}
                    >
                      Roles
                    </Typography>
                    <Stack
                      gap={1}
                      direction={"column"}
                    >
                      {role.roles.map((role, index) => (
                        <Typography
                          key={index}
                          variant="body1"
                          sx={styles.infoValue}
                        >
                          {role.behaviorHealthRole}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Card>
        <Button
          variant="contained"
          size="medium"
          endIcon={<LogoutRounded />}
          onClick={logout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
