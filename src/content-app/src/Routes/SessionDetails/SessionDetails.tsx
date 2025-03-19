import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  checkTodaySession,
  IndividualSession,
  ModeOfDelivery,
  SessionCategory,
  SoulsideSession,
} from "@/domains/session";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Box, Stack, Typography, Avatar, IconButton, Tooltip, Button } from "@mui/material";
import { ArrowBackIos, OpenInNew, SyncRounded } from "@mui/icons-material";
import { Link as NavLink } from "react-router-dom";
import Loader from "@/components/Loader";
import { getFormattedDateTime } from "@/utils/date";
import { loadProviderSessions, loadTranscript, loadSessionDetails } from "@/domains/meeting";
import { loadSessionNotes } from "@/domains/sessionNotes";
import SessionNotes from "./components/SessionNotes";
import SessionTranscript from "./components/SessionTranscript";
import { PLATFORM_URL } from "@/constants/envVariables";
import Tabs from "@/components/Tabs/Tabs";
import { loadOrgPatients } from "@/domains/patient";

const SessionDetails: React.FC = (): React.ReactNode => {
  const dispatch: AppDispatch = useDispatch();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { sessionCategory } = useParams<{ sessionCategory: SessionCategory }>();
  const { modeOfDelivery } = useParams<{ modeOfDelivery: string }>();
  if (!sessionId || !sessionCategory) return <></>;
  const sessionDetails = useSelector((state: RootState) => state.meeting.sessionDetails[sessionId]);
  const patientsList = useSelector((state: RootState) => state.patient.patientsList);
  const providerSessions = useSelector(
    (state: RootState) => state.meeting.providerSessions[sessionId]
  );
  const transcriptData = useSelector((state: RootState) => state.meeting.transcript[sessionId]);
  const isTodaySessionTranscriptLoading = providerSessions?.data.some(
    providerSession =>
      checkTodaySession(providerSession) &&
      transcriptData?.[providerSession.providerSessionId || ""]?.loading
  );
  useEffect(() => {
    loadData();
  }, [sessionId]);
  const loadData = () => {
    dispatch(loadSessionDetails(sessionId, sessionCategory as SessionCategory));
    dispatch(loadProviderSessions(sessionId, sessionCategory as SessionCategory));
    dispatch(loadSessionNotes(sessionId));
    if (
      sessionCategory === SessionCategory.GROUP &&
      patientsList.data.length === 0 &&
      !patientsList.loading
    ) {
      dispatch(loadOrgPatients());
    }
  };
  useEffect(() => {
    if (providerSessions?.data.length > 0 && sessionDetails?.data) {
      providerSessions?.data.forEach(providerSession => {
        if (
          providerSession.id &&
          !transcriptData?.[providerSession.id]?.loading &&
          (!transcriptData?.[providerSession.id]?.data ||
            transcriptData?.[providerSession.id]?.data?.length === 0)
        ) {
          dispatch(loadTranscript(providerSession, sessionDetails?.data));
        }
      });
    }
  }, [providerSessions?.data, sessionDetails?.data]);
  const [activeTab, setActiveTab] = useState("notes");

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
  const soulsidePlatformSessionDetailsUrl = `${PLATFORM_URL}/session-details/${
    sessionCategory === SessionCategory.INDIVIDUAL ? "individual" : "group"
  }/${modeOfDelivery === ModeOfDelivery.IN_PERSON ? "in-person" : "virtual"}/${sessionId}/${
    sessionCategory === SessionCategory.INDIVIDUAL
      ? (sessionDetails?.data as IndividualSession)?.patientId
      : (sessionDetails?.data as SoulsideSession)?.groupId
  }`;
  const soulsidePlatformStartSessionUrl = `${PLATFORM_URL}/session/${
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
  const loadingText = isTodaySessionTranscriptLoading
    ? "Please wait while we fetch the session transcript. It usually takes around 1-2 minutes to generate the transcript after the session ends."
    : undefined;
  const progressLoader = isTodaySessionTranscriptLoading;
  const tabs = [
    {
      label: "Notes",
      key: "notes",
      content: <SessionNotes session={sessionDetails?.data} />,
    },
    {
      label: "Transcript",
      key: "transcript",
      content: (
        <SessionTranscript
          session={sessionDetails?.data}
          transcriptData={transcriptData}
          providerSessionsData={providerSessions?.data}
        />
      ),
    },
  ];
  const refreshNotesButton = (
    <Tooltip title="Refresh">
      <IconButton onClick={loadData}>
        <SyncRounded sx={{ fontSize: "1.3rem", color: "primary.main" }} />
      </IconButton>
    </Tooltip>
  );
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
      <Loader loading={sessionDetails?.loading || providerSessions?.loading}>
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
                href={soulsidePlatformSessionDetailsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <OpenInNew sx={{ fontSize: "0.8rem", color: "primary.main" }} />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography variant={"subtitle2"}>
            {getFormattedDateTime(sessionDetails?.data?.startTime || null, "MMM DD, h:mm A", true)}
          </Typography>
        </Stack>
        <Loader
          loading={loading}
          loadingText={loadingText}
          progressLoader={progressLoader}
        >
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
            {providerSessions?.data.length > 0 ? (
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                rightAction={refreshNotesButton}
              />
            ) : (
              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxHeight: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant={"subtitle2"}>Session not started yet</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  component={"a"}
                  href={soulsidePlatformStartSessionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start Session on Soulside Platform
                </Button>
              </Box>
            )}
          </Box>
        </Loader>
      </Loader>
    </Box>
  );
};

export default SessionDetails;
