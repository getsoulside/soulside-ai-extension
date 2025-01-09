import React from "react";
import SendText, { SendTextProps } from "@/components/SendText/SendText";
import { IndividualSession, Session } from "@/domains/session";
import { getFormattedDateTime } from "@/utils/date";
import { APP_ENV } from "@/constants";

interface SendMeetingLinkProps extends SendTextProps {
  open: boolean;
  onClose: () => void;
  sendSmsData: Session | null;
}

const SendMeetingLink: React.FC<SendMeetingLinkProps> = ({
  open,
  onClose,
  sendSmsData,
}): React.ReactNode => {
  const phoneNumber = (sendSmsData as IndividualSession)?.patientPhoneNumber || "";
  const providerName = `${sendSmsData?.practitionerFirstName || ""}${
    sendSmsData?.practitionerLastName ? " " : ""
  }${sendSmsData?.practitionerLastName || ""}`;
  const patientName = (sendSmsData as IndividualSession)?.patientFirstName || "";
  let orgName = sendSmsData?.organizationName || "";
  if (orgName.includes("Serenity")) {
    orgName = "Serenity Health Clinic";
  }
  const sessionDate = getFormattedDateTime(sendSmsData?.startTime || "", "Do MMMM");
  const sessionTime = getFormattedDateTime(sendSmsData?.startTime || "", "h:mm A", true);
  const meetingLink = `https://app${
    APP_ENV === "DEV" ? ".dev" : ""
  }.soulsidehealth.com/virtual-session/${(sendSmsData as IndividualSession)?.patientId}`;
  const smsMsg = `From: ${orgName} (Dr. ${providerName})\n\nHi ${patientName},\n\nYour appointment ${
    orgName ? `at ${orgName} ` : ""
  }with Dr. ${providerName} is scheduled for ${sessionDate} at ${sessionTime}.\n\nYou can join your appointment with the following link:\n${meetingLink}`;
  return (
    <SendText
      open={open}
      onClose={onClose}
      phoneNumber={phoneNumber}
      smsMsg={smsMsg}
      phoneNumberLabel="Patient Phone Number"
      title="Send session link to patient"
    />
  );
};

export default SendMeetingLink;
