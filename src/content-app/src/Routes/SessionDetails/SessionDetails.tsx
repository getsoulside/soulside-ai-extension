import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IndividualSession, ModeOfDelivery, SessionCategory } from "@/domains/session";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { loadSessionDetails, loadSessionTranscript } from "@/domains/sessionNotes";
import { Box, Link, Stack, Typography, Tabs, Tab, Avatar } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Link as NavLink } from "react-router-dom";
import Loader from "@/components/Loader";
import { getFormattedDateTime } from "@/utils/date";
import Transcript from "./components/Transcript";
import SoapNotesTemplate from "./components/SoapNotesTemplate";

const defaultData = {
  sessionDetails: {
    data: null,
    loading: false,
  },
  memberNotes: {
    data: {},
    loading: false,
    updateLoading: false,
  },
  soapNotes: {
    [SessionNotesTemplates.DEFAULT_SOAP]: "",
    notesId: "",
    loading: false,
    soapNotesJson: null,
  },
  narrative: {
    data: "",
    loading: false,
  },
  bhPredictions: {
    data: null,
    notesId: "",
    loading: false,
  },
  sessionTranscript: {
    data: [],
    loading: false,
  },
  treatmentPlan: {
    data: null,
    loading: false,
  },
  speakerProfileEnrollment: {
    loading: false,
    data: [],
  },
  speakerRecognition: {
    loading: false,
    data: {},
  },
  saveSpeakerMappingLoading: false,
  sessionDetailsData: {},
};

const SessionDetails: React.FC = (): React.ReactNode => {
  const dispatch: AppDispatch = useDispatch();
  const { sessionId } = useParams<{ sessionId: string }>();
  // const { patientId } = useParams<{ patientId: string }>();
  const { sessionCategory } = useParams<{ sessionCategory: SessionCategory }>();
  // const { modeOfDelivery } = useParams<{ modeOfDelivery: ModeOfDelivery }>();
  const sessionNotes = useSelector((state: RootState) => state.sessionNotes);
  if (!sessionId) return <></>;
  const {
    soapNotes = defaultData.soapNotes,
    sessionTranscript = defaultData.sessionTranscript,
    sessionDetails = defaultData.sessionDetails,
  } = sessionNotes.sessionDetailsData?.[sessionId || ""] || {};
  console.log(sessionNotes.sessionDetailsData?.[sessionId || ""]);
  const getData = async () => {
    dispatch(loadSessionDetails(sessionId, sessionCategory as SessionCategory));
    const triggerTime = new Date();
    dispatch(loadSessionTranscript(sessionId, sessionCategory as SessionCategory, triggerTime));
    // props.getSessionMemberNotes({ sessionId, patientId, groupId: patientId });
  };
  useEffect(() => {
    getData();
  }, [sessionId]);
  const [activeTab, setActiveTab] = useState("notes");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const patientName = sessionDetails.data
    ? `${(sessionDetails.data as IndividualSession).patientFirstName} ${
        (sessionDetails.data as IndividualSession).patientLastName
      }`
    : "";
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
      <Loader loading={sessionTranscript.loading || sessionDetails.loading}>
        <Link
          component={NavLink}
          to={`/appointments`}
          sx={{ fontSize: "0.85rem", fontWeight: "regular" }}
        >
          Back to Appointments
        </Link>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{
            mt: 2,
          }}
        >
          <Stack
            direction={"row"}
            gap={1}
            alignItems={"center"}
          >
            <Avatar
              alt={patientName}
              src={patientName}
              sx={{ width: 30, height: 30 }}
            />
            <Typography variant={"subtitle2"}>{patientName}</Typography>
          </Stack>

          <Typography variant={"subtitle2"}>
            {getFormattedDateTime(sessionDetails?.data?.startTime || null, "MMM DD, h:mm A")}
          </Typography>
        </Stack>
        <Box sx={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", mt: 2 }}>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleTabChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Notes"
                  value="notes"
                />
                <Tab
                  label="Transcript"
                  value="transcript"
                />
              </TabList>
            </Box>
            <TabPanel
              value="notes"
              sx={{ p: 1 }}
            >
              <SoapNotesTemplate
                data={soapNotes.soapNotesJson}
                sessionData={sessionDetails.data}
              />
            </TabPanel>
            <TabPanel
              value="transcript"
              sx={{ p: 1 }}
            >
              <Transcript
                {...sessionTranscript}
                sessionId={sessionId}
                sessionCategory={sessionCategory}
                sessionData={sessionDetails.data}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Loader>
    </Box>
  );
};

export default SessionDetails;
