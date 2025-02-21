import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base";
import useFollowUpAssessment from "./useFollowUpAssessment";
import React, { useEffect, useState } from "react";
import { convertToTitleCase, copyToClipboard } from "@/utils/helpers";
import { SessionNotes } from "@/domains/sessionNotes";
import { ContentCopy } from "@mui/icons-material";

export interface FollowUpAssessmentProps {
  notesData: SessionNotes | null;
  sessionId?: UUIDString;
}

const FollowUpAssessment: React.FC<FollowUpAssessmentProps> = ({
  notesData,
  sessionId,
}): React.ReactNode => {
  const [textCopiedSection, setTextCopiedSection] = useState("");
  const { followUpNotesData, sortSections } = useFollowUpAssessment({ notesData, sessionId });
  useEffect(() => {
    setTextCopiedSection("");
  }, []);
  let copyTimer: any = null;
  const copyText = (section: string, subSection: string, text: string) => {
    copyToClipboard(text);
    setTextCopiedSection(`${section}-${subSection}`);
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      setTextCopiedSection("");
    }, 3000);
  };
  const jsonSoapNote = notesData?.jsonSoapNote;
  if (
    !(
      jsonSoapNote &&
      (jsonSoapNote.subjective || jsonSoapNote.Subjective) &&
      (jsonSoapNote.objective || jsonSoapNote.Objective) &&
      (jsonSoapNote.assessment || jsonSoapNote.Assessment)
    )
  ) {
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
      {followUpNotesData.map((section: any) => {
        if (!section.data) {
          return <React.Fragment key={section.label}></React.Fragment>;
        }
        return (
          <Box
            key={section.label}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              {section.label}:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {Object.keys(section.data)
                .sort((subSection1, subSection2) =>
                  sortSections(subSection1, subSection2, section.label)
                )
                .filter(subSection => subSection !== "homework_assignments")
                .map((subSection: string, index: number) => {
                  const chiefComplaintValue =
                    subSection === "chief_complaint"
                      ? notesData?.jsonSoapNote?.chiefCompliantEnhanced
                        ? notesData.jsonSoapNote.chiefCompliantEnhanced
                        : section.data[subSection].result
                      : "";
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 600 }}
                        >
                          {convertToTitleCase(subSection)}:{" "}
                        </Typography>
                        {(section.data[subSection].type === "paragraph" ||
                          section.data[subSection].type === "single_line_text") && (
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() =>
                              copyText(
                                "subjective",
                                subSection,
                                subSection === "chief_complaint"
                                  ? chiefComplaintValue || ""
                                  : section.data[subSection].result || ""
                              )
                            }
                            size="small"
                            startIcon={<ContentCopy />}
                          >
                            {textCopiedSection === `subjective-${subSection}` ? "Copied" : "Copy"}
                          </Button>
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {section.data[subSection].type === "paragraph" && (
                          <FormControl
                            fullWidth
                            required
                          >
                            <TextareaAutosize
                              value={
                                subSection === "chief_complaint"
                                  ? chiefComplaintValue
                                  : section.data[subSection].result
                              }
                              readOnly={true}
                              minRows={3}
                              maxRows={10}
                            />
                          </FormControl>
                        )}
                        {section.data[subSection].type === "single_line_text" && (
                          <TextField
                            value={section.data[subSection].result}
                            sx={{
                              fontSize: "0.875rem",
                            }}
                            disabled
                          />
                        )}
                        {section.data[subSection].type === "single_choice_answer" && (
                          <RadioGroup sx={{ flexDirection: "row", gap: 2, mt: 0 }}>
                            {section.data[subSection].values_identified
                              .concat(section.data[subSection].values_remaining)
                              .concat(
                                !section.data[subSection].values_identified.includes(
                                  section.data[subSection].result
                                ) &&
                                  !section.data[subSection].values_remaining.includes(
                                    section.data[subSection].result
                                  ) &&
                                  section.data[subSection].result
                                  ? [section.data[subSection].result]
                                  : []
                              )
                              .map((value: string) => {
                                return (
                                  <FormControlLabel
                                    value={value}
                                    control={
                                      <Radio
                                        readOnly
                                        sx={{ p: 0 }}
                                      />
                                    }
                                    sx={{
                                      m: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                    label={value}
                                    checked={section.data[subSection].result === value}
                                  />
                                );
                              })}
                          </RadioGroup>
                        )}
                        {section.data[subSection].type === "multiple_choice_answers" && (
                          <RadioGroup sx={{ flexDirection: "row", gap: 2, mt: 0 }}>
                            {section.data[subSection].values_identified
                              .concat(section.data[subSection].values_remaining)
                              .map((value: string) => {
                                return (
                                  <FormControlLabel
                                    value={value}
                                    control={
                                      <Checkbox
                                        readOnly
                                        sx={{ p: 0, m: 0, opacity: 0.9 }}
                                      />
                                    }
                                    label={value}
                                    sx={{
                                      m: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                    checked={section.data[subSection].result?.includes(value)}
                                  />
                                );
                              })}
                          </RadioGroup>
                        )}
                        {section.data[subSection].type === "list_of_values" && (
                          <>
                            {section.data[subSection].result?.length > 0 ? (
                              <>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.5,
                                    padding: 1,
                                    background: "#fff",
                                    borderRadius: "5px",
                                    backdropFilter: "blur(5px)",
                                    border: "0.5px solid rgba(48, 79, 109, 0.8)",
                                  }}
                                >
                                  {section.data[subSection].result.map(
                                    (value: string, index: number) => {
                                      return (
                                        <Box
                                          key={index}
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: "5px",
                                          }}
                                        >
                                          <Typography variant="body1">{value}</Typography>
                                        </Box>
                                      );
                                    }
                                  )}
                                </Box>
                              </>
                            ) : (
                              <Box>
                                <Typography variant="body1">
                                  {section.data[subSection].explanation || "Not Identified"}
                                </Typography>
                              </Box>
                            )}
                          </>
                        )}
                      </Box>
                      {section.data[subSection].explanation && (
                        <Box>
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, lineHeight: "1" }}
                              component={"span"}
                            >
                              Explanation:
                            </Typography>{" "}
                            <Typography
                              variant="caption"
                              component={"span"}
                              sx={{ lineHeight: "1" }}
                            >
                              {section.data[subSection].explanation}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  );
                })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default FollowUpAssessment;
