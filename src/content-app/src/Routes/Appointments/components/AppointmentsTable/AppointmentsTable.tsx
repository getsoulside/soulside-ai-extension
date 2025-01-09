import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Room, SmsRounded, Videocam } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Link as NavLink } from "react-router-dom";
import {
  AppointmentType,
  Session,
  SessionCategory,
  SoulsideSession,
  IndividualSession,
  ModeOfDelivery,
  checkTodaySession,
} from "@/domains/session";
import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { getFormattedDateTime } from "@/utils/date";
import { RootState } from "@/store";
import { BusinessFunction } from "@/domains/practitionerRole";
import ScheduleSession from "../ScheduleSession";
import useAppointmentsTable from "./useAppointmentsTable";
import SendMeetingLink from "../SendMeetingLink";

interface AppointmentsTableProps {
  data: Session[];
  loading: boolean;
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  data,
  loading,
}): React.ReactNode => {
  const {
    editSessionOpen,
    editSessionData,
    openEditSession,
    closeEditSession,
    sendSmsOpen,
    sendSmsData,
    openSendSms,
    closeSendSms,
    sessionNotesStatus,
  } = useAppointmentsTable();
  const selectedRole = useSelector((state: RootState) => state.userProfile.selectedRole);
  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "startTime",
      headerName: "Time",
      hideable: false,
      width: 125,
      valueGetter: value => {
        return getFormattedDateTime(value, "h:mm A");
      },
      cellClassName: "bold-cell",
    },
    {
      field: "patientFirstName",
      headerName: "Patient/Group Name",
      width: 200,
      hideable: false,
      sortable: false,
      valueGetter: (value, row) => {
        const sessionCategory = row.sessionCategory;
        if (sessionCategory === SessionCategory.GROUP) {
          return (row as SoulsideSession)?.groupName || "";
        }
        if (sessionCategory === SessionCategory.INDIVIDUAL) {
          return `${(row as IndividualSession)?.patientFirstName || ""}${
            (row as IndividualSession)?.patientLastName ? " " : ""
          }${(row as IndividualSession)?.patientLastName || ""}`;
        }
        return value;
      },
      cellClassName: "bold-cell",
    },
    {
      field: "patientPhoneNumber",
      headerName: "Patient Phone",
      width: 150,
      sortable: false,
      renderCell: ({ value, row }) => {
        const modeOfDelivery = row.modeOfDelivery;
        return (
          <Stack
            direction="column"
            spacing={1}
          >
            <Typography>{value || "-"}</Typography>
            <Stack
              direction="row"
              spacing={1}
            >
              {modeOfDelivery === ModeOfDelivery.VIRTUAL && checkTodaySession(row) && (
                <Tooltip title={"Send Meeting Link by SMS"}>
                  <IconButton
                    sx={{ p: 0 }}
                    onClick={() => openSendSms(row)}
                  >
                    <SmsRounded
                      fontSize="small"
                      sx={theme => ({ color: theme.palette.grey[500], opacity: 0.5 })}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: "durationInMinutes",
      headerName: "Duration",
      width: 120,
      sortable: false,
      renderCell: ({ value, row }) => {
        const ModeIcon = row.modeOfDelivery === ModeOfDelivery.IN_PERSON ? Room : Videocam;
        const sessionDuration = value;
        return (
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, height: "100%", gap: 1 }}>
            {`${sessionDuration} min`}
            <Tooltip
              title={row.modeOfDelivery === ModeOfDelivery.IN_PERSON ? "In-office" : "Telehealth"}
            >
              <ModeIcon
                fontSize="medium"
                sx={theme => ({ color: theme.palette.grey[500], opacity: 0.5 })}
              />
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: "appointmentType",
      headerName: "Type",
      width: 100,
      sortable: false,
      valueGetter: (value, row) => {
        return value === AppointmentType.FOLLOW_UP || row.sessionCategory === "GROUP"
          ? "Follow-up"
          : "Intake";
      },
    },
    {
      field: "appointmentTags",
      headerName: "",
      flex: 1,
      sortable: false,
    },
    {
      field: "practitionerFirstName",
      headerName: "Provider",
      width: 200,
      sortable: false,
      valueGetter: (_, row) => {
        return `${row?.practitionerFirstName || ""}${row?.practitionerLastName ? " " : ""}${
          row?.practitionerLastName || ""
        }`;
      },
    },
    {
      field: "appointmentAction",
      headerName: "",
      width: 150,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => {
        const sessionLink =
          row.sessionCategory === SessionCategory.INDIVIDUAL
            ? `/appointments/${row.id}/${(row as IndividualSession).patientId}`
            : `/appointments/${row.id}/${(row as SoulsideSession)?.groupId}`;
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              height: "100%",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              component={
                selectedRole.data?.businessFunction === BusinessFunction.CLINICAL_CARE
                  ? NavLink
                  : Button
              }
              to={sessionLink}
              sx={theme => ({
                backgroundImage: "none",
                backgroundColor: theme.palette.common.white,
                border: `1px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                // height: "100%",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                },
              })}
              onClick={
                selectedRole.data?.businessFunction === BusinessFunction.CLINICAL_CARE
                  ? () => {}
                  : () => openEditSession && openEditSession(row)
              }
            >
              {selectedRole.data?.businessFunction === BusinessFunction.CLINICAL_CARE
                ? "Start Session"
                : "Edit Session"}
            </Button>
            {row.id && sessionNotesStatus.data[row.id]?.notesExists && (
              <Chip
                label="Notes Ready"
                color="success"
              />
            )}
          </Box>
        );
      },
    },
  ];
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
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        disableColumnMenu
        getRowHeight={params => {
          if (
            (params.model.modeOfDelivery === ModeOfDelivery.VIRTUAL &&
              checkTodaySession(params.model as Session)) ||
            sessionNotesStatus.data[params.model.id]?.notesExists
          ) {
            return 100;
          }
          return 52;
        }}
        hideFooter
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="subtitle2">No appointments found</Typography>
            </Box>
          ),
        }}
      />
      <ScheduleSession
        editSession={true}
        open={editSessionOpen}
        onClose={closeEditSession}
        editData={editSessionData}
      />
      <SendMeetingLink
        open={sendSmsOpen}
        onClose={closeSendSms}
        sendSmsData={sendSmsData}
        phoneNumber={""}
        smsMsg={""}
      />
    </Box>
  );
};

export default AppointmentsTable;
