import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentType, IndividualSession, Session, SessionCategory } from "@/domains/session";
import { loadSessionNotes } from "@/domains/sessionNotes";
import { AppDispatch, RootState } from "@/store";
import { Box, Divider, MenuItem, Select, Stack, Typography } from "@mui/material";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";
import { SoapNotes } from "./NoteTemplates";
import FollowUpAssessment from "./NoteTemplates/FollowUpAssessment/FollowUpAssessment";
import IntakeAssessment from "./NoteTemplates/IntakeAssessment/IntakeAssessment";

interface SessionNotesProps {
  session: Session | null;
}

const SessionNotes: React.FC<SessionNotesProps> = ({ session }): React.ReactNode => {
  const dispatch: AppDispatch = useDispatch();
  const sessionId = session?.id;
  const sessionCategory = session?.sessionCategory;
  const appointmentType = (session as IndividualSession)?.appointmentType;
  if (!sessionId) return <></>;
  const sessionNotes = useSelector((state: RootState) => state.sessionNotes.notes[sessionId]);
  const [notesTemplate, setNotesTemplate] = useState<string>(
    sessionCategory === SessionCategory.INDIVIDUAL
      ? appointmentType === AppointmentType.INTAKE
        ? SessionNotesTemplates.INTAKE
        : SessionNotesTemplates.FOLLOW_UP_ASSESSMENT
      : SessionNotesTemplates.GROUP
  );
  useEffect(() => {
    dispatch(loadSessionNotes(sessionId));
  }, [sessionId]);
  const notesTemplates =
    sessionCategory === SessionCategory.INDIVIDUAL
      ? [
          { key: SessionNotesTemplates.DEFAULT_SOAP, value: "SOAP" },
          { key: SessionNotesTemplates.FOLLOW_UP_ASSESSMENT, value: "Assessment" },
          { key: SessionNotesTemplates.INTAKE, value: "Intake" },
        ]
      : [{ key: SessionNotesTemplates.GROUP, value: "Group" }];
  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        maxHeight: "100%",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
      >
        <Typography variant="body1">Note Template:</Typography>
        <Select
          value={notesTemplate}
          onChange={e => setNotesTemplate(e.target.value)}
          sx={{
            flex: 1,
          }}
        >
          {notesTemplates.map(template => (
            <MenuItem
              key={template.key}
              value={template.key}
            >
              {template.value}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Divider />
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          maxHeight: "100%",
        }}
      >
        {notesTemplate === SessionNotesTemplates.DEFAULT_SOAP && (
          <SoapNotes notesData={sessionNotes.data} />
        )}
        {notesTemplate === SessionNotesTemplates.FOLLOW_UP_ASSESSMENT && (
          <FollowUpAssessment notesData={sessionNotes.data} />
        )}
        {notesTemplate === SessionNotesTemplates.INTAKE && (
          <IntakeAssessment notesData={sessionNotes.data} />
        )}
      </Box>
    </Box>
  );
};

export default SessionNotes;
