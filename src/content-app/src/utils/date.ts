import moment, { Moment } from "moment-timezone";
import { store } from "@/store";

export const getDateTime = (dateTime?: ISO8601String | Date | Moment | null): Moment => {
  return moment(dateTime);
};

export const getFormattedDateTime = (
  dateTime: ISO8601String | Moment | Date | null,
  dateTimeFormat: string = "h:mm a",
  includeTimeZoneAbbr: boolean = false
): string => {
  const preferredTimezone = store.getState().userProfile.selectedTimezone;
  let formattedDateTime = getDateTime(dateTime).format(dateTimeFormat);
  if (includeTimeZoneAbbr) {
    formattedDateTime += ` ${preferredTimezone.abbr}`;
  }
  return formattedDateTime;
};

export const formatTimeOffset = (offset: number): string => {
  // Determine if the offset is positive or negative
  const sign = offset >= 0 ? "+" : "-";

  // Take the absolute value of the offset
  const absoluteOffset = Math.abs(offset);

  // Extract hours and minutes
  const hours = Math.floor(absoluteOffset);
  const minutes = (absoluteOffset % 1) * 60;

  // Format hours and minutes to two digits
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  // Combine into the final format
  return `${sign}${formattedHours}:${formattedMinutes}`;
};
