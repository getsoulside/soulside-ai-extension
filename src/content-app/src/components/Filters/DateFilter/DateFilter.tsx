import React from "react";
import { Button, alpha } from "@mui/material";
import { AccessTimeRounded, CalendarTodayRounded } from "@mui/icons-material";
import {
  UseDateFieldProps,
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from "@mui/x-date-pickers/models";
import { Moment } from "moment-timezone";

interface DateButtonFieldProps
  extends UseDateFieldProps<Moment, false>,
    BaseSingleInputFieldProps<Moment | null, Moment, FieldSection, false, DateValidationError> {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function DateButtonField(props: DateButtonFieldProps): React.ReactNode {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { "aria-label": ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      size="medium"
      onClick={() => setOpen?.(prev => !prev)}
      startIcon={
        <CalendarTodayRounded
          sx={theme => ({ fontSize: "1.3rem", color: theme.palette.grey[400], height: "1.3rem" })}
        />
      }
      sx={theme => ({
        minWidth: "fit-content",
        fontWeight: 400,
        borderColor: alpha(theme.palette.grey[300], 0.5),
      })}
    >
      {label ? `${label}` : "Pick a date"}
    </Button>
  );
}

interface DateFilterProps {
  selectedDate: Moment | null;
  onSelectDate: (date: Moment | null) => void;
  placeholder?: string;
  dateFormat?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({
  selectedDate,
  onSelectDate,
  placeholder,
  dateFormat = "MMM DD, YYYY",
}): React.ReactNode => {
  const [open, setOpen] = React.useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        value={selectedDate}
        label={selectedDate == null ? placeholder || null : selectedDate.format(dateFormat)}
        onChange={newValue => onSelectDate(newValue)}
        slots={{ field: DateButtonField }}
        slotProps={{
          field: { setOpen } as any,
          nextIconButton: { size: "small" },
          previousIconButton: { size: "small" },
        }}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        views={["day"]}
      />
    </LocalizationProvider>
  );
};

interface TimeButtonFieldProps
  extends UseDateFieldProps<Moment, false>,
    BaseSingleInputFieldProps<Moment | null, Moment, FieldSection, false, DateValidationError> {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function TimeButtonField(props: TimeButtonFieldProps): React.ReactNode {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { "aria-label": ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      size="medium"
      onClick={() => setOpen?.(prev => !prev)}
      startIcon={
        <AccessTimeRounded
          sx={theme => ({ fontSize: "1.3rem", color: theme.palette.grey[400], height: "1.3rem" })}
        />
      }
      sx={theme => ({
        minWidth: "fit-content",
        fontWeight: 400,
        borderColor: alpha(theme.palette.grey[300], 0.5),
      })}
    >
      {label ? `${label}` : "Pick a time"}
    </Button>
  );
}

interface TimeFilterProps {
  selectedTime: Moment | null;
  onSelectTime: (time: Moment | null) => void;
  placeholder?: string;
  timeFormat?: string;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({
  selectedTime,
  onSelectTime,
  placeholder,
  timeFormat = "hh:mm A",
}): React.ReactNode => {
  const [open, setOpen] = React.useState(false);
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TimePicker
        label={selectedTime == null ? placeholder || null : selectedTime.format(timeFormat)}
        value={selectedTime}
        onChange={newValue => onSelectTime(newValue)}
        slots={{ field: TimeButtonField }}
        slotProps={{
          field: { setOpen } as any,
          nextIconButton: { size: "small" },
          previousIconButton: { size: "small" },
        }}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      />
    </LocalizationProvider>
  );
};

export default DateFilter;
