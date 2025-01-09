import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Box,
  Chip,
  InputAdornment,
  Autocomplete,
  TextField,
  Typography,
} from "@mui/material";

import useScheduleSession from "./useScheduleSession";
import { AppointmentType, ModeOfDelivery, Session, SessionCategory } from "@/domains/session";
import { DateFilter, DropdownFilter, TimeFilter } from "@/components/Filters";
import { Patient } from "@/domains/patient";
import { BusinessFunction, PractitionerRole } from "@/domains/practitionerRole";
import LoadingButton from "@mui/lab/LoadingButton";
import Loader from "@/components/Loader";

export interface ScheduleSessionProps {
  open: boolean;
  onClose: () => void;
  editSession?: boolean;
  editData?: Session | null;
}

const ScheduleSession: React.FC<ScheduleSessionProps> = (props): React.ReactNode => {
  const {
    providersList,
    patientsList,
    groupList,
    sessionCategory,
    setSessionCategory,
    modeOfDelivery,
    setModeOfDelivery,
    appointmentType,
    setAppointmentType,
    selectedPatient,
    setSelectedPatient,
    selectedProvider,
    setSelectedProvider,
    selectedGroup,
    setSelectedGroup,
    durationInMinutes,
    setDurationInMinutes,
    startTime,
    setStartTime,
    startDate,
    setStartDate,
    scheduleSession,
    selectedRole,
    selectedTimezone,
    formCompleted,
    loading,
  } = useScheduleSession(props);
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
    >
      <DialogTitle>{!props.editSession ? "Schedule Appointment" : "Edit Appointment"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        <FormControl
          disabled={props.editSession}
          required
        >
          <FormLabel sx={{ mb: 0.3 }}>Appointment Category</FormLabel>
          <RadioGroup
            aria-labelledby="session-category"
            sx={{ flexDirection: "row", gap: 2 }}
          >
            <FormControlLabel
              value={SessionCategory.INDIVIDUAL}
              control={<Radio />}
              label={"Individual"}
              checked={sessionCategory === SessionCategory.INDIVIDUAL}
              onChange={(_, checked: boolean) =>
                setSessionCategory(checked ? SessionCategory.INDIVIDUAL : SessionCategory.GROUP)
              }
            />
            <FormControlLabel
              value={SessionCategory.GROUP}
              control={<Radio />}
              label="Group"
              checked={sessionCategory === SessionCategory.GROUP}
              onChange={(_, checked: boolean) =>
                setSessionCategory(checked ? SessionCategory.GROUP : SessionCategory.INDIVIDUAL)
              }
            />
          </RadioGroup>
        </FormControl>
        <FormControl required>
          <FormLabel sx={{ mb: 0.3 }}>Mode of Delivery</FormLabel>
          <RadioGroup
            aria-labelledby="session-category"
            sx={{ flexDirection: "row", gap: 2 }}
          >
            <FormControlLabel
              value={ModeOfDelivery.IN_PERSON}
              control={<Radio />}
              label={"In-Office"}
              checked={modeOfDelivery === ModeOfDelivery.IN_PERSON}
              onChange={(_, checked: boolean) =>
                setModeOfDelivery(checked ? ModeOfDelivery.IN_PERSON : ModeOfDelivery.VIRTUAL)
              }
            />
            <FormControlLabel
              value={ModeOfDelivery.VIRTUAL}
              control={<Radio />}
              label="Telehealth"
              checked={modeOfDelivery === ModeOfDelivery.VIRTUAL}
              onChange={(_, checked: boolean) =>
                setModeOfDelivery(checked ? ModeOfDelivery.VIRTUAL : ModeOfDelivery.IN_PERSON)
              }
            />
          </RadioGroup>
        </FormControl>
        {sessionCategory === SessionCategory.INDIVIDUAL && (
          <FormControl required>
            <FormLabel sx={{ mb: 0.3 }}>Appointment Type</FormLabel>
            <RadioGroup
              aria-labelledby="session-category"
              sx={{ flexDirection: "row", gap: 2 }}
            >
              <FormControlLabel
                value={AppointmentType.FOLLOW_UP}
                control={<Radio />}
                label={"Follow-up"}
                checked={appointmentType === AppointmentType.FOLLOW_UP}
                onChange={(_, checked: boolean) =>
                  setAppointmentType(checked ? AppointmentType.FOLLOW_UP : AppointmentType.INTAKE)
                }
              />
              <FormControlLabel
                value={AppointmentType.INTAKE}
                control={<Radio />}
                label="Intake"
                checked={appointmentType === AppointmentType.INTAKE}
                onChange={(_, checked: boolean) =>
                  setAppointmentType(checked ? AppointmentType.INTAKE : AppointmentType.FOLLOW_UP)
                }
              />
            </RadioGroup>
          </FormControl>
        )}
        <Stack
          direction="row"
          alignItems={"center"}
          gap={1}
        >
          {sessionCategory === SessionCategory.INDIVIDUAL ? (
            <FormControl
              sx={{ flex: 1 }}
              disabled={props.editSession}
              required
            >
              <FormLabel>Patient</FormLabel>
              <DropdownFilter
                options={patientsList.data}
                loading={patientsList.loading}
                selectedValue={selectedPatient}
                keyLabel="id"
                valueLabel="firstName"
                searchContexts={["firstName", "lastName", "email"]}
                onSelect={setSelectedPatient}
                limitListLength={20}
                dropdownLabel="Select Patient"
                titleRenderer={(patient: Patient) => {
                  return `${patient?.firstName || ""}${patient?.lastName ? " " : ""}${
                    patient?.lastName || ""
                  }`;
                }}
                optionRenderer={(patient: Patient | null) => {
                  return `${patient?.firstName || ""}${patient?.lastName ? " " : ""}${
                    patient?.lastName || ""
                  }`;
                }}
              />
            </FormControl>
          ) : (
            <FormControl
              sx={{ flex: 1 }}
              disabled={props.editSession}
              required
            >
              <FormLabel>Group</FormLabel>
              <DropdownFilter
                options={groupList.data}
                loading={groupList.loading}
                selectedValue={selectedGroup}
                keyLabel="id"
                valueLabel="groupName"
                searchContexts={["groupName"]}
                onSelect={setSelectedGroup}
                dropdownLabel="Select Group"
                limitListLength={20}
              />
            </FormControl>
          )}
          <FormControl
            sx={{ flex: 1 }}
            variant="outlined"
            required
          >
            <FormLabel>Appointment Duration</FormLabel>
            <Stack
              direction="row"
              alignItems={"center"}
            >
              <Autocomplete
                freeSolo
                options={[15, 20, 30, 45, 60, 75, 90, 120]}
                openOnFocus
                selectOnFocus
                clearOnEscape
                blurOnSelect
                sx={{ flex: 1 }}
                value={durationInMinutes === 0 ? "" : durationInMinutes?.toString() || ""}
                onChange={(_, value) =>
                  setDurationInMinutes(value ? parseInt(value as string, 10) : 0)
                }
                getOptionLabel={option => option.toString()}
                renderInput={params => {
                  return (
                    <TextField
                      {...params}
                      type="number"
                      placeholder="Duration in minutes"
                    />
                  );
                }}
              />
              <InputAdornment position="end">min</InputAdornment>
            </Stack>
          </FormControl>
        </Stack>
        {selectedRole?.data?.businessFunction !== BusinessFunction.CLINICAL_CARE && (
          <FormControl
            sx={{ flex: 1 }}
            disabled={props.editSession}
            required
          >
            <FormLabel>Provider</FormLabel>
            <DropdownFilter
              options={providersList.data}
              loading={providersList.loading}
              selectedValue={selectedProvider}
              keyLabel="id"
              valueLabel="practitionerFirstName"
              searchContexts={[
                "practitionerFirstName",
                "practitionerLastName",
                "practitionerEmail",
              ]}
              onSelect={setSelectedProvider}
              dropdownLabel="Select Provider"
              titleRenderer={(provider: PractitionerRole | null) => {
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
                  </Box>
                );
              }}
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
            />
          </FormControl>
        )}
        <FormControl
          sx={{ flex: 1 }}
          required
        >
          <FormLabel>Appointment Start Time</FormLabel>
          <Stack
            direction={"row"}
            gap={1}
            alignItems={"center"}
          >
            <DateFilter
              selectedDate={startDate}
              onSelectDate={setStartDate}
              placeholder="Select Date"
            />
            <Typography>@</Typography>
            <TimeFilter
              selectedTime={startTime}
              onSelectTime={setStartTime}
              placeholder="HH:MM AM/PM"
            />
            <Typography>{selectedTimezone?.abbr}</Typography>
          </Stack>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          onClick={scheduleSession}
          disabled={!formCompleted}
          loading={loading}
          loadingPosition="center"
          loadingIndicator={
            <Loader
              loading={loading}
              size={"small"}
            />
          }
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleSession;
