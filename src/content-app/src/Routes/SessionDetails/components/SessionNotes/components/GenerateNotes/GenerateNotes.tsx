import { Box, Button } from "@mui/material";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { IndividualSession, Session } from "@/domains/session";
import { ModeOfDelivery, SessionCategory } from "@/domains/session/models/session.types";
import { SoulsideMeetingSessionTranscript } from "@/domains/meeting";
import { AutoAwesomeRounded } from "@mui/icons-material";
import { toast } from "react-toastify";
import { loadGenerateSessionNotes } from "@/domains/sessionNotes/state/sessionNotes.thunks";

interface GenerateNotesProps {
  noteTemplate: SessionNotesTemplates | null | undefined;
  session: Session | null;
  regenerate?: boolean;
}

const GenerateNotes = ({ session, noteTemplate, regenerate }: GenerateNotesProps) => {
  if (!session || !noteTemplate) return null;

  const dispatch: AppDispatch = useDispatch();

  const sessionId = session?.id || "";
  const sessionCategory = session?.sessionCategory;
  const modeOfDelivery = session?.modeOfDelivery;

  const sessionTranscriptData = useSelector(
    (state: RootState) => state.meeting.transcript[sessionId]
  );

  const providerSessions = useSelector(
    (state: RootState) => state.meeting.providerSessions[sessionId]?.data
  );

  const getCombinedTranscripts = (): SoulsideMeetingSessionTranscript[] => {
    const combinedTranscripts: SoulsideMeetingSessionTranscript[] = [];
    providerSessions?.forEach((providerSession, index) => {
      if (!providerSession.providerSessionId) return;

      //For in person group sessions, we only want to use the first provider session transcript because the speaker mapping can be different for each provider session
      if (
        sessionCategory === SessionCategory.GROUP &&
        modeOfDelivery === ModeOfDelivery.IN_PERSON &&
        index > 0
      ) {
        return;
      }

      const providerSessionTranscripts =
        sessionTranscriptData[providerSession.providerSessionId]?.data || [];
      combinedTranscripts.push(...providerSessionTranscripts);
    });
    return combinedTranscripts;
  };

  const getTranscriptFormattedText = (
    combinedTranscripts: SoulsideMeetingSessionTranscript[]
  ): string => {
    let transcriptText = "";

    const providerName = `${session?.practitionerFirstName || ""}${
      session?.practitionerLastName ? " " : ""
    }${session?.practitionerLastName || ""}`;
    const patientName = `${(session as IndividualSession)?.patientFirstName || ""}${
      (session as IndividualSession)?.patientLastName ? " " : ""
    }${(session as IndividualSession)?.patientLastName || ""}`;

    combinedTranscripts.forEach(transcript => {
      let participantName = transcript.participantName;
      if (
        ["provider", "patient"].includes(participantName?.toLowerCase()) &&
        sessionCategory === SessionCategory.INDIVIDUAL
      ) {
        if (participantName?.toLowerCase() === "provider" && providerName) {
          participantName = providerName;
        }
        if (participantName?.toLowerCase() === "patient" && patientName) {
          participantName = patientName;
        }
      }
      transcriptText += `${participantName}: ${transcript.transcriptText}\n\n`;
    });

    return transcriptText;
  };
  const generateNotes = async () => {
    const combinedTranscripts = getCombinedTranscripts();
    if (!combinedTranscripts.length) {
      toast.error("No transcripts found");
      return;
    }
    const transcriptText = getTranscriptFormattedText(combinedTranscripts);
    const payload: any = {
      transcript: transcriptText,
      sessionCategory,
    };
    if (sessionCategory === SessionCategory.GROUP) {
      const transcriptCSVRows = combinedTranscripts
        .filter(
          transcript =>
            !["nurse practitioner", "unknown"].includes(transcript.participantName?.toLowerCase())
        )
        .map(transcript => {
          return {
            timestamp: transcript.timestamp,
            peerID: transcript.providerPeerId,
            participantID: transcript.providerParticipantId,
            customParticipantID: transcript.participantId,
            participantName: transcript.participantName,
            transcript: transcript.transcriptText,
          };
        });
      payload.transcriptCSVRows = transcriptCSVRows;
    }
    dispatch(loadGenerateSessionNotes(session, noteTemplate, payload));
  };
  return (
    <Box>
      {!regenerate ? (
        <Button
          variant="contained"
          color="primary"
          onClick={generateNotes}
          startIcon={<AutoAwesomeRounded sx={{ fontSize: "1.2rem" }} />}
        >
          Generate Notes
        </Button>
      ) : (
        <Button
          variant="text"
          startIcon={
            <AutoAwesomeRounded
              sx={{ fontSize: "1.2rem" }}
              color="warning"
            />
          }
          onClick={generateNotes}
          size="small"
        >
          Regenerate Notes
        </Button>
      )}
    </Box>
  );
};

export default GenerateNotes;
