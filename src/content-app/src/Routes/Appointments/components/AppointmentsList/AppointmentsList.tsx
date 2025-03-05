import React, { useState } from "react";
import { ArrowBackIosRounded, ArrowForwardIos, Room, Videocam } from "@mui/icons-material";
import {
  Session,
  SessionCategory,
  SoulsideSession,
  IndividualSession,
  ModeOfDelivery,
  AppointmentType,
} from "@/domains/session";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  List,
  ListItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link as NavLink } from "react-router-dom";
import { getFormattedDateTime } from "@/utils/date";
import useAppointmentsList from "./useAppointmentsList";
import Loader from "@/components/Loader";
import { PLATFORM_URL } from "@/constants/envVariables";
import { BusinessFunction, PractitionerRole } from "@/domains/practitionerRole";

export interface AppointmentsListProps {
  data: Session[];
  loading: boolean;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ data, loading }): React.ReactNode => {
  const { sessionsList, pagination, setPagination, sessionNotesStatus, selectedRole } =
    useAppointmentsList({
      data,
      loading,
    });
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        overflow: "auto",
      }}
    >
      <Loader loading={loading}>
        {data.length > 0 ? (
          <>
            <List
              sx={{
                width: "100%",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxHeight: "100%",
                overflow: "auto",
              }}
            >
              {sessionsList.map(appointment => {
                return (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    selectedRole={selectedRole}
                    notesExists={
                      appointment.id
                        ? sessionNotesStatus?.data?.[appointment.id]?.notesExists || false
                        : false
                    }
                  />
                );
              })}
            </List>
            <AppointmentListPagination
              pagination={pagination}
              setPagination={setPagination}
              data={data}
            />
          </>
        ) : (
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="subtitle2">No Appointments Found</Typography>
          </Box>
        )}
      </Loader>
    </Box>
  );
};
export default AppointmentsList;

interface AppointmentListPaginationProps {
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  data: Session[];
}

const AppointmentListPagination: React.FC<AppointmentListPaginationProps> = ({
  pagination,
  setPagination,
  data,
}): React.ReactNode => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1,
        paddingTop: 1,
      }}
    >
      <Typography variant="caption">
        {`${Math.min((pagination.page - 1) * pagination.pageSize + 1, data.length)} - ${Math.min(
          pagination.page * pagination.pageSize,
          data.length
        )} of ${data.length}`}
      </Typography>
      <Tooltip
        title="Previous"
        placement="top"
      >
        <Box>
          <IconButton
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
          >
            <ArrowBackIosRounded sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>
      </Tooltip>
      <Tooltip
        title="Next"
        placement="top"
      >
        <Box>
          <IconButton
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page * pagination.pageSize >= data.length}
          >
            <ArrowForwardIos sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>
      </Tooltip>
    </Box>
  );
};

interface AppointmentCardProps {
  appointment: Session;
  notesExists: boolean;
  selectedRole: PractitionerRole | null;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  notesExists,
  selectedRole,
}): React.ReactNode => {
  const [showSessionActiveWarning, setShowSessionActiveWarning] = useState(false);
  const patientName =
    appointment.sessionCategory === SessionCategory.INDIVIDUAL
      ? `${(appointment as IndividualSession)?.patientFirstName || ""}${
          (appointment as IndividualSession)?.patientLastName ? " " : ""
        }${(appointment as IndividualSession)?.patientLastName || ""}`
      : "";
  const groupName =
    appointment.sessionCategory === SessionCategory.GROUP
      ? (appointment as SoulsideSession)?.groupName?.includes("Default Group")
        ? (appointment as SoulsideSession)?.sessionName || ""
        : (appointment as SoulsideSession)?.groupName || ""
      : "";
  const ModeIcon = appointment.modeOfDelivery === ModeOfDelivery.IN_PERSON ? Room : Videocam;
  const soulsidePlatformStartSessionUrl = `${PLATFORM_URL}/session/${
    appointment.sessionCategory === SessionCategory.INDIVIDUAL ? "individual" : "group"
  }/${appointment.modeOfDelivery === ModeOfDelivery.IN_PERSON ? "in-person" : "virtual"}/${
    appointment.id
  }/${
    appointment.sessionCategory === SessionCategory.INDIVIDUAL
      ? (appointment as IndividualSession)?.patientId
      : (appointment as SoulsideSession)?.groupId
  }?source=soulside-ai-extension`;
  const isAdmin = selectedRole?.businessFunction !== BusinessFunction.CLINICAL_CARE;
  const startSession = (forceStart: boolean = false) => {
    if (chrome?.runtime?.id) {
      chrome.runtime.sendMessage(
        {
          action: "startSoulsideSession",
          startSessionOptions: {
            sessionUrl: soulsidePlatformStartSessionUrl,
            forceStart,
          },
        },
        response => {
          if (response?.success) {
            setShowSessionActiveWarning(false);
          } else {
            if (response?.value?.errorCode === "SESSION_ALREADY_ACTIVE") {
              setShowSessionActiveWarning(true);
            }
          }
        }
      );
    } else {
      const requestId = Date.now() + Math.random(); // Generate a unique requestId

      // Create a message listener
      function handleMessage(event: MessageEvent): void {
        const data = event.data;
        // Ensure the message contains the requestId
        if (data.type === "SOULSIDE_START_SESSION_RESULT" && data.requestId === requestId) {
          window.removeEventListener("message", handleMessage); // Clean up the listener
          if (data.success) {
            setShowSessionActiveWarning(false);
          } else {
            if (data?.value?.errorCode === "SESSION_ALREADY_ACTIVE") {
              setShowSessionActiveWarning(true);
            }
          }
        }
      }

      // Listen for the response
      window.addEventListener("message", handleMessage);
      window.postMessage(
        {
          type: "SOULSIDE_START_SESSION",
          startSessionOptions: {
            sessionUrl: soulsidePlatformStartSessionUrl,
            forceStart,
          },
          requestId,
        },
        "*"
      );
    }
  };
  return (
    <ListItem sx={{ padding: 0 }}>
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          width: "100%",
          position: "relative",
          padding: 2,
        }}
      >
        <Stack gap={1}>
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Typography variant="body2">
              {appointment.sessionCategory === SessionCategory.INDIVIDUAL ? patientName : groupName}
            </Typography>
          </Box>
          <Stack
            flexDirection={"row"}
            gap={1}
            alignItems={"center"}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                gap: 0.5,
              }}
            >
              <Tooltip
                title={
                  appointment.modeOfDelivery === ModeOfDelivery.IN_PERSON
                    ? "In-office"
                    : "Telehealth"
                }
              >
                <ModeIcon
                  fontSize="medium"
                  sx={theme => ({ color: theme.palette.grey[500], opacity: 0.5 })}
                />
              </Tooltip>
              <Typography variant="body2">{`${appointment.durationInMinutes} min`}</Typography>
            </Box>
            {appointment.sessionCategory === SessionCategory.INDIVIDUAL && (
              <Chip
                label={
                  (appointment as IndividualSession).appointmentType === AppointmentType.INTAKE
                    ? "Intake"
                    : "Follow-up"
                }
                size="small"
              />
            )}
            {appointment.sessionCategory === SessionCategory.GROUP && (
              <Chip
                label={"Group"}
                size="small"
              />
            )}
          </Stack>
          {!!isAdmin && (
            <Stack
              flexDirection={"row"}
              gap={1}
              alignItems={"center"}
            >
              <Typography variant="body2">Provider:</Typography>
              <Typography variant="body2">
                {appointment?.practitionerFirstName} {appointment?.practitionerLastName}
              </Typography>
            </Stack>
          )}
          <Stack
            flexDirection={"row"}
            gap={1}
            alignItems={"center"}
          >
            {!window?.location?.hostname?.includes("advancedmd.com") && (
              <Link
                component={NavLink}
                to={`/session-details/${appointment.sessionCategory}/${appointment.modeOfDelivery}/${appointment.id}`}
              >
                <Typography variant="body2">View Notes</Typography>
              </Link>
            )}
            {notesExists && (
              <Chip
                label="Notes Ready"
                size="small"
                color="success"
              />
            )}
          </Stack>
        </Stack>
        <Stack
          alignItems={"flex-end"}
          justifyContent={"space-between"}
          gap={1}
        >
          <Typography variant="body2">
            {getFormattedDateTime(appointment.startTime, "h:mm A")}
          </Typography>
          {!window?.location?.hostname?.includes("advancedmd.com") ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => startSession(false)}
              disableElevation
            >
              Start Session
            </Button>
          ) : (
            <Link
              component={NavLink}
              to={`/session-details/${appointment.sessionCategory}/${appointment.modeOfDelivery}/${appointment.id}`}
            >
              <Typography variant="body2">View Notes</Typography>
            </Link>
          )}
        </Stack>
      </Paper>
      <SessionActiveWarning
        showSessionActiveWarning={showSessionActiveWarning}
        setShowSessionActiveWarning={setShowSessionActiveWarning}
        startSession={startSession}
      />
    </ListItem>
  );
};

interface SessionActiveWarningProps {
  showSessionActiveWarning: boolean;
  setShowSessionActiveWarning: (showSessionActiveWarning: boolean) => void;
  startSession: (forceStart: boolean) => void;
}

const SessionActiveWarning: React.FC<SessionActiveWarningProps> = ({
  showSessionActiveWarning,
  setShowSessionActiveWarning,
  startSession,
}): React.ReactNode => {
  return (
    <Dialog
      open={showSessionActiveWarning}
      onClose={() => setShowSessionActiveWarning(false)}
    >
      <DialogTitle>Session is already active</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          A session is already active. Please end the current session and start a new one.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowSessionActiveWarning(false)}>Cancel</Button>
        <Button
          onClick={() => startSession(true)}
          variant="contained"
        >
          Go to Active Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};
