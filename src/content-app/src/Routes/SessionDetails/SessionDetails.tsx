import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IndividualSession,
  ModeOfDelivery,
  SessionCategory,
  SoulsideSession,
} from "@/domains/session";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Box, Stack, Typography, Tab, Avatar, IconButton, Tooltip } from "@mui/material";
import { ArrowBackIos, OpenInNew } from "@mui/icons-material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Link as NavLink } from "react-router-dom";
import Loader from "@/components/Loader";
import { getFormattedDateTime } from "@/utils/date";
import { loadProviderSessions, loadTranscript, loadSessionDetails } from "@/domains/meeting";
import { loadSessionNotes } from "@/domains/sessionNotes";
import SessionNotes from "./components/SessionNotes";
import SessionTranscript from "./components/SessionTranscript";
import { PLATFORM_URL } from "@/constants/envVariables";

const SessionDetails: React.FC = (): React.ReactNode => {
  const dispatch: AppDispatch = useDispatch();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { sessionCategory } = useParams<{ sessionCategory: SessionCategory }>();
  const { modeOfDelivery } = useParams<{ modeOfDelivery: string }>();
  if (!sessionId || !sessionCategory) return <></>;
  const sessionDetails = useSelector((state: RootState) => state.meeting.sessionDetails[sessionId]);
  const providerSessions = useSelector(
    (state: RootState) => state.meeting.providerSessions[sessionId]
  );
  const transcriptData = useSelector((state: RootState) => state.meeting.transcript[sessionId]);
  useEffect(() => {
    dispatch(loadSessionDetails(sessionId, sessionCategory as SessionCategory));
    dispatch(loadProviderSessions(sessionId, sessionCategory as SessionCategory));
    dispatch(loadSessionNotes(sessionId));
  }, [sessionId]);
  useEffect(() => {
    if (providerSessions?.data.length > 0) {
      providerSessions?.data.forEach(providerSession => {
        if (
          providerSession.id &&
          !transcriptData?.[providerSession.id]?.loading &&
          (!transcriptData?.[providerSession.id]?.data ||
            transcriptData?.[providerSession.id]?.data?.length === 0)
        ) {
          dispatch(loadTranscript(providerSession));
        }
      });
    }
  }, [providerSessions?.data]);
  const [activeTab, setActiveTab] = useState("notes");

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const patientName = sessionDetails?.data
    ? `${(sessionDetails.data as IndividualSession).patientFirstName} ${
        (sessionDetails.data as IndividualSession).patientLastName
      }`
    : "";
  const groupName = (sessionDetails?.data as SoulsideSession)?.groupName?.includes("Default Group")
    ? (sessionDetails?.data as SoulsideSession)?.sessionName || ""
    : (sessionDetails?.data as SoulsideSession)?.groupName || "";
  const transcriptLoading = Object.keys(transcriptData || {}).reduce((acc, providerSessionId) => {
    return acc && transcriptData[providerSessionId]?.loading;
  }, Object.keys(transcriptData || {}).length > 0);
  const soulsidePlatformUrl = `${PLATFORM_URL}/session-details/${
    sessionCategory === SessionCategory.INDIVIDUAL ? "individual" : "group"
  }/${modeOfDelivery === ModeOfDelivery.IN_PERSON ? "in-person" : "virtual"}/${sessionId}/${
    sessionCategory === SessionCategory.INDIVIDUAL
      ? (sessionDetails?.data as IndividualSession)?.patientId
      : (sessionDetails?.data as SoulsideSession)?.groupId
  }`;
  const ehrSessionNotesLoading = useSelector(
    (state: RootState) => state.sessionNotes.ehrSessionNotesLoading
  );
  const loading =
    sessionDetails?.loading ||
    providerSessions?.loading ||
    transcriptLoading ||
    ehrSessionNotesLoading;
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        overflow: "auto",
      }}
    >
      <Loader loading={loading}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
          >
            <Tooltip title="Back to Appointments">
              <IconButton
                component={NavLink}
                to="/appointments"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowBackIos sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Tooltip>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
              sx={{ mx: 0.5 }}
            >
              <Avatar
                alt={sessionCategory === SessionCategory.INDIVIDUAL ? patientName : groupName}
                src={sessionCategory === SessionCategory.INDIVIDUAL ? patientName : groupName}
                sx={{ width: 30, height: 30 }}
              />
              <Typography variant={"subtitle2"}>
                {sessionCategory === SessionCategory.INDIVIDUAL ? patientName : groupName}
              </Typography>
            </Stack>
            <Tooltip title="Open on Soulside Platform">
              <IconButton
                component="a"
                href={soulsidePlatformUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <OpenInNew sx={{ fontSize: "0.8rem", color: "primary.main" }} />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography variant={"subtitle2"}>
            {getFormattedDateTime(sessionDetails?.data?.startTime || null, "MMM DD, h:mm A")}
          </Typography>
        </Stack>
        <Box
          sx={{
            width: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            mt: 1,
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleTabChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Notes"
                  value="notes"
                  sx={{ fontSize: "0.9rem", py: 0.5 }}
                />
                <Tab
                  label="Transcript"
                  value="transcript"
                  sx={{ fontSize: "0.9rem", py: 0.5 }}
                />
              </TabList>
            </Box>
            <TabPanel
              value="notes"
              sx={{
                p: 0,
                pt: 1,
                maxHeight: "100%",
                overflow: "auto",
              }}
            >
              <SessionNotes session={sessionDetails?.data} />
            </TabPanel>
            <TabPanel
              value="transcript"
              sx={{
                p: 1,
                maxHeight: "100%",
                overflow: "auto",
              }}
            >
              <SessionTranscript
                session={sessionDetails?.data}
                transcriptData={transcriptData}
                providerSessionsData={providerSessions?.data}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Loader>
    </Box>
  );
};

export default SessionDetails;
