import { useEffect, useMemo, useState } from "react";
import { SessionNotes } from "@/domains/sessionNotes";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { copyToClipboard } from "@/utils/helpers";
import SpeakerMapping from "../../../SpeakerMapping/SpeakerMapping";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SoulsideMeetingSessionTranscript } from "@/domains/meeting";

interface GroupNotesProps {
  sessionId: UUIDString;
  notesData: SessionNotes | null;
}

const GroupNotes = ({ notesData, sessionId }: GroupNotesProps) => {
  const groupNotes = notesData?.jsonSoapNote?.[SessionNotesTemplates.GROUP];
  const [textCopiedSection, setTextCopiedSection] = useState("");
  const [speakerMappingOpen, setSpeakerMappingOpen] = useState(false);
  const providerSessionData = useSelector(
    (state: RootState) => state.meeting.providerSessions[sessionId]?.data?.[0]
  );
  const providerSessionId = providerSessionData?.providerSessionId || "";
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
  const getPatientName = (patientId: string) => {
    return providerSessionUniqueSpeakers[patientId]?.participantName || patientId;
  };
  const [activePatient, setActivePatient] = useState(groupNotes ? Object.keys(groupNotes)[0] : "");
  useEffect(() => {
    if (groupNotes) {
      setActivePatient(Object.keys(groupNotes)[0]);
    }
  }, [Object.keys(groupNotes || {}).length]);
  const groupNotesPatients = Object.keys(groupNotes || {});
  if (!groupNotes || Object.keys(groupNotes).length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
          mt: 5,
        }}
      >
        <Typography variant={"subtitle2"}>Notes not generated yet</Typography>
      </Box>
    );
  }
  let copyTimer: any = null;
  const copyText = (key: string, text: string) => {
    copyToClipboard(text);
    setTextCopiedSection(key);
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      setTextCopiedSection("");
    }, 3000);
  };
  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <Typography variant={"subtitle2"}>Patient Progress Notes</Typography>
        <Button
          component={Typography}
          color="primary"
          size="small"
          onClick={() => setSpeakerMappingOpen(true)}
        >
          Change Speaker Mapping
        </Button>
        <SpeakerMapping
          open={speakerMappingOpen}
          onClose={() => setSpeakerMappingOpen(false)}
          sessionId={sessionId}
        />
      </Stack>
      <Stack
        direction="column"
        spacing={1}
        justifyContent="center"
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <Typography variant="body1">Patient:</Typography>
          {activePatient && (
            <Button
              variant="text"
              color="primary"
              onClick={() =>
                copyText(
                  activePatient,
                  groupNotes?.[activePatient as keyof typeof groupNotes] as string | ""
                )
              }
              size="small"
              startIcon={<ContentCopy />}
            >
              {textCopiedSection === activePatient ? "Copied" : "Copy"}
            </Button>
          )}
        </Stack>
        <Select
          value={activePatient}
          onChange={e => setActivePatient(e.target.value)}
          sx={{
            flex: 1,
          }}
        >
          {groupNotesPatients.map(patient => (
            <MenuItem
              key={patient}
              value={patient}
            >
              {getPatientName(patient)}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      {activePatient && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormControl
            fullWidth
            required
          >
            <TextareaAutosize
              value={groupNotes?.[activePatient as keyof typeof groupNotes] as string | ""}
              readOnly={true}
              minRows={3}
              maxRows={15}
            />
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default GroupNotes;
