import { Session } from "@/domains/session";
import { RootState } from "@/store";
import { useState } from "react";
import { useSelector } from "react-redux";

const useAppointmentsTable = () => {
  const [editSessionOpen, setEditSessionOpen] = useState<boolean>(false);
  const [editSessionData, setEditSessionData] = useState<Session | null>(null);
  const openEditSession = (session: Session | null) => {
    setEditSessionData(session);
    setEditSessionOpen(true);
  };
  const closeEditSession = () => {
    setEditSessionData(null);
    setEditSessionOpen(false);
  };

  const [sendSmsOpen, setSendSmsOpen] = useState<boolean>(false);
  const [sendSmsData, setSendSmsData] = useState<Session | null>(null);
  const openSendSms = (session: Session | null) => {
    setSendSmsData(session);
    setSendSmsOpen(true);
  };
  const closeSendSms = () => {
    setSendSmsData(null);
    setSendSmsOpen(false);
  };

  const sessionNotesStatus = useSelector((state: RootState) => state.session.sessionNotesStatus);

  return {
    editSessionOpen,
    editSessionData,
    openEditSession,
    closeEditSession,
    sendSmsOpen,
    sendSmsData,
    openSendSms,
    closeSendSms,
    sessionNotesStatus,
  };
};

export default useAppointmentsTable;
