import React from "react";

import Search from "@/components/Search";
import { DateFilter, DropdownMultiFilter } from "@/components/Filters";

import useAppointments from "./useAppointments";

import AppointmentsList from "./components/AppointmentsList/AppointmentsList";
import { SyncRounded } from "@mui/icons-material";
import { Box, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import { BusinessFunction, PractitionerRole } from "@/domains/practitionerRole";
import { selectSessionListDate } from "@/domains/userProfile";

const Appointments: React.FC = (): React.ReactNode => {
  const {
    sessionsList,
    sessionsListLoading,
    setSearchTerm,
    selectedDate,
    getSessionsList,
    selectedProviders,
    setSelectedProviders,
    providersList,
    selectedRole,
  } = useAppointments();
  return (
    <Box
      className="appointments-page"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        gap: 2,
      }}
    >
      <Box
        className="appointments-filters-container"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          className="appointments-filters"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Search
            onSearch={setSearchTerm}
            placeholder="Search by patient name"
          />
          <DateFilter
            selectedDate={selectedDate}
            onSelectDate={selectSessionListDate}
          />
        </Box>
        <Box
          className="appointments-filters"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title="Refresh Appointments">
            <IconButton
              onClick={getSessionsList}
              className="refresh-button"
            >
              <SyncRounded />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {selectedRole.data?.businessFunction !== BusinessFunction.CLINICAL_CARE && (
        <Box
          className="appointments-filters-container"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            className="appointments-filters"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DropdownMultiFilter
              options={providersList.data}
              loading={providersList.loading}
              keyLabel="id"
              valueLabel="practitionerFirstName"
              searchContexts={[
                "practitionerFirstName",
                "practitionerLastName",
                "practitionerEmail",
              ]}
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
          </Box>
        </Box>
      )}
      <Box
        className="appointments-table"
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          maxHeight: "100%",
          overflow: "auto",
        }}
      >
        <AppointmentsList
          data={sessionsList}
          loading={sessionsListLoading}
        />
      </Box>
    </Box>
  );
};

export default Appointments;
