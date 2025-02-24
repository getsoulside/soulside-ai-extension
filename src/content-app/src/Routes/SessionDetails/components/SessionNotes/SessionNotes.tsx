import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentType, IndividualSession, Session, SessionCategory } from "@/domains/session";
import { AppDispatch, RootState } from "@/store";
import {
  Box,
  Button,
  Divider,
  ListItemText,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  NotesAddedToEhr,
  SessionNotesTemplates,
} from "@/domains/sessionNotes/models/sessionNotes.types";
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
import GenerateNotes from "./components/GenerateNotes";
import Loader from "@/components/Loader";
import { loadSaveSessionNotes } from "@/domains/sessionNotes/state/sessionNotes.thunks";
import { SessionNotes as SessionNotesType } from "@/domains/sessionNotes/models";
import { getFormattedDateTime } from "@/utils/date";
import { InfoRounded } from "@mui/icons-material";
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
  const [sessionNotesData, setSessionNotesData] = useState<SessionNotesType | null>(
    sessionNotes?.data || null
  );
  useEffect(() => {
    if (sessionNotes?.data) {
      setSessionNotesData(sessionNotes.data);
    }
  }, [sessionNotes?.data]);
  const sessionNotesLoading = sessionNotes?.loading;
  const sessionNotesGenerateNotesLoading = sessionNotes?.generateNotesLoading;
  const noteTemplatesLibrary = useSelector(
    (state: RootState) => state.sessionNotes.noteTemplatesLibrary
  );
  const notesTemplates =
    noteTemplatesLibrary?.[sessionCategory as SessionCategory]?.[
      appointmentType as AppointmentType
    ];
  const [selectedNoteTemplate, setSelectedNoteTemplate] = useState<SessionNotesTemplates | null>(
    notesTemplates?.find(template => template?.isDefault)?.key || notesTemplates?.[0]?.key || null
  );
  const [notesAddedLoading, setNotesAddedLoading] = useState<boolean>(false);
  const notesGenerated = useMemo(() => {
    const jsonSoapNote = sessionNotesData?.jsonSoapNote;
    const notesStatus = {
      [SessionNotesTemplates.INTAKE]: !!jsonSoapNote?.[SessionNotesTemplates.INTAKE]?.intakeHPINote,
      [SessionNotesTemplates.SOAP_PSYCHIATRY]:
        !!jsonSoapNote?.[SessionNotesTemplates.SOAP_PSYCHIATRY],
      [SessionNotesTemplates.FOLLOW_UP_ASSESSMENT]:
        !!jsonSoapNote?.chiefCompliantEnhanced ||
        !!jsonSoapNote?.subjective?.chief_complaint?.result ||
        !!jsonSoapNote?.Subjective?.chief_complaint?.result,
      [SessionNotesTemplates.GROUP]:
        !!jsonSoapNote?.[SessionNotesTemplates.GROUP] &&
        Object.keys(jsonSoapNote?.[SessionNotesTemplates.GROUP] || {}).length > 0,
      [SessionNotesTemplates.GROUP_EXTENDED_NOTES]:
        !!jsonSoapNote?.[SessionNotesTemplates.GROUP_EXTENDED_NOTES],
      [SessionNotesTemplates.BPS]: !!jsonSoapNote?.[SessionNotesTemplates.BPS],
    };
    return notesStatus?.[selectedNoteTemplate as SessionNotesTemplates];
  }, [sessionNotesData, selectedNoteTemplate]);
  const ehrClient = useMemo(() => getEhrClient(), []);
  const showAddNotesButton = useMemo(() => {
    const ehrIntegrated =
      ehrClient &&
      notesTemplates
        ?.find(template => template?.key === selectedNoteTemplate)
        ?.ehrIntegrations.includes(ehrClient.getEhrClientName());
    return ehrIntegrated && notesGenerated;
  }, [ehrClient, selectedNoteTemplate, notesTemplates, notesGenerated]);
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
  const selectedRole = useSelector((state: RootState) => state.userProfile.selectedRole.data);
  const addNotes = async () => {
    if (!ehrClient || !selectedNoteTemplate) return;
    const notesData = sessionNotesData;
    const ehrClientInstance = ehrClient.getInstance();
    setNotesAddedLoading(true);
    try {
      const activeSession = await ehrClientInstance?.getActiveSession();
      if (!activeSession) {
        throw {
          message: "Please open this appointment in your EHR to add notes",
          error_code: "NO_ACTIVE_SESSION_FOUND",
        };
      }
      if (
        activeSession.id !== sessionId &&
        (session.sessionCategory !== SessionCategory.INDIVIDUAL ||
          (session as IndividualSession)?.appointmentType !== AppointmentType.INTAKE)
      ) {
        throw {
          message:
            "Active appointment is not the same as the appointment you are trying to add notes to. Please open this appointment in your EHR to add notes",
          error_code: "ACTIVE_SESSION_NOT_SAME_AS_SESSION_TO_ADD_NOTES_TO",
        };
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to add notes to EHR");
      setNotesAddedLoading(false);
      return;
    }
    try {
      const notesAdded = await ehrClientInstance?.addNotes(
        notesData,
        selectedNoteTemplate,
        providerSessionUniqueSpeakers
      );
      if (notesAdded) {
        toast.success("Notes added to EHR");
        const addedNotesData = {
          ...(notesData || {}),
          jsonSoapNote: {
            ...(notesData?.jsonSoapNote || {}),
            notesAddedToEhr: [
              ...(notesData?.jsonSoapNote?.notesAddedToEhr || []),
              {
                ehrClient: ehrClient.getEhrClientName(),
                addedOn: new Date().toISOString(),
                addedBy: selectedRole || null,
              },
            ],
          },
        };
        dispatch(
          loadSaveSessionNotes(
            sessionId,
            selectedNoteTemplate,
            addedNotesData as SessionNotesType,
            true
          )
        );
      } else {
        toast.error("Failed to add notes to EHR");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to add notes to EHR");
    }
    setNotesAddedLoading(false);
  };
  const notesAdded = useMemo(() => {
    return (
      sessionNotesData?.jsonSoapNote?.notesAddedToEhr &&
      sessionNotesData?.jsonSoapNote?.notesAddedToEhr?.length > 0
    );
  }, [sessionNotesData]);
  const saveNotes = () => {
    if (!selectedNoteTemplate || !sessionNotesData) return;
    dispatch(loadSaveSessionNotes(sessionId, selectedNoteTemplate, sessionNotesData));
  };
  const onChangeSessionNotes = (sessionNotes: SessionNotesType) => {
    setSessionNotesData(sessionNotes);
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
      <Loader
        loading={sessionNotesLoading || sessionNotesGenerateNotesLoading}
        loadingText={sessionNotesGenerateNotesLoading ? "Generating notes..." : undefined}
        progressLoader={sessionNotesGenerateNotesLoading}
      >
        <Stack
          direction="column"
          spacing={1}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            <Typography variant="body1">Note Template:</Typography>
            <Select
              value={selectedNoteTemplate}
              onChange={e => setSelectedNoteTemplate(e.target.value as SessionNotesTemplates)}
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
          {notesGenerated && (
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-end"}
              gap={1}
            >
              <GenerateNotes
                noteTemplate={selectedNoteTemplate}
                session={session}
                regenerate={true}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={saveNotes}
                size="small"
              >
                Save Notes
              </Button>
            </Stack>
          )}
        </Stack>
        <Divider />
        {notesGenerated ? (
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
            {selectedNoteTemplate === SessionNotesTemplates.SOAP_PSYCHIATRY && (
              <SoapNotes
                notesData={sessionNotesData}
                sessionId={sessionId}
                onNotesChange={onChangeSessionNotes}
              />
            )}
            {selectedNoteTemplate === SessionNotesTemplates.FOLLOW_UP_ASSESSMENT && (
              <FollowUpAssessment
                notesData={sessionNotesData}
                sessionId={sessionId}
                onNotesChange={onChangeSessionNotes}
              />
            )}
            {selectedNoteTemplate === SessionNotesTemplates.INTAKE && (
              <IntakeAssessment
                notesData={sessionNotesData}
                sessionId={sessionId}
                onNotesChange={onChangeSessionNotes}
              />
            )}
            {selectedNoteTemplate === SessionNotesTemplates.BPS && (
              <BPSAssessment
                notesData={sessionNotesData}
                sessionId={sessionId}
                onNotesChange={onChangeSessionNotes}
              />
            )}
            {selectedNoteTemplate === SessionNotesTemplates.GROUP && (
              <GroupNotes
                notesData={sessionNotesData}
                sessionId={sessionId}
                onNotesChange={onChangeSessionNotes}
              />
            )}
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              mt: 5,
            }}
          >
            <Typography
              variant={"subtitle2"}
              align="center"
            >
              Notes not generated yet
            </Typography>
            <Typography
              variant={"caption"}
              align="center"
            >
              Notes will be generated automatically in 1-2 minutes after the session ends. You can
              also generate notes manually by clicking on the "Generate Notes" button.
            </Typography>
            <GenerateNotes
              noteTemplate={selectedNoteTemplate}
              session={session}
            />
          </Box>
        )}

        {showAddNotesButton && (
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}
            elevation={2}
          >
            <LoadingButton
              fullWidth
              type="submit"
              color="primary"
              onClick={addNotes}
              loading={notesAddedLoading}
              loadingPosition="end"
              endIcon={<i className="fas fa-sign-in-alt" />}
              variant="contained"
            >
              {notesAddedLoading
                ? "Adding Notes..."
                : notesAdded
                ? "Add Again"
                : "Add Notes to EHR"}
            </LoadingButton>
            {notesAdded && (
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
              >
                <Typography
                  variant="body2"
                  color="success"
                  align="center"
                >
                  Notes added to EHR
                </Typography>
                <Tooltip
                  placement="top"
                  title={
                    <NotesAddedToEhrList
                      notesAddedToEhr={sessionNotesData?.jsonSoapNote?.notesAddedToEhr || []}
                    />
                  }
                >
                  <InfoRounded sx={{ fontSize: "1rem" }} />
                </Tooltip>
              </Stack>
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
      </Loader>
    </Box>
  );
};

export default SessionNotes;

const NotesAddedToEhrList = ({ notesAddedToEhr }: { notesAddedToEhr: NotesAddedToEhr[] }) => {
  return (
    <List dense>
      {[...notesAddedToEhr]
        .sort((a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime())
        .map(note => (
          <ListItem key={note.addedOn}>
            <ListItemText>
              Added by {note.addedBy?.practitionerFirstName || ""}
              {note.addedBy?.practitionerLastName ? " " : ""}
              {note.addedBy?.practitionerLastName || ""} on{" "}
              {getFormattedDateTime(note.addedOn, "MMM DD, YYYY hh:mm A", true)}
            </ListItemText>
          </ListItem>
        ))}
    </List>
  );
};
