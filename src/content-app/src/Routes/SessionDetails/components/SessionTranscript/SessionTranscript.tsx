import Loader from "@/components/Loader";
import {
  ProviderSessionTranscripts,
  SoulsideMeetingSession,
  SoulsideMeetingSessionTranscript,
} from "@/domains/meeting";
import { IndividualSession, ModeOfDelivery, Session, SessionCategory } from "@/domains/session";
import { getFormattedDateTime } from "@/utils/date";
import { EditRounded } from "@mui/icons-material";
import { Box, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import SpeakerMapping from "../SpeakerMapping/SpeakerMapping";
import { useState } from "react";

interface SessionTranscriptProps {
  session: Session | null;
  transcriptData: ProviderSessionTranscripts | null;
  providerSessionsData: SoulsideMeetingSession[] | null;
}

const SessionTranscript = ({
  session,
  providerSessionsData,
  transcriptData,
}: SessionTranscriptProps) => {
  const providerName = `${session?.practitionerFirstName || ""}${
    session?.practitionerLastName ? " " : ""
  }${session?.practitionerLastName || ""}`;
  const patientName = `${(session as IndividualSession)?.patientFirstName || ""}${
    (session as IndividualSession)?.patientLastName ? " " : ""
  }${(session as IndividualSession)?.patientLastName || ""}`;
  const organizationName = session?.organizationName;
  const isSerenityOrg = organizationName?.toLowerCase()?.includes("serenity");
  const modeOfDelivery = session?.modeOfDelivery;
  const hideSpeakerMapping = !isSerenityOrg && modeOfDelivery === ModeOfDelivery.VIRTUAL;
  const [speakerMappingOpen, setSpeakerMappingOpen] = useState(false);
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
      {providerSessionsData?.map(providerSession => {
        if (!providerSession) return null;
        const providerSessionId = providerSession.providerSessionId || "";
        const providerSessionStartTime = getFormattedDateTime(
          providerSession.startedAt,
          "MMM DD, YYYY | h:mm a"
        );
        return (
          <Box
            key={providerSessionId}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Divider sx={{ flex: 1 }} />
              <Typography variant="caption">{providerSessionStartTime}</Typography>
              <Divider sx={{ flex: 1 }} />
            </Stack>
            <Loader loading={!!transcriptData?.[providerSessionId].loading}>
              {transcriptData?.[providerSessionId]?.data &&
              transcriptData?.[providerSessionId]?.data?.length > 0 ? (
                transcriptData?.[providerSessionId]?.data?.map(
                  (transcript: SoulsideMeetingSessionTranscript, index: number) => {
                    let participantName = transcript.participantName;
                    let transcriptText = transcript.transcriptText;
                    if (
                      ["provider", "patient"].includes(participantName?.toLowerCase()) &&
                      session?.sessionCategory === SessionCategory.INDIVIDUAL
                    ) {
                      if (participantName?.toLowerCase() === "provider" && providerName) {
                        participantName = providerName;
                      }
                      if (participantName?.toLowerCase() === "patient" && patientName) {
                        participantName = patientName;
                      }
                    }
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <Typography
                            variant={"subtitle2"}
                            sx={{
                              fontWeight: "bold",
                              color: "primary.main",
                            }}
                          >
                            {participantName}
                          </Typography>
                          {!hideSpeakerMapping && (
                            <Tooltip title="Change Speaker Mapping">
                              <IconButton onClick={() => setSpeakerMappingOpen(true)}>
                                <EditRounded sx={{ fontSize: "1rem", opacity: 0.7 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                        <Typography
                          variant={"subtitle2"}
                          sx={{
                            fontWeight: "regular",
                          }}
                        >
                          {transcriptText}
                        </Typography>
                        {index !== transcriptData?.[providerSessionId]?.data?.length - 1 && (
                          <Divider />
                        )}
                      </Box>
                    );
                  }
                )
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant={"subtitle2"}>No transcript available</Typography>
                </Box>
              )}
            </Loader>
            <SpeakerMapping
              open={speakerMappingOpen}
              onClose={() => setSpeakerMappingOpen(false)}
              sessionId={session?.id || ""}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default SessionTranscript;
