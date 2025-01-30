import Loader from "@/components/Loader";
import {
  ProviderSessionTranscripts,
  SoulsideMeetingSession,
  SoulsideMeetingSessionTranscript,
} from "@/domains/meeting";
import { IndividualSession, Session, SessionCategory } from "@/domains/session";
import { getFormattedDateTime } from "@/utils/date";
import { Box, Divider, Stack, Typography } from "@mui/material";

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
  if (!providerSessionsData || providerSessionsData.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          maxHeight: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant={"subtitle2"}>No transcript available</Typography>
      </Box>
    );
  }
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
        const providerSessionId = providerSession.id || "";
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
                        <Typography
                          variant={"subtitle2"}
                          sx={{
                            fontWeight: "bold",
                            color: "primary.main",
                          }}
                        >
                          {participantName}
                        </Typography>
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
          </Box>
        );
      })}
    </Box>
  );
};

export default SessionTranscript;
