import React from "react";

import Search from "@/components/Search";
import { DateFilter, DropdownMultiFilter } from "@/components/Filters";

import ScheduleSession from "./components/ScheduleSession";
import useAppointments from "./useAppointments";

import "./Appointments.scss";
import AppointmentsTable from "./components/AppointmentsTable/AppointmentsTable";
import { SyncRounded } from "@mui/icons-material";
import { Box, Button, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import { PractitionerRole } from "@/domains/practitionerRole";

const Appointments: React.FC = (): React.ReactNode => {
  const {
    sessionsList,
    sessionsListLoading,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    getSessionsList,
    selectedProviders,
    setSelectedProviders,
    providersList,
    scheduleSessionOpen,
    setScheduleSessionOpen,
  } = useAppointments();
  return (
    <div className="appointments-page">
      <div className="appointments-filters-container">
        <div className="appointments-filters">
          <Search
            onSearch={setSearchTerm}
            placeholder="Search by patient name"
          />
          <DateFilter
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <DropdownMultiFilter
            options={providersList.data}
            loading={providersList.loading}
            keyLabel="id"
            valueLabel="practitionerFirstName"
            searchContexts={["practitionerFirstName", "practitionerLastName", "practitionerEmail"]}
            selectedValues={selectedProviders}
            onSelect={setSelectedProviders}
            dropdownLabel="Select Providers"
            optionRenderer={(provider: PractitionerRole | null) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <Stack
                    direction="row"
                    gap={1}
                  >
                    {`${provider?.practitionerFirstName || ""}${
                      provider?.practitionerLastName ? " " : ""
                    }${provider?.practitionerLastName || ""}`}
                    <Chip
                      label={provider?.practitionerEmail || ""}
                      sx={{ borderRadius: 0.5, fontWeight: 600 }}
                    />
                  </Stack>
                  <Chip
                    label={provider?.behaviorHealthRole || ""}
                    sx={{ borderRadius: 0.5, fontWeight: 600 }}
                  />
                </Box>
              );
            }}
            noDataText="No Providers Found"
          />
        </div>
        <div className="appointments-filters">
          <Tooltip title="Refresh Appointments">
            <IconButton
              onClick={getSessionsList}
              className="refresh-button"
            >
              <SyncRounded />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setScheduleSessionOpen(true)}
          >
            Schedule Appointment
          </Button>
          <ScheduleSession
            open={scheduleSessionOpen}
            onClose={() => setScheduleSessionOpen(false)}
          />
        </div>
      </div>
      <div className="appointments-table">
        <AppointmentsTable
          data={sessionsList}
          loading={sessionsListLoading}
        />
      </div>
    </div>
  );
};

export default Appointments;
