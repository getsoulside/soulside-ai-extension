import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentType, IndividualSession, Session, SessionCategory } from "@/domains/session";
import { loadSessionNotes } from "@/domains/sessionNotes";
import { SessionNotes as SessionNotesType } from "@/domains/sessionNotes";
import { AppDispatch, RootState } from "@/store";
import { Box, Divider, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";
import {
  SoapNotes,
  FollowUpAssessment,
  IntakeAssessment,
  BPSAssessment,
  GroupNotes,
} from "./NoteTemplates";
import { getEhrClient } from "@/utils/helpers";
import { toast } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
import { SoulsideMeetingSessionTranscript } from "@/domains/meeting";
interface SessionNotesProps {
  session: Session | null;
}

const SessionNotes: React.FC<SessionNotesProps> = ({ session }): React.ReactNode => {
  const dispatch: AppDispatch = useDispatch();
  const sessionId = session?.id;
  const sessionCategory = session?.sessionCategory;
  const appointmentType =
    (session as IndividualSession)?.appointmentType || AppointmentType.FOLLOW_UP;
  if (!sessionId) return <></>;
  const sessionNotes = useSelector((state: RootState) => state.sessionNotes.notes[sessionId]);
  const noteTemplatesLibrary = useSelector(
    (state: RootState) => state.sessionNotes.noteTemplatesLibrary
  );
  const notesTemplates =
    noteTemplatesLibrary?.[sessionCategory as SessionCategory]?.[
      appointmentType as AppointmentType
    ];
  const [notesTemplate, setNotesTemplate] = useState<string>(
    notesTemplates?.find(template => template?.isDefault)?.key || notesTemplates?.[0]?.key || ""
  );
  const [notesAdded, setNotesAdded] = useState<boolean>(false);
  const [notesAddedLoading, setNotesAddedLoading] = useState<boolean>(false);
  const ehrClient = useMemo(() => getEhrClient(), []);
  const showAddNotesButton = useMemo(() => {
    const ehrIntegrated =
      ehrClient &&
      notesTemplates
        ?.find(template => template?.key === notesTemplate)
        ?.ehrIntegrations.includes(ehrClient.getEhrClientName());
    const jsonSoapNote = sessionNotes.data?.jsonSoapNote;
    const notesStatus = {
      [SessionNotesTemplates.INTAKE]: !!jsonSoapNote?.[SessionNotesTemplates.INTAKE]?.intakeHPINote,
      [SessionNotesTemplates.DEFAULT_SOAP]: !!sessionNotes.data?.soapNote,
      [SessionNotesTemplates.FOLLOW_UP_ASSESSMENT]:
        !!jsonSoapNote?.chiefCompliantEnhanced ||
        !!jsonSoapNote?.subjective?.chief_complaint?.result ||
        !!jsonSoapNote?.Subjective?.chief_complaint?.result,
      [SessionNotesTemplates.GROUP]: !!jsonSoapNote?.[SessionNotesTemplates.GROUP],
      [SessionNotesTemplates.GROUP_EXTENDED_NOTES]:
        !!jsonSoapNote?.[SessionNotesTemplates.GROUP_EXTENDED_NOTES],
      [SessionNotesTemplates.BPS]: !!jsonSoapNote?.[SessionNotesTemplates.BPS],
    };
    const notesGenerated = notesStatus?.[notesTemplate as SessionNotesTemplates];
    return ehrIntegrated && notesGenerated;
  }, [ehrClient, notesTemplate, notesTemplates, sessionNotes.data]);
  useEffect(() => {
    dispatch(loadSessionNotes(sessionId));
  }, [sessionId]);
  const firstProviderSessionData = useSelector(
    (state: RootState) => state.meeting.providerSessions[sessionId]?.data?.[0]
  );
  const providerSessionId = firstProviderSessionData?.providerSessionId || "";
  const providerSessionTranscriptData = useSelector(
    (state: RootState) => state.meeting.transcript[sessionId]?.[providerSessionId]?.data
  );
  const providerSessionUniqueSpeakers = useMemo(() => {
    if (!providerSessionTranscriptData || !Array.isArray(providerSessionTranscriptData)) {
      return {};
    }
    return providerSessionTranscriptData.reduce<Record<string, SoulsideMeetingSessionTranscript>>(
      (acc, transcript) => {
        return { ...acc, [transcript.providerParticipantId]: transcript };
      },
      {}
    );
  }, [providerSessionTranscriptData]);
  const addNotes = async (
    notesData: SessionNotesType | null,
    notesTemplate: SessionNotesTemplates
  ) => {
    if (!ehrClient) return;
    const ehrClientInstance = ehrClient.getInstance();
    setNotesAddedLoading(true);
    try {
      const notesAdded = await ehrClientInstance?.addNotes(
        notesData,
        notesTemplate,
        providerSessionUniqueSpeakers
      );
      if (notesAdded) {
        toast.success("Notes added to EHR");
        setNotesAdded(true);
      } else {
        toast.error("Failed to add notes to EHR");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to add notes to EHR");
    }
    setNotesAddedLoading(false);
  };
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
          {notesTemplates?.map(template => (
            <MenuItem
              key={template.key}
              value={template.key}
            >
              {template.name}
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
          <SoapNotes
            notesData={sessionNotes.data}
            sessionId={sessionId}
          />
        )}
        {notesTemplate === SessionNotesTemplates.FOLLOW_UP_ASSESSMENT && (
          <FollowUpAssessment
            notesData={sessionNotes.data}
            sessionId={sessionId}
          />
        )}
        {notesTemplate === SessionNotesTemplates.INTAKE && (
          <IntakeAssessment
            notesData={sessionNotes.data}
            sessionId={sessionId}
          />
        )}
        {notesTemplate === SessionNotesTemplates.BPS && (
          <BPSAssessment
            notesData={sessionNotes.data}
            sessionId={sessionId}
          />
        )}
        {notesTemplate === SessionNotesTemplates.GROUP && (
          <GroupNotes
            notesData={sessionNotes.data}
            sessionId={sessionId}
          />
        )}
      </Box>

      {showAddNotesButton && (
        <Paper
          sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}
          elevation={2}
        >
          <LoadingButton
            fullWidth
            type="submit"
            color="primary"
            onClick={() => addNotes(sessionNotes.data, notesTemplate as SessionNotesTemplates)}
            loading={notesAddedLoading}
            loadingPosition="end"
            endIcon={<i className="fas fa-sign-in-alt" />}
            variant="contained"
          >
            {notesAddedLoading ? "Adding Notes..." : notesAdded ? "Add Again" : "Add Notes to EHR"}
          </LoadingButton>
          {notesAdded && (
            <Typography
              variant="body2"
              color="success"
              align="center"
            >
              Notes added to EHR
            </Typography>
          )}
          {!notesAdded && (
            <Typography
              variant="body2"
              color="info"
              align="center"
            >
              *This might override your existing notes in EHR.
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default SessionNotes;
