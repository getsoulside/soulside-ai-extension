import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentType, IndividualSession, Session, SessionCategory } from "@/domains/session";
import { loadSessionNotes } from "@/domains/sessionNotes";
import { SessionNotes as SessionNotesType } from "@/domains/sessionNotes";
import { AppDispatch, RootState } from "@/store";
import { Box, Divider, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";
import { SoapNotes } from "./NoteTemplates";
import FollowUpAssessment from "./NoteTemplates/FollowUpAssessment/FollowUpAssessment";
import IntakeAssessment from "./NoteTemplates/IntakeAssessment/IntakeAssessment";
import BPSAssessment from "./NoteTemplates/BPSAssessment/BPSAssessment";
import { getEhrClient } from "@/utils/helpers";
import { toast } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
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
  const showAddNotesButton = useMemo(
    () =>
      ehrClient &&
      notesTemplates
        ?.find(template => template?.key === notesTemplate)
        ?.ehrIntegrations.includes(ehrClient.getEhrClientName()),
    [ehrClient, notesTemplate, notesTemplates]
  );
  useEffect(() => {
    dispatch(loadSessionNotes(sessionId));
  }, [sessionId]);
  const addNotes = async (
    notesData: SessionNotesType | null,
    notesTemplate: SessionNotesTemplates
  ) => {
    if (!ehrClient) return;
    const ehrClientInstance = ehrClient.getInstance();
    setNotesAddedLoading(true);
    try {
      const notesAdded = await ehrClientInstance?.addNotes(notesData, notesTemplate);
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
          <SoapNotes notesData={sessionNotes.data} />
        )}
        {notesTemplate === SessionNotesTemplates.FOLLOW_UP_ASSESSMENT && (
          <FollowUpAssessment notesData={sessionNotes.data} />
        )}
        {notesTemplate === SessionNotesTemplates.INTAKE && (
          <IntakeAssessment notesData={sessionNotes.data} />
        )}
        {notesTemplate === SessionNotesTemplates.BPS && (
          <BPSAssessment notesData={sessionNotes.data} />
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
