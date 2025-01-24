import { Box, Divider, Typography } from "@mui/material";
import { useMemo } from "react";

const Transcript = (props: any) => {
  const providerName = `${props.sessionData?.practitionerFirstName || ""}${
    props.sessionData?.practitionerLastName ? " " : ""
  }${props.sessionData?.practitionerLastName || ""}`;
  const patientName = `${props.sessionData?.patientFirstName || ""}${
    props.sessionData?.patientLastName ? " " : ""
  }${props.sessionData?.patientLastName || ""}`;
  const providerSessionsTranscriptData = props.data || [];
  const transcriptData = useMemo(
    () =>
      providerSessionsTranscriptData.reduce((acc: any, providerSessionsTranscript: any) => {
        const sessionTranscripts = providerSessionsTranscript.transcriptData.map((i: any) => {
          return {
            ...i,
            providerSessionId: providerSessionsTranscript.providerSessionId,
          };
        });
        return acc.concat(sessionTranscripts);
      }, []),
    [providerSessionsTranscriptData]
  );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        maxHeight: "100%",
        overflow: "auto",
        mt: 0.5,
      }}
    >
      {transcriptData.length > 0 &&
        transcriptData.map((transcript: any, index: number) => {
          let memberName = transcript.memberName;
          let transcriptText = transcript.transcriptText;
          if (
            ["provider", "patient"].includes(memberName?.toLowerCase()) &&
            props.sessionCategory === "individual"
          ) {
            if (memberName?.toLowerCase() === "provider" && providerName) {
              memberName = providerName;
            }
            if (memberName?.toLowerCase() === "patient" && patientName) {
              memberName = patientName;
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
                {memberName}
              </Typography>
              <Typography
                variant={"subtitle2"}
                sx={{
                  fontWeight: "regular",
                }}
              >
                {transcriptText}
              </Typography>
              {index !== transcriptData.length - 1 && <Divider />}
            </Box>
          );
        })}
    </Box>
  );
};

export default Transcript;
