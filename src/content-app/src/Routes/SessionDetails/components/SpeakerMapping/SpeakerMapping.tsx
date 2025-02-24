import Loader from "@/components/Loader";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from "@mui/material";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getFormattedDateTime } from "@/utils/date";
import { useEffect, useMemo, useState } from "react";
import { saveProviderSessionTranscript } from "@/domains/meeting/state/meeting.thunks";
import { SessionCategory, SessionPatientMember, SoulsideSession } from "@/domains/session";

interface SpeakerMappingProps {
  open: boolean;
  onClose: () => void;
  sessionId: UUIDString;
}

enum ParticipantType {
  PATIENT = "Patient",
  PROVIDER = "Provider",
  NURSE_PRACTITIONER = "Nurse Practitioner",
  UNKNOWN = "Unknown",
}

type SpeakerMapping = {
  participantType: ParticipantType;
  participantName: string;
  participantId: UUIDString;
};

const SpeakerMapping = ({ open, onClose, sessionId }: SpeakerMappingProps) => {
  const dispatch: AppDispatch = useDispatch();
  const providerSessionsData = useSelector(
    (state: RootState) => state.meeting.providerSessions[sessionId]?.data
  );
  const speakerAudios = useSelector((state: RootState) => state.meeting.speakerAudios[sessionId]);
  const transcriptData = useSelector((state: RootState) => state.meeting.transcript[sessionId]);
  const sessionDetailsData = useSelector(
    (state: RootState) => state.meeting.sessionDetails[sessionId]?.data
  );
  const sessionCategory = sessionDetailsData?.sessionCategory;
  const sessionPatientMembers =
    (sessionDetailsData as SoulsideSession)?.sessionPatientMemberDtos || [];
  const [speakerMapping, setSpeakerMapping] = useState<{
    [providerSessionId: UUIDString]: { [speakerId: string]: SpeakerMapping };
  }>({});
  useEffect(() => {
    if (!open) {
      setSpeakerMapping({});
    }
  }, [open, sessionId]);
  const providerSessionUniqueSpeakers = useMemo(() => {
    let data: { [providerSessionId: UUIDString]: { [speakerId: string]: SpeakerMapping } } = {};
    if (transcriptData) {
      Object.keys(transcriptData).forEach(providerSessionId => {
        const providerSessionTranscriptData = transcriptData[providerSessionId].data;
        const speakerMapping = providerSessionTranscriptData.reduce((acc, transcript) => {
          const participantType =
            transcript.participantId.toLowerCase().includes("provider") ||
            transcript.participantName.toLowerCase().includes("provider")
              ? ParticipantType.PROVIDER
              : transcript.participantId.toLowerCase().includes("nurse practitioner") ||
                transcript.participantName.toLowerCase().includes("nurse practitioner")
              ? ParticipantType.NURSE_PRACTITIONER
              : transcript.participantId.toLowerCase().includes("unknown") ||
                transcript.participantName.toLowerCase().includes("unknown")
              ? ParticipantType.UNKNOWN
              : ParticipantType.PATIENT;
          return {
            ...acc,
            [transcript.providerParticipantId]: {
              participantId:
                participantType === ParticipantType.PATIENT
                  ? transcript.participantId
                  : participantType,
              participantName: transcript.participantName,
              participantType,
            },
          };
        }, {});
        data = {
          ...data,
          [providerSessionId]: speakerMapping,
        };
      });
    }
    return data;
  }, [transcriptData]);
  useEffect(() => {
    if (open) {
      setSpeakerMapping(providerSessionUniqueSpeakers);
    }
  }, [providerSessionUniqueSpeakers, open]);
  const onParticipantTypeChange = (
    providerSessionId: UUIDString,
    speakerId: string,
    participantType: ParticipantType
  ) => {
    const isValueChanged =
      speakerMapping[providerSessionId]?.[speakerId]?.participantType !== participantType;
    if (isValueChanged) {
      setSpeakerMapping(prev => ({
        ...prev,
        [providerSessionId]: {
          ...prev[providerSessionId],
          [speakerId]: {
            participantType,
            participantId:
              participantType === ParticipantType.PATIENT
                ? providerSessionUniqueSpeakers[providerSessionId]?.[speakerId]?.participantType ===
                  ParticipantType.PATIENT
                  ? providerSessionUniqueSpeakers[providerSessionId]?.[speakerId]?.participantId
                  : speakerId
                : participantType,
            participantName:
              participantType === ParticipantType.PATIENT
                ? providerSessionUniqueSpeakers[providerSessionId]?.[speakerId]?.participantType ===
                  ParticipantType.PATIENT
                  ? providerSessionUniqueSpeakers[providerSessionId]?.[speakerId]?.participantName
                  : sessionCategory === SessionCategory.GROUP
                  ? speakerId
                  : ParticipantType.PATIENT
                : participantType,
          },
        },
      }));
    }
  };
  const onPatientSelect = (
    providerSessionId: UUIDString,
    speakerId: string,
    patient: SessionPatientMember | null
  ) => {
    setSpeakerMapping(prev => ({
      ...prev,
      [providerSessionId]: {
        ...prev[providerSessionId],
        [speakerId]: {
          ...prev[providerSessionId]?.[speakerId],
          participantId: patient?.patientId || speakerId,
          participantName:
            `${patient?.patientFirstName || ""}${patient?.patientLastName ? " " : ""}${
              patient?.patientLastName || ""
            }` || speakerId,
        },
      },
    }));
  };
  const saveSpeakerMapping = () => {
    if (providerSessionsData?.length > 0) {
      providerSessionsData.forEach(providerSession => {
        if (!providerSession || !providerSession.providerSessionId) return;
        const providerSessionTranscriptData =
          transcriptData[providerSession.providerSessionId]?.data?.map(transcript => {
            return {
              ...transcript,
              participantId:
                speakerMapping[providerSession.providerSessionId || ""]?.[
                  transcript.providerParticipantId
                ]?.participantId,
              participantName:
                speakerMapping[providerSession.providerSessionId || ""]?.[
                  transcript.providerParticipantId
                ]?.participantName,
            };
          }) || [];
        dispatch(
          saveProviderSessionTranscript(
            sessionDetailsData,
            providerSession,
            providerSessionTranscriptData
          )
        );
      });
    }
  };
  const loading = useMemo(() => {
    return (
      Object.values(speakerAudios || {}).some(speakerAudio => speakerAudio.loading) ||
      Object.values(transcriptData || {}).some(transcript => transcript.loading)
    );
  }, [speakerAudios]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
    >
      <DialogTitle>Speaker Mapping</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Please map the speakers to the participants in the session.
        </Typography>
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxHeight: "100%",
            mt: 2,
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
                <Box sx={{ pt: 1, pb: 1 }}>
                  <Loader loading={!!speakerAudios?.[providerSessionId]?.loading}>
                    {speakerAudios?.[providerSessionId]?.data?.length > 0 ? (
                      speakerAudios?.[providerSessionId]?.data?.map((speakerAudio, index) => {
                        const speakerId = speakerAudio.speakerId || "";
                        const patientName = sessionPatientMembers.find(
                          member =>
                            member.patientId ===
                            speakerMapping[providerSessionId]?.[speakerId]?.participantId
                        )
                          ? `${
                              sessionPatientMembers.find(
                                member =>
                                  member.patientId ===
                                  speakerMapping[providerSessionId]?.[speakerId]?.participantId
                              )?.patientFirstName || ""
                            } ${
                              sessionPatientMembers.find(
                                member =>
                                  member.patientId ===
                                  speakerMapping[providerSessionId]?.[speakerId]?.participantId
                              )?.patientLastName || ""
                            }`
                          : speakerMapping[providerSessionId]?.[speakerId]?.participantName;
                        return (
                          <Box
                            key={speakerId}
                            sx={theme => ({
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              backgroundColor:
                                index % 2 === 0 ? theme.palette.grey[100] : "transparent",
                              p: 3,
                              pt: 3,
                              pb: 3,
                              borderRadius: theme.spacing(1),
                            })}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography variant="subtitle2">{speakerId}</Typography>
                              <audio
                                controls
                                style={{
                                  backgroundColor: "rgb(221, 221, 221)",
                                  height: "40px",
                                  borderRadius: "30px",
                                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px 0px",
                                }}
                              >
                                <source
                                  src={speakerAudio.audioFileUrl || ""}
                                  type="audio/wav"
                                />
                                Your browser does not support the audio element.
                              </audio>
                            </Stack>
                            <FormControl>
                              <RadioGroup
                                row
                                name={`${providerSessionId}-speaker-${speakerId}`}
                                onChange={(_, value: string) =>
                                  onParticipantTypeChange(
                                    providerSessionId,
                                    speakerId,
                                    value as ParticipantType
                                  )
                                }
                              >
                                <FormControlLabel
                                  value={ParticipantType.PATIENT}
                                  control={
                                    <Radio
                                      size="small"
                                      checked={
                                        speakerMapping[providerSessionId]?.[speakerId]
                                          ?.participantType === ParticipantType.PATIENT
                                      }
                                    />
                                  }
                                  label={ParticipantType.PATIENT}
                                />
                                <FormControlLabel
                                  value={ParticipantType.PROVIDER}
                                  control={
                                    <Radio
                                      size="small"
                                      checked={
                                        speakerMapping[providerSessionId]?.[speakerId]
                                          ?.participantType === ParticipantType.PROVIDER
                                      }
                                    />
                                  }
                                  label={ParticipantType.PROVIDER}
                                />
                                <FormControlLabel
                                  value={ParticipantType.NURSE_PRACTITIONER}
                                  control={
                                    <Radio
                                      size="small"
                                      checked={
                                        speakerMapping[providerSessionId]?.[speakerId]
                                          ?.participantType === ParticipantType.NURSE_PRACTITIONER
                                      }
                                    />
                                  }
                                  label={ParticipantType.NURSE_PRACTITIONER}
                                />
                                <FormControlLabel
                                  value={ParticipantType.UNKNOWN}
                                  control={
                                    <Radio
                                      size="small"
                                      checked={
                                        speakerMapping[providerSessionId]?.[speakerId]
                                          ?.participantType === ParticipantType.UNKNOWN
                                      }
                                    />
                                  }
                                  label={ParticipantType.UNKNOWN}
                                />
                              </RadioGroup>
                            </FormControl>
                            {sessionCategory === SessionCategory.GROUP &&
                              speakerMapping[providerSessionId]?.[speakerId]?.participantType ===
                                ParticipantType.PATIENT && (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Typography variant="body1">Patient:</Typography>
                                  <Select
                                    value={patientName}
                                    onChange={e =>
                                      onPatientSelect(
                                        providerSessionId,
                                        speakerId,
                                        sessionPatientMembers.find(
                                          member => member.patientId === e.target.value
                                        ) || null
                                      )
                                    }
                                    displayEmpty
                                    renderValue={value => (value ? value : "Select Patient")}
                                    sx={{
                                      flex: 1,
                                    }}
                                  >
                                    {sessionPatientMembers?.map(patient => (
                                      <MenuItem
                                        key={patient.patientId || ""}
                                        value={patient.patientId || ""}
                                      >
                                        {`${patient.patientFirstName || ""}${
                                          patient.patientLastName ? " " : ""
                                        }${patient.patientLastName || ""}`}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </Stack>
                              )}
                          </Box>
                        );
                      })
                    ) : (
                      <Typography variant="body1">No speakers found</Typography>
                    )}
                  </Loader>
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          onClick={saveSpeakerMapping}
          loading={loading}
          loadingPosition="center"
          loadingIndicator={
            <Loader
              loading={false}
              size={"small"}
            />
          }
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default SpeakerMapping;
