import React from "react";
import {
  ArrowBackIosRounded,
  ArrowForwardIos,
  OpenInNew,
  Room,
  Videocam,
} from "@mui/icons-material";
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
  Chip,
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

export interface AppointmentsListProps {
  data: Session[];
  loading: boolean;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ data, loading }): React.ReactNode => {
  const { sessionsList, pagination, setPagination, sessionNotesStatus } = useAppointmentsList({
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
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  notesExists,
}): React.ReactNode => {
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
  const soulsidePlatformSessionDetailsUrl = `${PLATFORM_URL}/session-details/${
    appointment.sessionCategory === SessionCategory.INDIVIDUAL ? "individual" : "group"
  }/${appointment.modeOfDelivery === ModeOfDelivery.IN_PERSON ? "in-person" : "virtual"}/${
    appointment.id
  }/${
    appointment.sessionCategory === SessionCategory.INDIVIDUAL
      ? (appointment as IndividualSession)?.patientId
      : (appointment as SoulsideSession)?.groupId
  }`;
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
            <Typography
              variant="body2"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {appointment.sessionCategory === SessionCategory.INDIVIDUAL ? patientName : groupName}
              <Tooltip title="Open on Soulside Platform">
                <IconButton
                  component="a"
                  href={soulsidePlatformSessionDetailsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ ml: 0.5, p: 0 }}
                >
                  <OpenInNew sx={{ fontSize: "0.8rem", color: "primary.main" }} />
                </IconButton>
              </Tooltip>
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
          {notesExists && (
            <Chip
              label="Notes Ready"
              size="small"
              color="success"
            />
          )}
        </Stack>
        <Stack
          alignItems={"flex-end"}
          justifyContent={"space-between"}
          gap={1}
        >
          <Typography variant="body2">
            {getFormattedDateTime(appointment.startTime, "h:mm A")}
          </Typography>
          <Link
            component={NavLink}
            to={`/session-details/${appointment.sessionCategory}/${appointment.modeOfDelivery}/${appointment.id}`}
          >
            <Typography variant="body2">View Notes</Typography>
          </Link>
        </Stack>
      </Paper>
    </ListItem>
  );
};
